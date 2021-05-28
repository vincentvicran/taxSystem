const express = require('express');

const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const authController = require('../controllers/authController');
// const insuranceController = require('../controllers/insuranceController');

router.use(authController.protect);

router.route('/').post(vehicleController.addVehicle);

router
    .route('/:id')
    .get(vehicleController.getVehicle)
    .patch(vehicleController.updateVehicle);

//! ADMIN PRIVILEDGES
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(vehicleController.getAllVehicles)
    .post(vehicleController.createVehicle);
router
    .route('/:id')
    .patch(vehicleController.updateVehicles)
    .delete(vehicleController.deleteVehicle);

// router
//     .route(`/:vehicleId/insurances`)
//     .get(authController.protect, insuranceController.getVehicleInsurances);

module.exports = router;
