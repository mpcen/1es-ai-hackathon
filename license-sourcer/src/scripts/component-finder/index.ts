import { Db } from 'mongodb';
import spdxLicenseList from 'spdx-license-list';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';

import { DefinitionTrimmed } from '../../clients/mongo/types';

export const runComponentFinder = async (db: Db) => {
    const componentTypes = ['pypi', 'npm', 'nuget'];
    const totalCount = await db
        .collection('definitions-trimmed')
        .find({ 'coordinates.type': { $in: componentTypes } })
        .count();

    const SCOPED_LICENSE = 'LGPL-2.0';

    // const licenses = Object.keys({ ...spdxLicenseList, NOASSERTION: null, OTHER: null });
    const licenses = [SCOPED_LICENSE];

    console.log(licenses);
    const componentNameSet = new Set<string>();
    const knownLicenseFileNames = ['LICENSE', 'LICENCE', 'COPYING'];
    const samples = [];
    const maxLicenseSampleSize = 250;
    const sampleCounts: { [key: string]: number } = {};
    let lastId = '';
    let licensesProcessed = 0;
    let componentsProcessed = 0;

    console.log('Total count: ', totalCount);

    for (const license of licenses) {
        console.log(`Processing license: ${license}`);

        while (true) {
            if (
                typeof sampleCounts[license] === 'number' &&
                sampleCounts[license] >= maxLicenseSampleSize
            ) {
                console.log(`Processed ${componentsProcessed}/${totalCount} components`);
                break;
            }

            console.log(`Calling DB with lastId: ${lastId}, license: ${license}`);

            const documents = await db
                .collection('definitions-trimmed')
                .find<DefinitionTrimmed>({
                    _id: {
                        $gt: lastId as any,
                    },
                    'coordinates.type': { $in: componentTypes },
                    'licensed.declared': license,
                })
                .sort({ _id: 1 })
                .limit(250)
                .toArray();

            if (!documents.length) {
                console.log(`Processed ${componentsProcessed}/${totalCount} components`);
                break;
            }

            for (const document of documents) {
                componentsProcessed++;

                const { type, provider, name, revision, namespace } = document.coordinates;
                const coordinates = `${type}/${provider}/${namespace ?? '-'}/${name}/${revision}`;

                console.log(
                    `processing component: ${coordinates}, license: ${license}, samples: ${JSON.stringify(
                        sampleCounts,
                        null,
                        2
                    )}`
                );

                if (componentNameSet.has(name)) {
                    continue;
                }

                const url = `https://api.clearlydefined.io/harvest/${coordinates}?form=raw`;

                try {
                    const response = await axios.get(url);
                    const { data } = response;

                    const scanners = Object.keys(data);

                    for (const scanner of scanners) {
                        if (scanner === 'clearlydefined') {
                            const foundFileSHAs = [];
                            const key = Object.keys(data[scanner])[
                                Object.keys(data[scanner]).length - 1
                            ];
                            const { files } = data[scanner][key];

                            for (const knownLicenseFileName of knownLicenseFileNames) {
                                const foundFile = files.find((f: any) =>
                                    f.path.includes(`package/${knownLicenseFileName}`)
                                );

                                if (foundFile) {
                                    foundFileSHAs.push(foundFile.hashes.sha256);
                                }
                            }

                            if (foundFileSHAs.length) {
                                let response: AxiosResponse<any, any>;

                                try {
                                    response = await axios.get(
                                        `https://api.clearlydefined.io/attachments/${foundFileSHAs[0]}`
                                    );
                                } catch (e) {
                                    response = await axios.get(
                                        `https://archive.softwareheritage.org/api/1/content/${foundFileSHAs[0]}/raw`
                                    );
                                }

                                const licenseText = response.data;

                                samples.push({
                                    text: licenseText.replace(/\s+/g, ' ').trim(),
                                    license,
                                });

                                fs.writeFileSync(
                                    `./data/training-data/licenses/${SCOPED_LICENSE}.json`,
                                    JSON.stringify(samples)
                                );

                                if (!sampleCounts[license]) {
                                    sampleCounts[license] = 0;
                                }

                                sampleCounts[license]++;

                                console.log(
                                    `Sample Counts: ${JSON.stringify(sampleCounts, null, 2)}`
                                );

                                componentNameSet.add(name);

                                if (sampleCounts[license] >= maxLicenseSampleSize) {
                                    break;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error(e);
                }

                console.log(
                    `Processed ${componentsProcessed}/${totalCount} components and ${licensesProcessed}/${licenses.length} licenses`
                );

                if (sampleCounts[license] >= maxLicenseSampleSize) {
                    break;
                }
            }

            lastId = documents[documents.length - 1]._id;

            if (sampleCounts[license] >= maxLicenseSampleSize) {
                break;
            }
        }

        lastId = '';

        console.log(`Processed ${++licensesProcessed}/${licenses.length} licenses`);
    }
};
