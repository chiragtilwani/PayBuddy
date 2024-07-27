const bcrypt = require('bcrypt')
const User = require('../models/User')

const updateProfile = async (req, res) => {
    const updatedInput = req.body
    if (updatedInput.newPassword) {
        hashedPassword = await bcrypt.hash(updatedInput.newPassword, 12)
    }
    const result = await User.findByIdAndUpdate(req.user.id, updatedInput, { new: true })
    res.json({ result })
}


module.exports = { updateProfile }