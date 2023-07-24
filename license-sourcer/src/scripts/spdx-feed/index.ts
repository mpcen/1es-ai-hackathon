import fs from 'fs';
import axios from 'axios';
import { approvedLicenses, npmLicenses } from '../licenses';

import licensesJson from './licenses-with-text.json';

const data: any = [];
let count = 0;

export const runSPDXXMLFeed = async () => {
    for (const license in licensesJson as any) {
        if (approvedLicenses.includes(license) && npmLicenses.includes(license)) {
            const text = (licensesJson as any)[license].licenseText;

            data.push({ license, text: text.replace(/\s+/g, ' ').trim() });
            count++;
        }
    }

    console.log(count);
    fs.writeFileSync('./data/spdx-actual-feed.json', JSON.stringify(data, null, 2));
};
