const Payment = require('../models/payment');
const User = require('../models/user');
const Vehicle = require('../models/vehicle');

const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

exports.getAllPayments = catchAsync(async (req, res, next) => {
    const paymentList = await Payment.find()
        .populate('userName', 'userName')
        .populate('ownerName', 'ownerName')
        .populate('vehicleNumber', 'vehicleNumber');

    if (!paymentList) {
        return next(new AppError('No payments found!', 404));
    }

    res.send(paymentList);
});

exports.getPayment = catchAsync(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id)
        .populate('userName', 'userName')
        .populate('ownerName', 'ownerName')
        .populate('vehicleNumber', 'vehicleNumber');

    if (!payment) {
        return next(new AppError('No payment found with that id!', 404));
    }

    res.send(payment);
});

exports.addPayment = catchAsync(async (req, res, next) => {
    const { file } = req;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const userName = await User.findById(req.body.userName)
        .populate('User')
        .select('userName');
    const ownerName = await Vehicle.findById(req.body.ownerName)
        .populate('Vehicle')
        .select('ownerName');
    const vehicleNumber = await Vehicle.findById(req.body.vehicleNumber)
        .populate('Vehicle')
        .select('vehicleNumber');

    let payment = new Payment({
        // paymentId: req.body.paymentId,
        userName: userName,
        ownerName: ownerName,
        vehicleNumber: vehicleNumber,
        paymentAmount: req.body.paymentAmount,
        voucherImage: `${basePath}${fileName}`,
        paymentDate: req.body.paymentDate,
    });

    payment = await payment.save();

    if (!payment) {
        return next(new AppError('The payment cannot be issued!', 500));
    }

    res.send(payment);
});

exports.getPaymentCount = catchAsync(async (req, res, next) => {
    const paymentCount = await Payment.countDocuments((count) => count);

    if (!paymentCount) {
        return next(new AppError('The payment cannot be issued!', 500));
    }

    res.send({
        paymentCount: paymentCount,
    });
});
