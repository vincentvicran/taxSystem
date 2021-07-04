const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/user');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');
// const factory = require('./handlerFactory');
const sendEmail = require('../helpers/email');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    //! cookie handling
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.userPassword = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        user
    });
};

exports.userRegister = catchAsync(async (req, res, next) => {
    const user = await User.create({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userDOB: req.body.userDOB,
        userAddress: req.body.userAddress,
        userContact: req.body.userContact,
        userPassword: req.body.userPassword,
        passwordConfirm: req.body.passwordConfirm,
        // userPasswordChangedAt: req.body.userPasswordChangedAt,
        role: req.body.role,
    });

    createSendToken(user, 201, res);
});

exports.userLogin = catchAsync(async (req, res, next) => {
    const { userEmail, userPassword } = req.body;

    //* 1. check if email and password exist
    if (!userEmail || !userPassword) {
        return next(new AppError('Please provide email and password!', 400));
    }

    //* 2. check if user exists and password is correct
    const user = await User.findOne({ userEmail }).select('+userPassword');

    if (
        !user ||
        !(await user.correctPassword(userPassword, user.userPassword))
    ) {
        return next(new AppError('Incorrect email or password!', 401));
    }

    //* 3. if everything is ok, send token to the client
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    //* 1. getting token and check if it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    else if (
        (req.headers.cookie)
    ) {
        token = req.headers.cookie.split('=')[1];
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to gain access!',
                401
            )
        );
    }

    //* 2. verifying the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //* 3. check if user still exists
    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
        return next(
            new AppError('The user with this token no longer exists!', 401)
        );
    }

    //* 4. check if user changed pasword after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please log in again!',
                401
            )
        );
    }

    //* granted access to the protected routes
    req.user = freshUser;
    next();
});

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        //* roles ['admin', 'user']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You are not allowed!', 403));
        }

        next();
    };

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //* 1. get user based on POSTed email
    const user = await User.findOne({
        userEmail: req.body.userEmail,
    });

    if (!user) {
        return next(
            new AppError('There is no user with the given email address.', 404)
        );
    }
    //* 2. generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //* 3. send it to user's email
    // const resetURL = `${req.protocol}://${req.get(
    //     'host'
    // )}/api/v1/users/resetpassword/${resetToken}`;

    const message = `Forgot your password? Submit a this token with your new password to:\n${resetToken}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        // console.log(user.userEmail);

        await sendEmail({
            email: user.userEmail,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'There was an error sending the email! Please try again later!'
            ),
            500
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //* 1. get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpiry: { $gt: Date.now() },
    });

    //* 2. if token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired!', 400));
    }
    user.userPassword = req.body.userPassword;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    //* 3. update userPasswordChangedAt property for the user
    //! done in user.js

    //* 4. log the user in, send jwt
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    //* 1. get user from collection
    const user = await User.findById(req.user.id).select('+userPassword');

    //* 2. check if POSTed current password is correct
    if (
        !(await user.correctPassword(
            req.body.passwordCurrent,
            user.userPassword
        ))
    ) {
        return next(new AppError('Your current password is wrong!', 401));
    }

    //* 3. if so, update password
    user.userPassword = req.body.userPassword;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //* 4. log user in, send JWT
    createSendToken(user, 200, res);
});

exports.addAdmin = catchAsync(async (req, res, next) => {
    const user = await User.create({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userDOB: req.body.userDOB,
        userAddress: req.body.userAddress,
        userContact: req.body.userContact,
        userPassword: req.body.userPassword,
        passwordConfirm: req.body.passwordConfirm,
        role: 'admin',
    });

    if (!user) {
        next(new AppError('Admin could not be created!', 404));
    }

    createSendToken(user, 201, res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        status: 'success',
        message: 'User successfully Logged out!',
    });
};
