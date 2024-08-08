const express = require('express');
const fs = require('fs');
const docusign = require('docusign-esign');

const app = express();

app.use(express.json())

// DOCSIGN CONSTANTS ARE DECLARED HERE

// console.log(process.env.ACCOUNT_ID)

let dsApiClient = new docusign.ApiClient(); //Api client for calling docsign api's

//Setting client login to obtain jwt token
dsApiClient.setOAuthBasePath('account-d.docusign.com')

const docusignScopes = [
    'signature',
    'impersonation'
];


const jwtLifeSeconds = 60 * 60;
// const jwtLifeMilliseconds = jwtLifeSeconds * 1000;
// const jwtExpiration = Date.now() + jwtLifeMilliseconds;

//creating Authorization token

const generateToken = async (req, res) => {
    try {
        //creating client and getting acess authorization token
        const results = await dsApiClient.requestJWTUserToken(
            process.env.INTEGRATION_KEY,
            process.env.USER_ID,
            docusignScopes,
            fs.readFileSync('./rsa.key'),
            jwtLifeSeconds
        );

        // console.log('Docsign tokens', results.body.access_token);
        return { accessToken: results.body.access_token }
    } catch (error) {
        console.log('Acess token error:', error.message);
    }

};

app.get('/', (req, res) => {
    return res.send('Application working...');
});


//Create envelope for user to send 
function makeEnvelope(name, email, company) {

    let env = new docusign.EnvelopeDefinition();
    env.templateId = process.env.TEMPLATE_ID; // Ensure TEMPLATE_ID is correctly set


    let signer1 = docusign.TemplateRole.constructFromObject({
        email: email,
        name: name,
        clientUserId: '10016',
        roleName: 'signer',
    });

    // Add recipient roles to the envelope
    env.templateRoles = [signer1];

    // Add a subject line for the envelope
    env.emailSubject = 'Please sign this document';

    // Set the envelope status to 'sent'
    env.status = "sent";

    return env;
}


function makeRecipientViewRequest(email, name) {

    let viewRequest = new docusign.RecipientViewRequest();

    viewRequest.returnUrl = 'http://localhost:3000/success';

    viewRequest.authenticationMethod = 'none';

    // Recipient information must match embedded recipient info
    // we used to create the envelope.
    viewRequest.email = email;
    viewRequest.userName = name;
    viewRequest.clientUserId = '10016';

    return viewRequest;
}

//This one executes once the user successfully verified 
app.get('/success', (req, res) => {
    console.log('signed in')
    return res.send('signed in successfully...')
})


let envelopesApi = '';

//create envelope for user to send verification request
app.post('/edocusign', async (req, res) => {
    //setting base path for edocusign
    dsApiClient.setBasePath(process.env.BASE_PATH_DEV);

    const { accessToken } = await generateToken();
    console.log("Acess-Token:", accessToken);

    //setting default header
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

    envelopesApi = new docusign.EnvelopesApi(dsApiClient);

    const envelope = await makeEnvelope('kumaresan', 'kumaresan123@yopmail.com', 'kumaresan legal organization');

    let results = await envelopesApi.createEnvelope(process.env.ACCOUNT_ID, {
        envelopeDefinition: envelope,
    });

    const envelopeId = results.envelopeId;
    console.log('envelope:', results);
    const viewRequest = await makeRecipientViewRequest('kumaresan123@yopmail.com', 'kumaresan')
    console.log('viewrequest:', viewRequest)
    // return res.send('123456')

    results = await envelopesApi.createRecipientView(process.env.ACCOUNT_ID, envelopeId, {
        recipientViewRequest: viewRequest,
    });


    console.log("results_url:", results.url);
    // res.redirect(results.url);
    return res.json({ "results_url": results.url });
})


function getHTMLDocument(args) {

    let docHTMLContent = fs.readFileSync('./docsign.html', { encoding: 'utf8' });

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

function makeEnvelope2(args) {

    let signer = docusign.Signer.constructFromObject({
        email: args.email,
        name: args.name,
        clientUserId: args.client_id,
        recipientId: '1',
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
    document.name = 'docsign.html'; // can be different from actual file name
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

function makeRecipientViewRequest2(args) {

    let viewRequest = new docusign.RecipientViewRequest();

    viewRequest.returnUrl = 'http://localhost:3000/success';

    viewRequest.authenticationMethod = 'email';

    // Recipient information must match embedded recipient info
    // we used to create the envelope.
    viewRequest.email = args.email;
    viewRequest.userName = args.name;
    viewRequest.clientUserId = args.client_id;

    return viewRequest;
}

app.post('/edocusign-html', async (req, res) => {
    //setting base path for edocusign
    dsApiClient.setBasePath(process.env.BASE_PATH_DEV);

    const { accessToken } = await generateToken();
    console.log("Acess-Token:", accessToken);

    //setting default header
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

    envelopesApi = new docusign.EnvelopesApi(dsApiClient);

    const args = {
        name: "kumaresan",
        email: "kumaresan1234@yopmail.com",
        client_id: 1234567
    }

    const envelope = await makeEnvelope2(args)

    console.log("envelope:", envelope)

    // Step 2. Send the envelope
    let results = await envelopesApi.createEnvelope(process.env.ACCOUNT_ID, {
        envelopeDefinition: envelope,
    });

    let envelopeId = results.envelopeId;

    const viewRequest = await makeRecipientViewRequest2(args)

    console.log("recipent-results:", viewRequest)


    results = await envelopesApi.createRecipientView(process.env.ACCOUNT_ID, envelopeId, {
        recipientViewRequest: viewRequest,
    });

    console.log(results);
    return res.json({ "results_url": results.url });
})



app.listen(3000, () => {
    console.log('Server started at port 3000');
});




// const sendEnvelopeFromTemplate = async () => {
//     try {


//         // Define envelope arguments
//         const envelopeArgs = {
//             name: 'Kumaresan',
//             email: 'kumaresan123@yopmail.com',
//             company: 'Kumaresan legal organization'
//         };

//         // Create the envelope
//         let envelope = makeEnvelope(envelopeArgs.name, envelopeArgs.email, envelopeArgs.company);

//         // Send the envelope
//         let results = await envelopesApi.createEnvelope(accountId, {
//             envelopeDefinition: envelope,
//         });

//         console.log('Envelope sent successfully:', results);
//     } catch (error) {
//         console.error('Error sending envelope:', error);
//         if (error.response) {
//             console.error('Error response body:', error.response.body);
//         }
//     }
// };

// Call the function to send the envelope
// sendEnvelopeFromTemplate();
