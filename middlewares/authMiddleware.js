const jwt = require('jsonwebtoken');
const HttpError = require('../utilities/HttpError');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            const result = jwt.verify(token, process.env.JWTSECRET)
            if (result.id) {
                req.user = await User.findById(result.id)
                next()
            } else {
                return next(new HttpError("You are not authorized to perform this action!", 401))
            }
        } catch (err) {
            return next(new HttpError("You are not authorized to perform this action!", 401))
        }
    } else
        if (!token) {
            return next(new HttpError("You are not authorized to perform this action!", 401))
        }
}

module.exports = authMiddleware;