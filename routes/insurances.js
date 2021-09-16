const express = require('express');

const router = express.Router({ mergeParams: true });

const insuranceController = require('../controllers/insuranceController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router
    .route(`/`)
    .get(insuranceController.getAllUserInsurance)

router
    .route(`/:vehicleId`)
    .post(insuranceController.addInsurance);

router.route(`/:id`).get(insuranceController.getUserInsurance);

//! ADMIN PRIVILEDGES
router.use(authController.restrictTo('admin'));

router
    .route(`/`)
    .get(insuranceController.getAllInsurance)
    .post(insuranceController.createInsurance);

router
    .route('/:id')
    .patch(insuranceController.updateInsurance)
    .delete(insuranceController.deleteInsurance);

module.exports = router;
