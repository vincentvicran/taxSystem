const jwt = require('jsonwebtoken');
// require('dotenv/config');

const User = require('../models/user');
// const secret = process.env.JWT_SECRET;

exports.userRegister = async (req, res, next) => {
    let user = await User.create({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userDOB: req.body.userDOB,
        userAddress: req.body.userAddress,
        userContact: req.body.userContact,
        userPassword: req.body.userPassword,
        isAdmin: req.body.isAdmin
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: user
        }
    });
};

exports.userLogin = async (req, res, next) => {
    const { userEmail, userPassword } = req.body;

    //1. check if email and password exist
    if(!userEmail || !userPassword)

    //2. check if user exists and password is correct

    //3. if everything is ok, send token to the client
}