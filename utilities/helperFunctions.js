const jwt = require('jsonwebtoken');
const pusher = require('../utilities/pusher');


const getToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWTSECRET, { expiresIn: '1h' })
}

const sendNotification = (userId, message) => {
    pusher.trigger(`private-${userId}`, 'notification', {
        message: message
    });
};
module.exports = { getToken, sendNotification }