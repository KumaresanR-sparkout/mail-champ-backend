const Joi = require("joi");
const {
    errorResponse
} = require("../utils/response"); // importing error response function in utils folder

const mailChimpAudienceValidate = (req, res, next) => {
    //Email pattern for validation
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().pattern(emailPattern).messages({
            'string.pattern.base': 'Invalid email format'
        }).required(),
        phone_number: Joi.string()
            .pattern(/^\d+$/) // Ensures only digits are allowed
            .min(4) // Minimum length of 4 digits
            .max(16) // Maximum length of 16 digits
            .messages({
                'string.base': 'Phone number must be a string.',
                'string.empty': 'Phone number cannot be empty.',
                'string.pattern.base': 'Phone number must contain only digits.',
                'string.min': 'Phone number must be 4 digits',
                'string.max': 'Phone number must be 16 digits',
                'any.required': 'Phone number is required.'
            })
            .required(),
        birth_date: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip_code: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const message = error.message.replace(/[^\w\s.]/g, '');
        return errorResponse(res, 400, message);
    }
    next();
};

module.exports = {
    mailChimpAudienceValidate
};