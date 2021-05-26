const User = require('../models/user');
const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const authController = require('./authController');

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
    const user = new User.Create({
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
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userDOB: req.body.userDOB,
            userAddress: req.body.userAddress,
            userContact: req.body.userContact,
            userPassword: req.body.userPassword,
            isAdmin: req.body.isAdmin,
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
