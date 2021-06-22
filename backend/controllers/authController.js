const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sentToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')

//User Registration
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    })
    const { name, email, password } = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })
    //JWT
    sentToken(user, 200, res)
})

//User Login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    //Checking if Creds are entered by the user
    if (!email || !password) {
        return next(new ErrorHandler('Please Enter Credentials', 400))
    }

    //Finding user in Database
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }

    //Password Validation
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    sentToken(user, 200, res)
})

//Password Recovery
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler('No user found with this email', 404))
    }
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    //Creating Password recovery url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `The Password Recovery Token is \n\n${resetUrl}\n\nPlease ignore if you did not request this email.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset Password',
            message
        })
        res.status(200).json({
            success: true,
            message: `Recovery Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }
})

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //Hashing URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400)
        )
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password did not match', 400))
    }
    //Setting New Password
    user.password = req.body.password

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
    sentToken(user, 200, res)
})

//Getting active user details
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

//Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    //Check current password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Enter current password correctly'));
    }
    user.password = req.body.password
    await user.save()

    sentToken(user, 200, res)
})

//Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //Update Avatar
if(req.body.avatar !== '') {
    const user  = await User.findById(req.user.id)

    const image_id = user.avatar.public_id
    const res = await cloudinary.v2.uploader.destroy(image_id)

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    })
    newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url
    }
}

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
})


// User Logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged Out Successfully'
    })
})

// Admin Routes
//Fetching all users 
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})
//Fetching all user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

//Updating Users Profile as Admin
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
})

//Deleting User
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
    }

    await user.remove()

    res.status(200).json({
        success: true,
    })
})
