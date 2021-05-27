const User = require('../models/user');
const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const authController = require('./authController');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const userList = await User.find();
    res.status(201).json({
        status: 'success',
        results: userList.length,
        data: {
            userList,
        },
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-userPassword');

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).send(user);
});

exports.addAdmin = catchAsync(async (req, res, next) => {
    const user = await User.Create({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userDOB: req.body.userDOB,
        userAddress: req.body.userAddress,
        userContact: req.body.userContact,
        userPassword: req.body.userPassword,
        // userPasswordChangedAt: req.body.userPasswordChangedAt,
        role: 'admin',
    });

    authController.createSendToken(user, 201, res);
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
        }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.send(user);
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
        'userContact'
    );
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
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

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({ success: true, message: 'The User is deleted!' });
});

exports.getUserCount = catchAsync(async (req, res, next) => {
    const userCount = await User.countDocuments((count) => count);

    if (!userCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        userCount: userCount,
    });
});
