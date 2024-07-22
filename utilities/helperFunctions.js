const jwt = require('jsonwebtoken')
const JWTSECRET = 'S3Crte'

const getToken = (id, username) => {
    return jwt.sign({ id, username }, JWTSECRET, { expiresIn: '1h' })
}

module.exports={getToken}