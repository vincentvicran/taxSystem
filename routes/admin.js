const express = require('express');

const router = express.Router({ mergeParams: true });

const paymentsRoutes = require('./payments');
const insurancesRoutes = require('./insurances');
const usersRoutes = require('./users');
const vehiclesRoutes = require('./vehicles');

const authController = require('../controllers/authController');

router.use(`/users`, usersRoutes);
router.use(`/vehicles`, vehiclesRoutes);
router.use(`/insurances`, insurancesRoutes);
router.use(`/payments`, paymentsRoutes);

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/addAdmin').post(authController.addAdmin);

module.exports = router;
