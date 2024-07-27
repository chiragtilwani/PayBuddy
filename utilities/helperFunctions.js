const jwt = require('jsonwebtoken')
 

const getToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWTSECRET, { expiresIn: '1h' })
}

module.exports={getToken}