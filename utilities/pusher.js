const Pusher = require('pusher')

const pusher = new Pusher({
    appId: "1841658",
    key: "8a3c0d0b3e79c2d46db5",
    secret: "bec4be704864e8b114c9",
    cluster: "ap2",
    useTLS: true
});

module.exports = pusher