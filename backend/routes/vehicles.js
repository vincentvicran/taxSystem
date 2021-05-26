const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const authController = require('../controllers/authController');

router
    .route('/')
    .get(vehicleController.getAllVehicles)
    .post(vehicleController.addVehicle);

router
    .route('/:id')
    .get(vehicleController.getVehicle)
    .put(vehicleController.updateVehicle)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        vehicleController.deleteVehicle
    );

router.route('/get/count').get(vehicleController.getVehicleCount);

module.exports = router;
