const zod = require('zod')
const HttpError = require('../models/HttpError')


const userSignupSchema = zod.object({
    name: zod.string(),
    email: zod.string().email({ message: 'Enter valid Email address', path: ["email"] }),
    username: zod.string().refine(data => !data.includes(" "), { message: "Username cannot contain whitespaces!", path: ["username"] }),
    password: zod.string().min(8, { message: 'password must contain at least 8 characters!' }),
})
const userLoginSchema = zod.object({
    usernameOrEmail: zod.string()
        .refine(value => {
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Username validation: Ensure no whitespace and valid username format
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            // Check if value is either a valid email or a valid username
            return emailRegex.test(value) || usernameRegex.test(value);
        }, {
            message: "Enter a valid email address or a username without whitespace.",
            path: ["usernameOrEmail"]
        }),
    password: zod.string().min(8, { message: 'password must contain at least 8 characters!' }),
})

const authSignupInputMiddleware = (req, res, next) => {
    let result = userSignupSchema.safeParse(req.body)
    if (!result.success) {
        return next(new HttpError(result.error.errors[0].message, 400))
    }
    next()
}

const authLoginInputMiddleware = (req, res, next) => {
    let result = userLoginSchema.safeParse(req.body)
    if (!result.success) {
        return next(new HttpError(result.error.errors[0].message, 400))
    }
    next()
}

module.exports = { authSignupInputMiddleware, authLoginInputMiddleware }