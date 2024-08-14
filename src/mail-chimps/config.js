const mailchimp = require("@mailchimp/mailchimp_marketing");


//Mailchimp configurations
mailchimp.setConfig({
    apiKey: process.env.MAIL_CHIMP_API_KEY, //your mail chimp api key
    server: process.env.MAIL_CHIMP_API_SERVER, //your mail chimp server
});


module.exports = mailchimp;