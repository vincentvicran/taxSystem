const express = require('express');

const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const authController = require('../controllers/authController');

router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        vehicleController.getAllVehicles
    )
    .post(authController.protect, vehicleController.addVehicle);

router
    .route('/:id')
    .get(authController.protect, vehicleController.getVehicle)
    .put(authController.protect, vehicleController.updateVehicle)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        vehicleController.deleteVehicle
    );

router
    .route('/get/count')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        vehicleController.getVehicleCount
    );

module.exports = router;
