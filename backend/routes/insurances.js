const {Insurance} = require('../models/insurance');
const express = require('express');
const router = express.Router();

//* get request response
router.get(`/`, async (req, res) =>{
    const insuranceList = await Insurance.find();
    res.send(insuranceList);
})


//* post request response
router.post(`/`, (req, res) =>{
    const insurance = new Insurance({
        insuranceId: req.body.insuranceId,
        insuranceType: req.body.insuranceType,
        insuranceDOI: req.body.insuranceDOI,
        insuranceDOE: req.body.insuranceDOE        
    });
    insurance.save().then((createdInsurance => {
        res.status(201).json(createdInsurance)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
})


//* update
router.put(`/:id`, async (req, res)=>{
    const insurance = await Insurance.findByIdAndUpdate(
        req.params.id,
        {
            insuranceId: req.body.insuranceId,
            insuranceType: req.body.insuranceType,
            insuranceDOI: req.body.insuranceDOI,
            insuranceDOE: req.body.insuranceDOE 
        },
        {
            new: true
        }
    );

    if(!insurance)
        return res.status(404).send('The insurance cannot be created!');

    res.send(insurance); 
})


router.get(`/get/count`, async (req, res) =>{
    const insuranceCount = await Insurance.countDocuments((count) => count)

    if(!insuranceCount) {
        res.status(500).json({success: false});
    } 
    res.send({
        insuranceCount: insuranceCount
    });
})
module.exports = router;