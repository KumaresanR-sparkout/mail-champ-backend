const {
    successResponse,
    errorResponse
} = require("../utils/response");

const updateStatusViaWebHook = async (req, res) => {
    try {
        const { type, data } = req.body;
        console.log("webhook called");
        console.log("webhook type:",type);
        console.log("whook data:",data);
        return res.json({ message: 'webhook status accepted' });
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, error.message);
    }
};

module.exports = {
    updateStatusViaWebHook
};