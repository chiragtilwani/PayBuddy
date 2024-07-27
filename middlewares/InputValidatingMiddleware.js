const zod = require('zod')
const bcrypt = require('bcrypt')
const HttpError = require('../utilities/HttpError')


const userSignupSchema = zod.object({
    name: zod.string(),
    email: zod.string().email({ message: 'Enter valid Email address', path: ["email"] }),
    username: zod.string().refine(data => !data.includes(" "), { message: "Username cannot contain whitespaces!", path: ["username"] }),
    password: zod.string().min(8, { message: 'password must contain at least 8 characters!' }),
})
const userLoginSchema = zod.object({
    usernameOrEmail: zod.string()
        .refine(value => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            return emailRegex.test(value) || usernameRegex.test(value);
        }, {
            message: "Enter a valid email address or a username without whitespace.",
            path: ["usernameOrEmail"]
        }),
    password: zod.string().min(8, { message: 'password must contain at least 8 characters!' }),
})

const updateProfileSchema = zod.object({
    name: zod.string().optional(),
    username: zod.string().refine(data => !data.includes(" "), { message: "Username cannot contain whitespaces!", path: ["username"] }).optional(),
    password: zod.string().min(8, { message: 'password must contain at least 8 characters!' }).optional(),
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

const updateProfileMiddleware = async (req, res, next) => {
    const { name, username, password } = req.body
    if (name && name === req.user.name) {
        return next(new HttpError("Input is same as previous Name.", 400))
    }

    if (username && username === req.user.username) {
        return next(new HttpError("Input is same as previous Username.", 400))
    }

    if (password) {
        const passwordIsSame = await bcrypt.compare(password, req.user.password)
        if (passwordIsSame) {
            return next(new HttpError("Input is same as previous password.", 400))
        }
    }

    const result = updateProfileSchema.safeParse(req.body)
    if (!result.success) {
        return next(new HttpError(result.error.errors[0].message, 400))
    }

    next()
}

module.exports = { authSignupInputMiddleware, authLoginInputMiddleware, updateProfileMiddleware }