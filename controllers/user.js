const bcrypt = require('bcrypt')
const User = require('../models/User')
const HttpError = require('../utilities/HttpError')

const updateProfile = async (req, res,next) => {
    const updatedInput = req.body
    if (!updatedInput) {
        return next(new HttpError("Bad Request!", 400))
    }
    
    try {
        if (updatedInput.newPassword) {
            hashedPassword = await bcrypt.hash(updatedInput.newPassword, 12)
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedInput, { new: true })
        if (!updatedUser) {
            return next(new HttpError("User not found", 404));
        }
        res.json({ message: "Profile updated successfully." })
    } catch (err) {
        return next(new HttpError("Something went wrond!", 500))
    }
}

const getUser = async (req, res,next) => {
    const { filter } = req.query
    if (!filter) {
        return next(new HttpError("Filter query parameter is required", 400))
    }
    try {
        const result = await User.find({ '$or': [{ name: { "$regex": filter, "$options": "i" } }, { username: { "$regex": filter, "$options": "i" } }, { email: { "$regex": filter, "$options": "i" } }] })
        if (!result.length) {
            return next(new HttpError("User not found", 404));
        }
        res.json({ result })
    } catch (err) {
        return next(new HttpError("Something went wrong!", 500))
    }
}

module.exports = { updateProfile, getUser }
