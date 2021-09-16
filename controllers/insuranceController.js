const Insurance = require('../models/insurance');
const catchAsync = require('../helpers/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../helpers/appError');

exports.getAllUserInsurance = catchAsync(async (req, res, next) => {
    const insurances = await Insurance.find({ payor: req.user.id })
        .populate('payor', 'userName')
        .populate('vehicle', 'vehicleNumber');

    if (!insurances) {
        return next(new AppError('No insurances found!', 404));
    }

    res.status(200).json({
        status: 'success',
        results: insurances.length,
        insurances,
    });
});

exports.getAllInsurance = catchAsync(async (req, res, next) => {
    const insurances = await Insurance.find()
        .populate('payor', 'userName')
        .populate('vehicle', 'vehicleNumber');

    if (!insurances) {
        return next(new AppError('No insurances found!', 404));
    }

    res.status(200).json({
        status: 'success',
        results: insurances.length,
        insurances,
    });
});

exports.getUserInsurance = catchAsync(async (req, res, next) => {
    //* allow nested routes

    const insurances = await Insurance.findById(req.params.id)
        .populate('payor', 'userName')
        .populate('vehicle', 'vehicleNumber');

    if (!insurances) {
        return next(new AppError('No insurances found!', 404));
    }

    res.status(200).json({
        status: 'success',
        results: insurances.length,
        insurances,
    });
});

exports.addInsurance = catchAsync(async (req, res, next) => {
    const insurance = await Insurance.create({
        insuranceType: req.body.insuranceType,
        payor: req.user.id,
        vehicle: req.params.vehicleId,
        insuranceDOI: req.body.insuranceDOI,
        insuranceDOE: req.body.insuranceDOE,
    });
    if (!insurance) {
        return next(new AppError('No insurances found!', 404));
    }

    res.status(201).json({
        status: 'success',
        results: insurance.length,
            insurance,
    });
});

exports.createInsurance = factory.createOne(Insurance);

exports.updateInsurance = factory.updateOne(Insurance);

exports.deleteInsurance = factory.deleteOne(Insurance);
