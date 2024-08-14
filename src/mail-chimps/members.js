const mailchimp = require("../mail-chimps/config");
const md5 = require("md5");

const {
    successResponse,
    errorResponse
} = require("../utils/response");

const {
    MAIL_CHIMP_AUDIENCE_LIST_ID
} = process.env;

const   updateAudienceMemberStatus = async (req, res) => {
    try {

        const response = await mailchimp.lists.updateListMember(
            MAIL_CHIMP_AUDIENCE_LIST_ID,
            md5("kumar002345k@gmail.com"),
            {
                status: "subscribed"
            }
        );
        // console.log(response);
        return successResponse(res, 200, "User data updated successfully", response);

    } catch (error) {
        console.error("Mailchimp API Error:", error.response ? error.response.body : error.message);
        return errorResponse(res, 500, error.message);
    }
}

module.exports = {
    updateAudienceMemberStatus
};