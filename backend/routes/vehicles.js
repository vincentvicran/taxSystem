const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicleController');

router
    .route('/')
    .get(vehicleController.getAllVehicles)
    .post(vehicleController.addVehicle);

router
    .route('/:id')
    .get(vehicleController.getVehicle)
    .put(vehicleController.updateVehicle)
    .delete(vehicleController.deleteVehicle);

router
    .route('/get/count')
    .get(vehicleController.getVehicleCount);

module.exports = router;