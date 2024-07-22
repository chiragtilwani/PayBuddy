const mongoose = require('mongoose')
const express = require('express')
const app = express()
PORT = 5000 || process.env.PORT

mongoose.connect('mongodb+srv://chiragtilwani:Aneeval2004!@cluster0.b6v6mnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
const userRoute = require('./routes/user')
const HttpError = require('./models/HttpError')

app.use(express.json())

app.use('/api/user', userRoute)


app.use((req,res,next)=>{
    return next(new HttpError('Could not find this route!',404))
})

app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err)
    }
    res.status(err.code || 500).json({ message: err.message || 'An unknown error occurred' })
})

app.listen(PORT, () => console.log('listening on port ' + PORT))