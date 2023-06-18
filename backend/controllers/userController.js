const ErrorHandler = require('../utils/errorhandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const User = require('../models/userModel')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')

// Register a user --> Public scope
exports.registerUser = catchAsyncErrors (async(req,res,next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale'
    })
    const { name, email, password } = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })

    // const token = user.getJwtToken()

    // res.status(201).json({
    //     success: true,
    //     token
    // })
    sendToken(user, 201, res)
})

// Login user --> users, admin
exports.loginUser = catchAsyncErrors(async (req,res,next) => {
    const { email, password } = req.body

    // Validating the details
    if (!email || !password) {
        return next(new ErrorHandler('Please enter the Email & Password.', 400))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password.', 401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password.', 401))      // Shouldn't mention that atleast the email is valid; for privacy reasons
    }

    // const token = user.getJwtToken()

    // res.status(200).json({
    //     success: true,
    //     token
    // })
    sendToken(user, 200, res)
})

// Logout user --> users, admin
exports.logout = catchAsyncErrors(async(req,res,next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})

// Forgot Password --> users, admin
exports.forgotPassword = catchAsyncErrors(async(req,res,next) => {

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler('User not found.', 404))
    }

    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`  // http://localhost/api/v1/password/resetTOKEN
    const message = `Your password reset token: \n\n ${resetPasswordUrl} \n\nIf you've not requested this email, then please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }
})

// Reset Password --> users, admin
exports.resetPassword = catchAsyncErrors(async (req,res,next) => {

    // Creating token hash
    const resetPasswordToken = 
        crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex')


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Reset Password token is invalid or has been expired.', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password doesn\'t match', 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res)
})

// Get User details --> users
exports.getUserDetails = catchAsyncErrors(async(req,res,next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

// Update User Password --> users
exports.updatePassword = catchAsyncErrors(async(req,res,next) => {
    const user = await User.findById(req.user.id).select('+password')

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Old password is incorrect.', 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler('New Password doesn\'t match', 400))
    }

    user.password = req.body.newPassword
    await user.save()

    sendToken(user, 200, res)
})

// Update User Profile --> users
exports.updateProfile = catchAsyncErrors(async(req,res,next) => {

    const updatedUser = {
        name: req.body.name,
        email: req.body.email,
    }

    // Cloudinary
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)
        const imageId = user.avatar.public_id

        await cloudinary.v2.uploader.destroy(imageId)
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        })

        updatedUser.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }


    const user = await User.findByIdAndUpdate(req.user.id, updatedUser, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

// Get all users --> Admin
exports.getAllUsers = catchAsyncErrors(async(req,res,next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})

// Get particular user --> Admin
exports.getParticularUser = catchAsyncErrors(async(req,res,next) => {
    const user = await User.findById(req.params.id)

    if(!user) {
        return next(new ErrorHandler(`User doesn't exist with ID: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Update Role of a user --> Admin
exports.updateUserRole = catchAsyncErrors(async(req,res,next) => {
    const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    await User.findByIdAndUpdate(req.params.id, updatedUser, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

})

// Delete a user --> Admin
exports.deleteUser = catchAsyncErrors(async(req,res,next) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User doesn't exist with ID: ${req.params.id}`))
    }

    // Removing avatar from cloudinary
    const imageId = user.avatar.public_id
    await cloudinary.v2.uploader.destroy(imageId)
    
    // await user.remove()
    await User.deleteOne({ _id: user })  // I've added this while removing the above line

    res.status(200).json({
        success: true,
        message: `User deleted successfully.`
    })

})