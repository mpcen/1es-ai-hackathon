require('dotenv').config();

import { runComponentFinder } from './scripts/component-finder';
import { runLicenseBuilder } from './scripts/license-builder';
import { RunScript } from './types';
import { closeDBConnection, getClearlyDefinedDb } from './clients/mongo';
import { moreDataFinder } from './scripts/more-data';
import { runLicenseTextCleaner } from './scripts/license-text-cleaner';
import { runSPDXXMLFeed } from './scripts/spdx-feed';
import { runFinal } from './final';

const run = async () => {
    const runScript = process.env.RUN_SCRIPT;

    if (!runScript) {
        throw new Error('You must enter a RUN_SCRIPT of type RunScript');
    }

    const { db, mongoClient } = await getClearlyDefinedDb();

    switch (runScript) {
        case RunScript.LicenseBuilder:
            await runLicenseBuilder();
            break;
        case RunScript.ComponentFinder:
            await runComponentFinder(db);
            break;

        case RunScript.MoreDataFinder:
            await moreDataFinder(db);
            break;

        case RunScript.LicenseTextCleaner:
            runLicenseTextCleaner();
            break;

        case RunScript.ParseSPDXFeed:
            runSPDXXMLFeed();
            break;

        case RunScript.RunFinal:
            runFinal();
            break;

        default:
            throw new Error('No script to run');
    }

    await closeDBConnection(mongoClient);
};

run();
