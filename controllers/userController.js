const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');


//Register A User
exports.registerUser = catchAsyncError(async(req,res,next)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicurl"
        }
    });

    sendToken(user,201,res);  // call the token function here
});

//Login User
exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;
    //check if user has given password and email both
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password",400));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    sendToken(user,200,res);
});

//Logout User
exports.logoutUser = catchAsyncError(async(req,res,next)=>{

    res.cookie("token", null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "Logout Successfuly"
    });
});

//get user details
exports.getUserDetails = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

//Update/Change User password
exports.updatePassword = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatch){
        return next(new ErrorHandler("Old Password is Incorrect",400));
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);

});

//Update User Profile
exports.updateProfile = catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    //we will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: 'Profile Updated Successfully'
    })

});

//get all user ---> admin
exports.getAllUser = catchAsyncError(async(req,res,next)=>{
    const users = await User.find({});

    res.status(200).json({
        success: true,
        users
    });
});

//get single user ---> admin
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user does not exist with id: ${req.params.id}`,400));
    }

    res.status(200).json({
        success: true,
        user
    });
});

//update user role  -->admin
exports.updateUserRole = catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: 'Role updated'
    })

});

//delete user --> admin
exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    //we will add cloudinary later
    
    if(!user){
        return next(new ErrorHandler(`user does not exist with id: ${req.params.id}`,400))
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });

});