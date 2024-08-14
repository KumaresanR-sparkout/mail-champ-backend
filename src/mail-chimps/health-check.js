const mailchimp = require("./config");

const {
    successResponse,
    errorResponse
} = require("../utils/response");


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
};

module.exports = {
    mailChimpHealthCheck
};
