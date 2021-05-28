const Insurance = require('../models/insurance');
const catchAsync = require('../helpers/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../helpers/appError');

exports.getAllInsurance = catchAsync(async (req, res, next) => {
    const insuranceList = await Insurance.find()
        .populate('payor', 'userName')
        .populate('vehicle', 'vehicleNumber');

    if (!insuranceList) {
        return next(new AppError('No insurances found!', 404));
    }

    res.send(insuranceList);
});

exports.getUserInsurances = catchAsync(async (req, res, next) => {
    //* allow nested routes
    if (!req.body.vehicle) req.body.vehicle = req.params.vehicleId;
    if (!req.body.user) req.body.user = req.user.id;

    const insuranceList = await Insurance.find()
        .populate('payor', 'userName')
        .populate('vehicle', 'vehicleNumber');

    if (!insuranceList) {
        return next(new AppError('No insurances found!', 404));
    }

    res.send(insuranceList);
});

exports.getUserInsurance = catchAsync(async (req, res, next) => {
    //* allow nested routes
    if (!req.body.user) req.body.user = req.user.id;

    const insuranceList = await Insurance.findById(req.params.userId)
        .populate('payor', 'userName')
        .populate('vehicle', 'vehicleNumber');

    if (!insuranceList) {
        return next(new AppError('No insurances found!', 404));
    }

    res.send(insuranceList);
});

exports.addInsurance = catchAsync(async (req, res, next) => {
    const insurance = await Insurance.create({
        insuranceType: req.body.insuranceType,
        payor: req.user.id,
        vehicle: req.body.vehicle,
        insuranceDOI: req.body.insuranceDOI,
        insuranceDOE: req.body.insuranceDOE,
    });
    if (!insurance) {
        return next(new AppError('No insurances found!', 404));
    }

    res.send(insurance);
});

exports.createInsurance = factory.createOne(Insurance);

exports.updateInsurance = factory.updateOne(Insurance);

exports.deleteInsurance = factory.deleteOne(Insurance);
