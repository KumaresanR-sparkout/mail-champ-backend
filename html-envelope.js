function makeEnvelope(args) {
    let signer = docusign.Signer.constructFromObject({
        email: args.email,
        name: args.name,
        clientUserId: args.client_id,
        roleName: 'Signer',
    });

    const price1 = 5;
    const formulaTab1 = docusign.FormulaTab.constructFromObject({
        font: 'helvetica',
        fontSize: 'size11',
        fontColor: 'black',
        anchorString: '/l1e/',
        anchorYOffset: '-8',
        anchorUnits: 'pixels',
        anchorXOffset: '105',
        tabLabel: 'l1e',
        formula: `[l1q] * ${price1}`,
        roundDecimalPlaces: '0',
        required: 'true',
        locked: 'true',
        disableAutoSize: 'false',
    });

    const price2 = 150;
    const formulaTab2 = docusign.FormulaTab.constructFromObject({
        font: 'helvetica',
        fontSize: 'size11',
        fontColor: 'black',
        anchorString: '/l2e/',
        anchorYOffset: '-8',
        anchorUnits: 'pixels',
        anchorXOffset: '105',
        tabLabel: 'l2e',
        formula: `[l2q] * ${price2}`,
        roundDecimalPlaces: '0',
        required: 'true',
        locked: 'true',
        disableAutoSize: 'false',
    });

    const formulaTab3 = docusign.FormulaTab.constructFromObject({
        font: 'helvetica',
        fontSize: 'size11',
        fontColor: 'black',
        anchorString: '/l3t/',
        anchorYOffset: '-8',
        anchorUnits: 'pixels',
        anchorXOffset: '105',
        tabLabel: 'l3t',
        formula: '[l1e] + [l2e]',
        roundDecimalPlaces: '0',
        required: 'true',
        locked: 'true',
        disableAutoSize: 'false',
        bold: 'true',
    });

    const signerTabs = docusign.Tabs.constructFromObject({
        formulaTabs: [formulaTab1, formulaTab2, formulaTab3]
    });
    signer.tabs = signerTabs;

    // Add the recipients to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
        signers: [signer]
    });

    // add the document
    let htmlDefinition = new docusign.DocumentHtmlDefinition();
    htmlDefinition.source = getHTMLDocument(args);

    let document = new docusign.Document();
    document.name = './docsign.html'; // can be different from actual file name
    document.documentId = '1'; // a label used to reference the doc
    document.htmlDefinition = htmlDefinition;

    // create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = 'Example Signing Document';
    env.documents = [document];
    env.recipients = recipients;
    env.status = 'sent'; //set status for sent

    return env;
}

/**
 * Gets the HTML document
 * @function
 * @private
 * @param {Object} args parameters for the envelope
 * @returns {string} A document in HTML format
 */

function getHTMLDocument(args) {

    let docHTMLContent = fs.readFileSync(args.docFile, { encoding: 'utf8' });

    // Substitute values into the HTML
    // Substitute for: {signerName}, {signerEmail}, {ccName}, {ccEmail}
    return docHTMLContent
        .replace('{signerName}', args.name)
        .replace('{signerEmail}', args.email)
        .replace('{ccName}', 'kumaresan')
        .replace('{ccEmail}', 'kumaresan123@yopmail.com')
        .replace('/sn1/', '<ds-signature data-ds-role=\"signer\"/>')
        .replace('/l1q/', '<input data-ds-type=\"number\" name=\"l1q\"/>')
        .replace('/l2q/', '<input data-ds-type=\"number\" name=\"l2q\"/>');
}

function makeRecipientViewRequest(args) {

    let viewRequest = new docusign.RecipientViewRequest();

    viewRequest.returnUrl = args.dsReturnUrl + '?state=123';

    viewRequest.authenticationMethod = 'none';

    // Recipient information must match embedded recipient info
    // we used to create the envelope.
    viewRequest.email = args.email;
    viewRequest.userName = args.name;
    viewRequest.clientUserId = args.cliend_id;

    return viewRequest;
}