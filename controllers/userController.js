const User = require('../models/user');
const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const factory = require('./handlerFactory');
// const authController = require('./authController');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,

            users,

    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-userPassword');

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',

            user,

    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    //* 1. create error if user POSTs password data
    if (req.body.userPassword) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updatepassword.',
                400
            )
        );
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userDOB: req.body.userDOB,
            userAddress: req.body.userAddress,
            userContact: req.body.userContact,
        },
        {
            new: true,
            useFindAndModify: false
        }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        success:true

    });
});

//! updating userfields by logged in user
exports.updateMe = catchAsync(async (req, res, next) => {
    //* 1. create error if user POSTs password data
    if (req.body.userPassword) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updatepassword.',
                400
            )
        );
    }

    //* 2. update user document
    const filteredBody = filterObj(
        req.body,
        'userName',
        'userEmail',
        'userContact',
        'userAddress'
    );
    const user = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false

        }
    );

    res.status(200).json({
        success: true
    });
});

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        status: 'success',
        user,
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false,
    });

    res.status(200).json({
        status: 'success',
        data: null,
        message: 'The user is deleted!',
    });
});

exports.createUser = factory.createOne(User);

exports.deleteUser = factory.deleteOne(User);

// exports.deleteUser = catchAsync(async (req, res, next) => {
//     const user = await User.findByIdAndRemove(req.params.id);

//     if (!user) {
//         return next(new AppError('No user found with that ID', 404));
//     }

//     res.status(200).json({ success: true, message: 'The User is deleted!' });
// });
