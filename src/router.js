const express = require('express');
const {
    mailChimpHealthCheck,
    accountPermission,
    mailChimpChampians,
    mailChimpAudience
} = require("./mail-chimps/mail-chimp-audience");

//Validations
const {
    mailChimpAudienceValidate
} = require("./validations/mail-chimp-validate");

//routers
const router = express.Router();

router.get('/', (req, res) => {
    return res.json({ message: 'Application working...' });
});

router.get('/mailchimp-health', mailChimpHealthCheck);
router.get('/mailchimp-account-role', accountPermission);
router.post('/mailchimp-champians', mailChimpChampians);
router.post('/mailchimp-audience', [mailChimpAudienceValidate], mailChimpAudience);


module.exports = router;