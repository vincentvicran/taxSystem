const {Payment} = require('../models/payment');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const FILE_TYPE_MAP = { 
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg'
}


//* image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];

        let uploadError = new Error('Invalid image type!!!');

        if(isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const uploadOptions = multer({ storage: storage })

//* get request response
router.get(`/`, async (req, res) =>{
    const paymentList = await Payment.find();
    res.send(paymentList);
})


//* post request response
router.post(`/`, uploadOptions.single('voucherImage'), async (req, res) =>{

    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')

    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let payment = new Payment({
        paymentId: req.body.paymentId,
        userId: req.body.userId,
        bookId: req.body.bookId,
        paymentAmount: req.body.paymentAmount,
        voucherImage: `${basePath}${fileName}`,
        paymentDate: req.body.paymentDate
    });

    payment = await payment.save();

    if(!payment) 
    return res.status(500).send('The payment cannot be issued!')

    res.send(payment);
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