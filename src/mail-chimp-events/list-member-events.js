const mailchimp = require("../mail-chimps/config");
const md5 = require("md5");
const {
    successResponse,
    errorResponse
} = require("../utils/response");

const listMemberEvents = async (req, res) => {
    try {

        const member = await mailchimp.lists.getListMemberEvents(
            process.env.MAIL_CHIMP_AUDIENCE_LIST_ID,
            md5("kumar002345k@gmail.com")
        );
        console.log(member);
        return successResponse(res, 200, "User subscribed events list", member);
    } catch (error) {
        console.error("Mailchimp API Error:", error.response ? error.response.body : error.message);
        return errorResponse(res, 500, error.message);
    }
}

const createMemberEvents = async (req, res) => {
    try {

        const member = await mailchimp.lists.createListMemberEvent(
            process.env.MAIL_CHIMP_AUDIENCE_LIST_ID,
            md5("kumar002345k@gmail.com"),
            { name: "purchased" }
        );
        console.log(member);
        return successResponse(res, 200, "Subscribed user event created", member);
    } catch (error) {
        console.error("Mailchimp API Error:", error.response ? error.response.body : error.message);
        return errorResponse(res, 500, error.message);
    }
}


module.exports = {
    listMemberEvents,
    createMemberEvents
}