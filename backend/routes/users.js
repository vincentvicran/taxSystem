const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
// const paymentController = require('../controllers/paymentController');
const vehicleController = require('../controllers/vehicleController');
// const insuranceController = require('../controllers/userinsuranceController');
const authController = require('../controllers/authController');

//! AUTHENTICATION
router.post('/register', authController.userRegister);
router.post('/login', authController.userLogin);
router.get('/logout', authController.logout);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

//! USER AUTHORIZATION
router.use(authController.protect);

//? UPDATING LOGGED IN USER INFO
router.patch('/updateme', userController.updateMe);
router.delete('/deleteme', userController.deleteMe);
router.patch('/updatepassword', authController.updatePassword);

//? vehicles
router.get('/vehicles', vehicleController.getVehicle);

//! ADMIN PRIVILEDGES
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router.route('/admin').post(userController.addAdmin);

module.exports = router;
