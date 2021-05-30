const Insurance = require('../models/insurance');
const catchAsync = require('../helpers/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../helpers/appError');

exports.getAllUserInsurance = catchAsync(async (req, res, next) => {
    const insuranceList = await Insurance.find({ payor: req.user.id })
        .populate('payor', 'userName')
        .populate('vehicle', 'vehicleNumber');

    if (!insuranceList) {
        return next(new AppError('No insurances found!', 404));
    }

    res.status(200).json({
        status: 'success',
        results: insuranceList.length,
        data: {
            insuranceList,
        },
    });
});

exports.getAllInsurance = catchAsync(async (req, res, next) => {
    const insuranceList = await Insurance.find()
        .populate('payor', 'userName')
        .populate('vehicle', 'vehicleNumber');

    if (!insuranceList) {
        return next(new AppError('No insurances found!', 404));
    }

    res.status(200).json({
        status: 'success',
        results: insuranceList.length,
        data: {
            insuranceList,
        },
    });
});

exports.getUserInsurance = catchAsync(async (req, res, next) => {
    //* allow nested routes

    const insuranceList = await Insurance.findById(req.params.id)
        .populate('payor', 'userName')
        .populate('vehicle', 'vehicleNumber');

    if (!insuranceList) {
        return next(new AppError('No insurances found!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: insuranceList,
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
        data: {
            insurance,
        },
    });
});

exports.createInsurance = factory.createOne(Insurance);

exports.updateInsurance = factory.updateOne(Insurance);

exports.deleteInsurance = factory.deleteOne(Insurance);
