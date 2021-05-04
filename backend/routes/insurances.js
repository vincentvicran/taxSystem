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
        id: req.body.id,
        name: req.body.name,
        
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

module.exports = router;