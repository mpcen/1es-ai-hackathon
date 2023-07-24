import fs from 'fs';
import finalDataJson from './final-data.json';
import spdxLicenses from './spdx-licenses.json';
import axios from 'axios';

export const runFinal = async () => {
    const licenseCountMap: any = {};
    const newData = [];

    for (const licenseObj of finalDataJson as any) {
        const license = licenseObj.license;

        if (!licenseCountMap[license]) {
            licenseCountMap[license] = 0;
        }

        licenseCountMap[license]++;
    }

    for (const license in licenseCountMap) {
        if (licenseCountMap[license] < 50) {
            try {
                const spdxLicense = spdxLicenses['licenses'].find((l) => l.licenseId === license);
                const res = await axios.get(spdxLicense!.detailsUrl);
                const text = res.data.licenseText;

                for (let i = 0; i < 25; i++) {
                    newData.push({ license, text });
                }

                console.log('Added', license);
            } catch (err) {
                debugger;
            }
        }

        fs.writeFileSync('./new-data.json', JSON.stringify(newData, null, 2));
    }
};
