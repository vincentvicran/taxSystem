const express = require('express');
const router = express.Router();

const insuranceController = require('../controllers/insuranceController');


router
    .route(`/`)
    .get(insuranceController.getAllInsurance)
    .post(insuranceController.addInsurance);


router
    .route('/:id')
    .put(insuranceController.updateInsurance);


router
    .route(`/get/count`)
    .get(insuranceController.getInsuranceCount);

    
module.exports = router;