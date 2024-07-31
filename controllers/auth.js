const User = require('../models/User')
const bcrypt = require('bcrypt')

const { getToken } = require("../utilities/helperFunctions")
const HttpError = require('../utilities/HttpError')
const Account = require('../models/Account')

const register = async (req, res, next) => {
    const { name, username, password, email } = req.body

    try {
        const existingUser = await User.findOne({ '$or': [{ username }, { email }] });
        if (existingUser !== null) {
            return next(new HttpError('User with this email or username already exists!', 400));
        }

        if (username.includes(" ")) {
            return next(new HttpError('Username cannot contain white spaces!', 400));
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 12);
        } catch (err) {
            return next(new HttpError('Something went wrong!', 500));
        }

        try {
            if (hashedPassword) {
                const newUser = await User.create({ name, username, email, password: hashedPassword });
                const result = await Account.create({ userId: newUser._id, balance: 1 + Math.random() * 10000 });
                res.status(202).json({ message: "Registration Successful!", token: getToken(newUser._id, newUser.username) });
            } else {
                return next(new HttpError("Something went wrong!", 500));
            }
        } catch (err) {
            return next(new HttpError('Error Signing up user', 500));
        }
    } catch (err) {
        return next(new HttpError('Something went wrong', 500));
    }
}


const login = async (req, res, next) => {
    const { usernameOrEmail, password } = req.body
    let existingUser
    try {
        existingUser = await User.findOne({ '$or': [{ username: usernameOrEmail }, { email: usernameOrEmail }] })
        if (existingUser === null) {
            return next(new HttpError("Wrong credentials!", 401))
        }
    } catch (err) {
        return next(new HttpError(err + 'something went wrong', 500))
    }

    let result = await bcrypt.compare(password, existingUser.password)
    if (!result) {
        return next(new HttpError("Wrong credentials!", 401))
    }
    res.json({ message: "Login Successful!", token: getToken(existingUser._id, existingUser.username) }).status(200)
}
module.exports = { register, login }