import spdxLicenseList from 'spdx-license-list';
import fs from 'fs';
import axios from 'axios';
import { convert } from 'html-to-text';

import { LicenseInfo } from './types';

/*
    Get's all of the licenses from spdx-license-list and attempts to get the license text for each license.
    The license text is extracted from the html of the license page stated by spdx-license-list.

    If the license page does not exist, it falls back to the the license text from spdx.org

    Store the licenses with text in ./data/licenses-with-text.json
*/
export const runLicenseBuilder = async () => {
    const uncuratedLicensesWithoutText: { [key: string]: LicenseInfo } = {};
    const licensesWithText: { [key: string]: LicenseInfo } = {};
    const licensesWithoutText: { [key: string]: LicenseInfo } = {};

    const totalLicenses = Object.keys(spdxLicenseList).length;
    let processed = 0;

    for (const spdxIdentifier in spdxLicenseList) {
        const { name, url } = spdxLicenseList[spdxIdentifier];

        try {
            const res = await axios.get(url, { timeout: 2500 });
            const licenseText = convert(res.data, { preserveNewlines: false })
                .replace(/\s+/g, ' ')
                .trim();

            licensesWithText[spdxIdentifier] = {
                spdxIdentifier,
                name,
                url,
                licenseText,
            };

            console.log(
                `Successfully parsed: ${spdxIdentifier}. ${++processed}/${totalLicenses} processed`
            );
        } catch (err) {
            console.log(
                `Failed parsing: ${spdxIdentifier}. ${++processed}/${totalLicenses} processed`
            );

            licensesWithoutText[spdxIdentifier] = {
                spdxIdentifier,
                name,
                url,
            };
        }
    }

    console.log(
        'Finished processing all licenses. Checking if there are anymore licenses to retry...'
    );

    if (Object.keys(licensesWithoutText).length) {
        console.log(`${Object.keys(licensesWithoutText).length} more licenses to retry processing`);
        processed = 0;

        const baseSPDXUrl = 'https://spdx.org/licenses';

        for (const spdxIdentifier in licensesWithoutText) {
            const { name } = spdxLicenseList[spdxIdentifier];
            const url = `${baseSPDXUrl}/${spdxIdentifier}.html`;

            try {
                const res = await axios.get(url, { timeout: 2500 });

                const licenseHtml = res.data
                    .split(`<h2 id="licenseText">Text</h2>`)[1]
                    .split(`<h2  id="licenseHeader">Standard License Header</h2>`)[0];
                const licenseText = convert(licenseHtml, { preserveNewlines: false })
                    .replace(/\s+/g, ' ')
                    .trim();

                licensesWithText[spdxIdentifier] = {
                    spdxIdentifier,
                    name,
                    url,
                    licenseText,
                };

                console.log(
                    `Successfully parsed: ${spdxIdentifier}. ${++processed}/${totalLicenses} processed`
                );
            } catch (e) {
                console.log(
                    `Failed parsing: ${spdxIdentifier}. ${++processed}/${totalLicenses} processed`
                );

                uncuratedLicensesWithoutText[spdxIdentifier] = {
                    spdxIdentifier,
                    name,
                    url,
                };
            }
        }
    }

    fs.writeFileSync('./data/licenses-with-text.json', JSON.stringify(licensesWithText));
    fs.writeFileSync(
        './data/uncurated-licenses-without-text.json',
        JSON.stringify(uncuratedLicensesWithoutText)
    );

    console.log('Done');
};
