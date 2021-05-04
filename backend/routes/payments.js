const {Payment} = require('../models/payment');
const express = require('express');
const router = express.Router();

//* get request response
router.get(`/`, async (req, res) =>{
    const paymentList = await Payment.find();
    res.send(paymentList);
})


//* post request response
router.post(`/`, (req, res) =>{
    const payment = new Payment({
        id: req.body.id,
        name: req.body.name,
        
    });
    payment.save().then((createdPayment => {
        res.status(201).json(createdPayment)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

module.exports = router;