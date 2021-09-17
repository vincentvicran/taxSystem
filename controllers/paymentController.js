const factory = require('./handlerFactory');
const Payment = require('../models/payment');

const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

exports.getAllUserPayments = catchAsync(async (req, res, next) => {
    const payments = await Payment.find({ payor: req.user.id })
        .populate('payor', 'userName')
        .populate({
            path: 'vehicle',
            select: 'vehicleNumber',
        });

    if (!payments) {
        return next(new AppError('No payments found!', 404));
    }

    res.status(200).json({
        status: 'success',
        results: payments.length,
            payments,
    });
});

exports.getAllPayments = catchAsync(async (req, res, next) => {
    const payments = await Payment.find()
        .populate('payor', 'userName')
        .populate({
            path: 'vehicle',
            select: 'ownerName vehicleNumber',
        });

    if (!payments) {
        return next(new AppError('No payments found!', 404));
    }

    res.status(200).json({
        status: 'success',
        results: payments.length,
            payments,
    });
});

exports.getPayment = catchAsync(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id)
        .populate('payor', 'userName')
        .populate({
            path: 'vehicle',
            select: 'ownerName vehicleNumber',
        });

    if (!payment) {
        return next(new AppError('No payment found with that id!', 404));
    }

    res.status(200).send({
        status: 'success',
        payment,
    });
});

exports.addPayment = catchAsync(async (req, res, next) => {
    const { file } = req;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let payment = new Payment({
        payor: req.user.id,
        vehicle: req.params.vehicleId,
        paymentAmount: req.body.paymentAmount,
        voucherImage: `${basePath}${fileName}`,
        paymentDate: req.body.paymentDate,
    });

    payment = await payment.save();

    if (!payment) {
        return next(new AppError('The payment cannot be issued!', 500));
    }

    res.status(201).json({
        status: 'success',
        payment,
    });
});

exports.updatePayment = factory.updateOne(Payment);

exports.deletePayment = factory.deleteOne(Payment);
