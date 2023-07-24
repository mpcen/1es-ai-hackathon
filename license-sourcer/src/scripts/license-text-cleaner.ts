import fs from 'fs';

export const runLicenseTextCleaner = () => {
    const licenseId = 'ADSL';
    const licenseText = `
    Copyright (c) 1997,1998,2002,2007 Adobe Systems Incorporated

Permission is hereby granted, free of charge, to any person obtaining a copy of this documentation file to use, copy, publish, distribute, sublicense, and/or sell copies of the documentation, and to permit others to do the same, provided that:

- No modification, editing or other alteration of this document is allowed; and
- The above copyright notice and this permission notice shall be included in all copies of the documentation.
Permission is hereby granted, free of charge, to any person obtaining a copy of this documentation file, to create their own derivative works from the content of this document to use, copy, publish, distribute, sublicense, and/or sell the derivative works, and to permit others to do the same, provided that the derived work is not represented as being a copy or version of this document.

Adobe shall not be liable to any party for any loss of revenue or profit or for indirect, incidental, special, consequential, or other similar damages, whether based on tort (including without limitation negligence or strict liability), contract or other legal or equitable grounds even if Adobe has been advised or had reason to know of the possibility of such damages. The Adobe materials are provided on an "AS IS" basis. Adobe specifically disclaims all express, statutory, or implied warranties relating to the Adobe materials, including but not limited to those concerning merchantability or fitness for a particular purpose or non-infringement of any third party rights regarding the Adobe materials.
    `;

    fs.writeFileSync(
        `./data/licenses/${licenseId}.json`,
        JSON.stringify({
            license: licenseId.trim(),
            text: licenseText.replace(/\s+/g, ' ').trim(),
        })
    );
};
