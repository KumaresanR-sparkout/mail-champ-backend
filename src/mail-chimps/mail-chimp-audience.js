const mailchimp = require("@mailchimp/mailchimp_marketing");
const {
    successResponse,
    errorResponse
} = require("../utils/response");

//Mailchimp configurations
mailchimp.setConfig({
    apiKey: process.env.MAIL_CHIMP_API_KEY, //your mail chimp api key
    server: process.env.MAIL_CHIMP_API_SERVER, ////your mail chimp server
});

//It checks the mail champ api connected are not
const mailChimpHealthCheck = async (req, res) => {
    try {
        const response = await mailchimp.ping.get();
        console.log(response);
        return successResponse(res, 200, 'Mail champ health status', response)
    } catch (error) {
        console.error(error);
        return errorResponse(res, 500, error.message);
    }
}

//check user account permission
const accountPermission = async (req, res) => {
    try {
        const response = await mailchimp.root.getRoot();
        console.log(response);
        return successResponse(res, 200, 'User mailchamp role permission', response);
    } catch (error) {
        console.error(error);
        return errorResponse(res, 500, error.message);
    }
}


// const event = {
//     name: "Big sale"
// };

// const footerContactInfo = {
//     company: "Kumaresan legal organization",
//     address1: "Kendanahalli,palacode",
//     city: "Marandahalli",
//     state: "Tamilnadu",
//     zip: "636806",
//     country: "IN"
// };

// const campaignDefaults = {
//     from_name: "Kumaresan",
//     from_email: "kumar002345k@gmail.com",
//     subject: "Big Sale",
//     language: "EN_US"
// };

//
const mailChimpChampians = async (req, res) => {
    try {

        const response = await mailchimp.campaigns.create({ type: "plaintext" });
        console.log(response);

        return successResponse(res, 200, 'Email marketing audience created', response);
    } catch (error) {
        console.error('Mailchimp API Error:', error.response ? error.response.body : error.message);
        return errorResponse(res, 500, error.message);
    }
}

const mailChimpAudience = async (req, res) => {
    try {
        //destructure req.body object property
        const {
            first_name,
            last_name,
            email,
            birth_date,
            address,
            city,
            state,
            zip_code,
            phone_number
        } = req.body;

        const date = new Date(birth_date);
        let formatedDate = date.toISOString().split('T')[0]; // date should be in [MM/DD]

        //make sure to read documentation for more fields https://mailchimp.com/developer/marketing/docs/merge-fields/#structure
        const contactData = {
            email_address: email,
            status: "subscribed", // should be in any one of the type ['subscribed', 'unsubscribed', 'cleaned', or 'pending']
            merge_fields: {
                FNAME: first_name,
                LNAME: last_name,
                PHONE: phone_number,
                BIRTHDAY: formatedDate.replace(/-/g, '/'),
                ADDRESS: {
                    addr1: address,
                    city: city,
                    state: state,
                    zip: zip_code,
                }
            }
        };

        const response = await mailchimp.lists.addListMember(process.env.MAIL_CHIMP_AUDIENCE_LIST_ID, contactData);

        console.log(`Successfully added contact with id: ${response.id}`);
        return successResponse(res, 200, 'Contact added successfully', response);
    }
    catch (error) {
        console.error('Mailchimp API Error:', error.response ? error.response.body : error.message);
        return errorResponse(res, 500, error.message);
    }
}


module.exports = {
    mailChimpHealthCheck,
    mailChimpChampians,
    mailChimpAudience,
    accountPermission
}