const mailchimp = require("./config");

const {
    successResponse,
    errorResponse
} = require("../utils/response");

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

module.exports = {
    accountPermission
}