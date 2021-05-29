const express = require('express');

const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const authController = require('../controllers/authController');
const insuranceController = require('../controllers/insuranceController');
// const factory = require('../controllers/handlerFactory');

router.use(authController.protect);

router.route('/').post(vehicleController.addVehicle);

router.route('/').get(vehicleController.getAllUserVehicles);

router
    .route('/:id')
    .get(vehicleController.getVehicle)
    .patch(vehicleController.updateVehicle);

router
    .route(`/:vehicleId/insurances`)
    .get(insuranceController.getUserInsurance);

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
