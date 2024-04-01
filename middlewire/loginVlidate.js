const { body, validationResult } = require('express-validator');


const validateSignup = [
    body('username').notEmpty().withMessage('Username cannot be empty'),
    body('email').notEmpty().withMessage('Email cannot be empty'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('password')
        .matches(/[a-zA-Z]/).withMessage('Password must include at least one letter')
        .matches(/[0-9]/).withMessage('Password must include at least one number')
        .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/).withMessage('Password must include at least one special character')
];


module.exports = validateSignup