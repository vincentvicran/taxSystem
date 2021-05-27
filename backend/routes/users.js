const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//! AUTHENTICATION
router.post('/register', authController.userRegister);
router.post('/login', authController.userLogin);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);
router.patch(
    '/updatepassword',
    authController.protect,
    authController.updatePassword
);

//? UPDATING LOGGED IN USER INFO
router.patch('/updateme', authController.protect, userController.updateMe);
router.delete('/deleteme', authController.protect, userController.deleteMe);

//! ADMIN PRIVILEDGES
router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getAllUsers
    );

router
    .route('/:id')
    .get(authController.protect, userController.getUser)
    .put(authController.protect, userController.updateUser)
    .delete(authController.protect, userController.deleteUser);

router
    .route('/admin')
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        userController.addAdmin
    );

router
    .route('/get/count')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getUserCount
    );

module.exports = router;
