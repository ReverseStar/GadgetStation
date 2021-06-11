const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter a username'],
        maxLength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Enter Password'],
        minlength:[6, 'Password must be at least 6 characters'],
        select:false
    },
    avatar: {
        public_id:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//Encrypting Password for users
userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

//Password Validation
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}
// JWT
userSchema.methods.getJwtToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_TIME
    })
}

//Generating Token for Reset Password
userSchema.methods.getResetPasswordToken = function() {
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex')

    //Hashing and setting resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    //Setting Token Expire Time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
    return resetToken
}
module.exports = mongoose.model('User',userSchema)