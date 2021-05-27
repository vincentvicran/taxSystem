const express = require('express');
const multer = require('multer');

const router = express.Router();

const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

//* image upload
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];

        let uploadError = new Error('Invalid image type!!!');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

//* get request response
router.get(
    `/`,
    authController.protect,
    authController.restrictTo('admin'),
    paymentController.getAllPayments
);

router.get(`/:id`, authController.protect, paymentController.getPayment);

//* post request response
router.post(
    `/`,
    uploadOptions.single('voucherImage'),
    authController.protect,
    paymentController.addPayment
);

router.get(
    `/get/count`,
    authController.protect,
    authController.restrictTo('admin'),
    paymentController.getPaymentCount
);

module.exports = router;
