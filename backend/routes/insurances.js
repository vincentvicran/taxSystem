const express = require('express');

const router = express.Router();

const insuranceController = require('../controllers/insuranceController');
const authController = require('../controllers/authController');

router
    .route(`/`)
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        insuranceController.getAllInsurance
    )
    .post(authController.protect, insuranceController.addInsurance);

router
    .route('/:id')
    .put(authController.protect, insuranceController.updateInsurance);

router
    .route(`/get/count`)
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        insuranceController.getInsuranceCount
    );

module.exports = router;
