const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const userRoute = require('./routes/user')
const accountRoute = require('./routes/account')
const HttpError = require('./utilities/HttpError')

dotenv.config()
PORT = 5000 || process.env.PORT
mongoose.connect('mongodb+srv://chiragtilwani:Aneeval2004!@cluster0.b6v6mnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.use(express.json())

app.use('/api/v1/user', userRoute)
app.use('/api/v1/account', accountRoute)


app.use((req, res, next) => {
    return next(new HttpError('Could not find this route!', 404))
})

app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err)
    }
    res.status(err.code || 500).json({ message: err.message || 'An unknown error occurred' })
})

app.listen(PORT, () => console.log('listening on port ' + PORT))