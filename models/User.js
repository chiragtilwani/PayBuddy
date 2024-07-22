const mongoose = require('mongoose')

const userSchema =new mongoose.Schema({
    name:{type:String,required:[true,'Name is required.']},
    email:{type:String,required:[true,'Email is required.'],match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'] },
    username: { type: String, required:[true,'Username is required.'],unique: [true,'Username already in use.']},
    password: { type: String, required:[true,'Password is required.'],minlength:[8,'Password must be at least 8 characters long!'] },
},{timestamps:true})

module.exports=mongoose.model('User',userSchema)