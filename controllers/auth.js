const User = require('../models/User')
const bcrypt = require('bcrypt')

const { getToken } = require("../utilities/helperFunctions")
const HttpError = require('../models/HttpError')

const register = async (req, res, next) => {
    const { name, username, password, email } = req.body

    await User.findOne({ '$or': [{ username }, { email }] }).then(res => {
        if (res !== null) {
            return next(new HttpError('User with this email or username already exists!', 400))
        }
    }).catch(err => {
        return next(new HttpError(err + 'something went wrong', 500))
    })
    if (username.includes(" ")) {
        return next(new HttpError('Username cannot contain white spaces!', 400))
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await User.create({ name, username, email, password: hashedPassword })

    res.json({ message: "Registeration Successful!", token: getToken(newUser._id, newUser.username) })
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
    res.json({ message: "Login Successful!", token: getToken(existingUser._id, existingUser.username) })
}
module.exports = { register,login }