const express = require('express');
const {
    mailChimpChampians,
    mailChimpAudience,
    mailChimpAudienceLists,
    mailChimpAudienceUserLists,
    createMailChampAudienceList,
    updateAudienceSettings
} = require("./mail-chimps/mail-chimp-audience");

const {
    mailChimpHealthCheck
} = require("./mail-chimps/health-check");

const {
    accountPermission
} = require("./mail-chimps/account-permission");

const {
    updateAudienceMemberStatus
} = require("./mail-chimps/members");
//Validations
const {
    mailChimpAudienceValidate
} = require("./validations/mail-chimp-validate");

const {
    updateStatusViaWebHook
} = require("./mail-chimps/weeb-hook");
//routers
const router = express.Router();

router.post('/', (req, res) => {
    const { type, data } = req.body;
    console.log("webhook called");
    console.log("webhook type:", type);
    console.log("whook data:", data);
    return res.json({ message: 'webhook status accepted' });
});

router.get('/mailchimp-health', mailChimpHealthCheck);
router.get('/mailchimp-account-role', accountPermission);
router.post('/mailchimp-champians', mailChimpChampians);
router.post('/mailchimp-audience', [mailChimpAudienceValidate], mailChimpAudience);
router.get('/mailchimp-audience/lists', mailChimpAudienceLists);
router.post('/mailchimp-audience-create', createMailChampAudienceList);
router.get('/mailchimp-audience-user/lists', mailChimpAudienceUserLists);
router.patch('/mailchimp-audience-settings', updateAudienceSettings);
router.patch('/mailchimp-audience-user', updateAudienceMemberStatus);
router.post("/webhook", updateStatusViaWebHook);
 


module.exports = router;