const { validationResult } = require('express-validator');
require('dotenv').config();




const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};

const baseUrlPy = ""



module.exports = { validate} ; 