const express = require('express');

const router = express.Router();

const insuranceController = require('../controllers/insuranceController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route(`/`).post(insuranceController.addInsurance);

router.route(`/:userId`).get(insuranceController.getUserInsurance);

//! ADMIN PRIVILEDGES
router.use(authController.restrictTo('admin'));

router.route(`/`).get(insuranceController.getAllInsurance);

router
    .route('/:id')
    .patch(insuranceController.updateInsurance)
    .delete(insuranceController.deleteInsurance);

module.exports = router;
