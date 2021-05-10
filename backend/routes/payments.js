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
        paymentId: req.body.paymentId,
        userId: req.body.userId,
        bookId: req.body.bookId,
        paymentAmount: req.body.paymentAmount,
        voucherImage: req.body.voucherImage,
        paymentDate: req.body.paymentDate
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

router.get(`/get/count`, async (req, res) =>{
    const paymentCount = await Payment.countDocuments((count) => count)

    if(!paymentCount) {
        res.status(500).json({success: false});
    } 
    res.send({
        paymentCount: paymentCount
    });
})

module.exports = router;