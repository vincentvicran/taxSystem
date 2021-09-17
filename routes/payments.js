const express = require('express');
const multer = require('multer');

const router = express.Router({ mergeParams: true });

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

router.use(authController.protect);

router.route(`/`).get(paymentController.getAllUserPayments);

router.route('/:id').get(paymentController.getPayment);

router.post(
    `/:vehicleId`,
    uploadOptions.single('voucherImage'),
    paymentController.addPayment
);

//! ADMIN PRIVILEDGES
router.use(authController.restrictTo('admin'));

router
    .route(`/`)
    .get(paymentController.getAllPayments)
    .post(paymentController.addPayment);

router
    .route('/:id')
    .post(uploadOptions.single('voucherImage'), paymentController.addPayment)
    .patch(paymentController.updatePayment)
    .delete(paymentController.deletePayment);

module.exports = router;
