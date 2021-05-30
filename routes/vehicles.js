const express = require('express');
// const multer = require('multer');

const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const authController = require('../controllers/authController');
// const insuranceController = require('../controllers/insuranceController');
// const paymentController = require('../controllers/paymentController');

const paymentsRoutes = require('./payments');
const insurancesRoutes = require('./insurances');

// //* image upload
// const FILE_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg',
// };

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const isValid = FILE_TYPE_MAP[file.mimetype];

//         let uploadError = new Error('Invalid image type!!!');

//         if (isValid) {
//             uploadError = null;
//         }
//         cb(uploadError, 'public/uploads');
//     },
//     filename: function (req, file, cb) {
//         const fileName = file.originalname.split(' ').join('-');
//         const extension = FILE_TYPE_MAP[file.mimetype];
//         cb(null, `${fileName}-${Date.now()}.${extension}`);
//     },
// });

// const uploadOptions = multer({ storage: storage });

router.use(authController.protect);

router.use(`/:vehicleId/payments`, paymentsRoutes);
router.use(`/:vehicleId/insurances`, insurancesRoutes);

router.route('/').post(vehicleController.addVehicle);

router.route('/').get(vehicleController.getAllUserVehicles);

router
    .route('/:id')
    .get(vehicleController.getVehicle)
    .patch(vehicleController.updateVehicle);

// router.use(`/:vehicleId/insurances`, insuranceRoutes);

//! ADMIN PRIVILEDGES
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(vehicleController.getAllVehicles)
    .post(vehicleController.createVehicle);
router
    .route('/:id')
    .patch(vehicleController.updateVehicles)
    .delete(vehicleController.deleteVehicle);

// router
//     .route(`/:vehicleId/insurances`)
//     .get(authController.protect, insuranceController.getVehicleInsurances);

module.exports = router;
