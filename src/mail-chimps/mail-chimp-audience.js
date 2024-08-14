const mailchimp = require("./config");

const {
    successResponse,
    errorResponse
} = require("../utils/response");

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

//Get information about all lists in the account.
const mailChimpAudienceLists = async (req, res) => {
    try {
        const audienceLists = await mailchimp.lists.getAllLists();
        console.log(audienceLists);

        return successResponse(res, 200, "Mail chimp audience lists", audienceLists);

    } catch (error) {
        console.error("Mailchimp API Error:", error.response ? error.response.body : error.message);
        return errorResponse(res, 500, error.message);
    }
}

//stay stuned because this one is not working, we will back soon...
//for free plan we have one option to create audience lists 
const createMailChampAudienceList = async (req, res) => {
    try {
        const {
            NAME, ADDRESS1, CITY, ZIP, STATE, COUNTRY, MAIL_CHIMP_EMAIL_FOOTER,
            COMPANY, CONTACT_NAME, EMAIL_ADDRESS, LANGUAGE, EMAIL_OPTION
        } = process.env;

        const response = await mailchimp.lists.createList({
            name: NAME,
            permission_reminder: MAIL_CHIMP_EMAIL_FOOTER,
            email_type_option: false,
            contact: {
                company: COMPANY,
                address1: ADDRESS1,
                city: CITY,
                country: COUNTRY,
            },
            campaign_defaults: {
                from_name: CONTACT_NAME,
                from_email: EMAIL_ADDRESS,
                subject: "",
                language: LANGUAGE,
            },
        });
        console.log(response);
        return successResponse(res, 200, 'Mailchimp audience create list', response);
    } catch (error) {
        console.error("Mailchimp API Error:", error.response ? error.response.body : error.message);
        return errorResponse(res, 500, error.message);
    }
}

//Get information about a specific list in your Mailchimp account.
//Results include list members who have signed up but haven't confirmed their subscription yet 
//and unsubscribed or cleaned.

const mailChimpAudienceUserLists = async (req, res) => {
    try {

        const audienceLists = await mailchimp.lists.getList(process.env.MAIL_CHIMP_AUDIENCE_LIST_ID);

        console.log(audienceLists);
        return successResponse(res, 200, "Audience Lists", audienceLists);
    } catch (error) {
        console.error("Mailchimp API Error:", error.response ? error.response.body : error.message);
        return errorResponse(res, 500, error.message);
    }
}

const updateAudienceSettings = async (req, res) => {
    try {
        const {
            NAME, ADDRESS1, CITY, ZIP, STATE, COUNTRY, MAIL_CHIMP_EMAIL_FOOTER,
            COMPANY, CONTACT_NAME, EMAIL_ADDRESS, LANGUAGE, EMAIL_OPTION
        } = process.env;

        const response = await mailchimp.lists.updateList(process.env.MAIL_CHIMP_AUDIENCE_LIST_ID, {
            name: NAME,
            permission_reminder: MAIL_CHIMP_EMAIL_FOOTER,
            email_type_option: false,
            contact: {
                company: COMPANY,
                zip: ZIP
            }
        });
        console.log(response);
        return successResponse(res, 200, 'Updated mailchimp audience settings', response);
    } catch (error) {
        console.error("Mailchimp API Error:", error.response ? error.response.body : error.message);
        return errorResponse(res, 500, error.message);
    }
}

module.exports = {
    mailChimpChampians,
    mailChimpAudience,
    mailChimpAudienceLists,
    createMailChampAudienceList,
    mailChimpAudienceUserLists,
    updateAudienceSettings
};
