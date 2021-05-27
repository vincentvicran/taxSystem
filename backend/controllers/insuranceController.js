const Insurance = require('../models/insurance');
const Vehicle = require('../models/vehicle');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

exports.getAllInsurance = catchAsync(async (req, res, next) => {
    const insuranceList = await Insurance.find().populate(
        'vehicleNumber',
        'vehicleNumber'
    );

    if (!insuranceList) {
        return next(new AppError('No insurances found!', 404));
    }

    res.send(insuranceList);
});

exports.addInsurance = catchAsync(async (req, res, next) => {
    const vehicleNumber = await Vehicle.findById(req.body.vehicleNumber)
        .populate('Vehicle')
        .select('vehicleNumber');

    const insurance = new Insurance({
        // insuranceId: req.body.insuranceId,
        insuranceType: req.body.insuranceType,
        vehicleNumber: vehicleNumber,
        insuranceDOI: req.body.insuranceDOI,
        insuranceDOE: req.body.insuranceDOE,
    });
    insurance.save().then((createdInsurance) => {
        res.status(201).json(createdInsurance);
    });
});

exports.updateInsurance = catchAsync(async (req, res, next) => {
    const insurance = await Insurance.findByIdAndUpdate(
        req.params.id,
        {
            // insuranceId: req.body.insuranceId,
            insuranceType: req.body.insuranceType,
            vehicleNumber: req.body.vehicleNumber,
            insuranceDOI: req.body.insuranceDOI,
            insuranceDOE: req.body.insuranceDOE,
        },
        {
            new: true,
        }
    );

    if (!insurance)
        return next(new AppError('The insurance could not be updated!', 404));

    res.send(insurance);
});

exports.getInsuranceCount = catchAsync(async (req, res, next) => {
    const insuranceCount = await Insurance.countDocuments((count) => count);

    if (!insuranceCount) {
        return next(new AppError('No insurances found!', 500));
    }

    res.send({
        insuranceCount: insuranceCount,
    });
});
