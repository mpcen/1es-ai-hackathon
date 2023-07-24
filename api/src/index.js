require('dotenv').config();

const express = require('express');

const license_labels = {
    LABEL_0: 'ECL-2.0',
    LABEL_1: 'GPL-3.0-only',
    LABEL_2: 'UPL-1.0',
    LABEL_3: 'CC-BY-NC-4.0',
    LABEL_4: 'EPL-1.0',
    LABEL_5: 'CC-BY-SA-4.0',
    LABEL_6: 'EUPL-1.1',
    LABEL_7: 'AGPL-3.0',
    LABEL_8: 'BSD-4-Clause',
    LABEL_9: 'GPL-2.0',
    LABEL_10: 'Zlib',
    LABEL_11: 'OSL-3.0',
    LABEL_12: 'GPL-2.0-only',
    LABEL_13: 'MIT',
    LABEL_14: 'Apache-2.0',
    LABEL_15: 'CPAL-1.0',
    LABEL_16: 'CC-BY-NC-SA-4.0',
    LABEL_17: 'CC-BY-4.0',
    LABEL_18: 'Artistic-2.0',
    LABEL_19: 'GPL-2.0+',
    LABEL_20: 'CC-BY-NC-ND-4.0',
    LABEL_21: 'GPL-2.0-or-later',
    LABEL_22: 'BSD-3-Clause-Clear',
    LABEL_23: 'EPL-2.0',
    LABEL_24: 'LGPL-2.1-or-later',
    LABEL_25: 'GPL-3.0',
    LABEL_26: 'BSL-1.0',
    LABEL_27: 'AGPL-3.0-only',
    LABEL_28: 'BUSL-1.1',
    LABEL_29: 'LGPL-2.1',
    LABEL_30: 'LGPL-3.0-only',
    LABEL_31: 'Beerware',
    LABEL_32: 'OFL-1.1',
    LABEL_33: 'BSD-2-Clause',
    LABEL_34: 'Unlicense',
    LABEL_35: 'CAL-1.0',
    LABEL_36: 'Unicode-DFS-2016',
    LABEL_37: 'CC0-1.0',
    LABEL_38: 'BSD-3-Clause',
    LABEL_39: 'CC-BY-1.0',
    LABEL_40: 'GPL-3.0+',
    LABEL_41: 'WTFPL',
    LABEL_42: '0BSD',
    LABEL_43: 'GPL-3.0-or-later',
    LABEL_44: 'CECILL-B',
    LABEL_45: 'W3C',
    LABEL_46: 'AGPL-3.0-or-later',
    LABEL_47: 'LGPL-3.0-or-later',
    LABEL_48: 'OGL-UK-3.0',
    LABEL_49: 'CC-BY-3.0',
    LABEL_50: 'MPL-2.0',
    LABEL_51: 'Unicode-TOU',
    LABEL_52: 'PolyForm-Noncommercial-1.0.0',
    LABEL_53: 'SSPL-1.0',
    LABEL_54: 'EUPL-1.2',
    LABEL_55: 'LGPL-2.1-only',
    LABEL_56: 'MITNFA',
    LABEL_57: 'CC-BY-NC-3.0',
    LABEL_58: 'CECILL-2.1',
    LABEL_59: 'LGPL-3.0+',
    LABEL_60: 'CC-BY-ND-3.0',
    LABEL_61: 'BSD-2-Clause-FreeBSD',
    LABEL_62: 'BSD-3-Clause-Attribution',
    LABEL_63: 'CC-BY-NC-SA-3.0',
    LABEL_64: 'Hippocratic-2.1',
    LABEL_65: 'BlueOak-1.0.0',
    LABEL_66: 'ISC',
    LABEL_67: 'BSD-2-Clause-Views',
    LABEL_68: 'MPL-1.1',
    LABEL_69: 'Parity-6.0.0',
    LABEL_70: 'NASA-1.3',
    LABEL_71: 'MulanPSL-2.0',
    LABEL_72: 'NCSA',
    LABEL_73: 'CC-BY-SA-3.0',
    LABEL_74: 'AGPL-1.0',
    LABEL_75: 'LGPL-3.0',
    LABEL_76: 'BSD-2-Clause-Patent',
    LABEL_77: 'MIT-0',
    LABEL_78: 'LGPL-2.1+',
    LABEL_79: 'Fair',
    LABEL_80: 'Elastic-2.0',
    LABEL_81: 'MS-PL',
    LABEL_82: 'BSD-Source-Code',
    LABEL_83: 'LGPL-2.0+',
    LABEL_84: 'ODbL-1.0',
    LABEL_85: 'OSL-2.0',
    LABEL_86: 'BSD-3-Clause-LBNL',
    LABEL_87: 'CECILL-C',
    LABEL_88: 'CC-BY-SA-2.0',
    LABEL_89: 'RPL-1.5',
    LABEL_90: 'MirOS',
    LABEL_91: 'Apache-1.1',
    LABEL_92: 'JSON',
    LABEL_93: 'CDDL-1.0',
    LABEL_94: 'AML',
    LABEL_95: 'Python-2.0',
    LABEL_96: 'MPL-2.0-no-copyleft-exception',
    LABEL_97: 'CC-BY-NC-ND-3.0',
    LABEL_98: 'IPL-1.0',
    LABEL_99: 'NPOSL-3.0',
    LABEL_100: 'CC-BY-NC-ND-2.0',
    LABEL_101: 'BSD-2-Clause-NetBSD',
    LABEL_102: 'X11',
    LABEL_103: 'MS-RL',
    LABEL_104: 'SGI-B-2.0',
    LABEL_105: 'GPL-1.0-only',
    LABEL_106: 'zlib-acknowledgement',
    LABEL_107: 'AFL-2.0',
    LABEL_108: 'LGPL-2.0',
    LABEL_109: 'MIT-feh',
    LABEL_110: 'SAX-PD',
    LABEL_111: 'CPOL-1.02',
    LABEL_112: 'LGPL-2.0-or-later',
    LABEL_113: 'CDDL-1.1',
    LABEL_114: 'BSD-3-Clause-No-Nuclear-Warranty',
    LABEL_115: 'CC-BY-ND-4.0',
    LABEL_116: 'AFL-2.1',
    LABEL_117: 'Apache-1.0',
    LABEL_118: 'SMPPL',
    LABEL_119: 'PostgreSQL',
    LABEL_120: 'GFDL-1.2',
    LABEL_121: 'BSD-Protection',
    LABEL_122: 'CC-BY-NC-SA-2.5',
    LABEL_123: 'ODC-By-1.0',
    LABEL_124: 'FSFUL',
    LABEL_125: 'W3C-20150513',
    LABEL_126: 'AAL',
    LABEL_127: 'CC-BY-NC-SA-2.0',
    LABEL_128: 'BSD-1-Clause',
    LABEL_129: 'bzip2-1.0.6',
    LABEL_130: 'NLPL',
    LABEL_131: 'AFL-3.0',
    LABEL_132: 'GPL-3.0-with-autoconf-exception',
    LABEL_133: 'APSL-2.0',
};

const getLicenseForText = async (licenseText) => {
    const { pipeline, env } = await import('@xenova/transformers');

    env.localModelPath = './src/models';
    env.allowRemoteModels = false;

    const classifier = await pipeline('text-classification', 'mpcen/legal-001');
    const result = await classifier(licenseText);

    return license_labels[result[0].label];
};

const run = async () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => res.send('API Running'));

    app.post('/', async (req, res) => {
        const { text } = req.body;

        if (!text) return res.status(400).send('Missing text');

        try {
            const license = await getLicenseForText(text);

            res.status(200).send(license);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        }
    });

    app.listen(process.env.PORT, () => console.log('Server running on port:', process.env.PORT));
};

run();
