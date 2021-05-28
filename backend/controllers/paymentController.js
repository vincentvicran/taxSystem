const factory = require('./handlerFactory');
const Payment = require('../models/payment');

const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

exports.getAllPayments = catchAsync(async (req, res, next) => {
    const paymentList = await Payment.find()
        .populate('payor', 'userName')
        .populate({
            path: 'vehicle',
            select: 'ownerName vehicleNumber',
        });

    if (!paymentList) {
        return next(new AppError('No payments found!', 404));
    }

    res.send(paymentList);
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

    res.send(payment);
});

exports.addPayment = catchAsync(async (req, res, next) => {
    const { file } = req;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let payment = new Payment({
        payor: req.user.id,
        vehicle: req.body.vehicle,
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

exports.createPayment = factory.createOne(Payment);

exports.updatePayment = factory.updateOne(Payment);

exports.deletePayment = factory.deleteOne(Payment);
