const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router
    .post('/register', authController.userRegister);

router
    .route('/login')
    .post(userController.userLogIn);

router
    .route('/')
    .get(userController.getAllUsers);

router
    .route('/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

router
    .route('/admin')
    .post(userController.addAdmin);

// router
//     .route('/login')
//     .post(userController.userLogIn);

// router
//     .route('/register')
//     .post(userController.userRegister);

router
    .route('/get/count')
    .get(userController.getUserCount);


module.exports = router;