const Vehicle = require('../models/vehicle');

const factory = require('./handlerFactory');

const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

exports.getAllUserVehicles = catchAsync(async (req, res, next) => {
    let resultQuery = Vehicle.find(req.query);
    const vehicles = await resultQuery.find({
        uploadedBy: req.user.id,
    }).populate({
        path: 'uploadedBy',
        select: 'userName',
    });
    res.status(200).json({
        status: 'success',
        results: vehicles.length,
            vehicles,

    });
});

exports.getAllVehicles = catchAsync(async (req, res, next) => {
    const vehicles = await Vehicle.find().populate({
        path: 'uploadedBy',
        select: 'userName',
    });
    res.status(200).json({
        status: 'success',
        results: vehicles.length,
            vehicles,
    });
});

exports.getVehicle = factory.getOne(Vehicle, {
    path: 'uploadedBy',
    select: 'userName',
});
//  = catchAsync(async (req, res, next) => {
//     const vehicle = await Vehicle.findById(req.params.id).populate(
//         'uploadedBy',
//         'userName'
//     );

//     if (!vehicle) {
//         return next(new AppError('No vehicle found with that ID', 404));
//     }

//     res.status(200).send(vehicle);
// });

exports.addVehicle = catchAsync(async (req, res, next) => {
    // date = req.body.latestPaymentDate;
    // console.log(date);
    let vehicle = new Vehicle({
        ownerName: req.body.ownerName,
        vehicleRegistrationDate: req.body.vehicleRegistrationDate,
        vehicleType: req.body.vehicleType,
        vehicleNumber: req.body.vehicleNumber,
        engineCapacity: req.body.engineCapacity,
        latestPaymentDate: req.body.latestPaymentDate,
        expiryDate: addDays(req.body.latestPaymentDate, 365),
        uploadedBy: req.user.id,
    });

    vehicle = await vehicle.save();

    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }

    res.status(201).send({
        status: 'success',
        vehicle,
    });
});

exports.updateVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        {
            ownerName: req.body.ownerName,
            vehicleRegistrationDate: req.body.vehicleRegistrationDate,
            vehicleType: req.body.vehicleType,
            vehicleNumber: req.body.vehicleNumber,
            engineCapacity: req.body.engineCapacity,
            latestPaymentDate: req.body.latestPaymentDate,
            expiryDate: addDays(req.body.latestPaymentDate, 365),
            // uploadedBy: req.user.id,
        },
        {
            new: true,
        }
    );

    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }

    res.status(200).json({ status: 'success', vehicle });
});

exports.createVehicle = factory.createOne(Vehicle);

exports.updateVehicles = factory.updateOne(Vehicle);

exports.deleteVehicle = factory.deleteOne(Vehicle);
// exports.deleteVehicle = catchAsync(async (req, res, next) => {
//     const vehicle = await Vehicle.findByIdAndRemove(req.params.id);
//     if (!vehicle) {
//         return next(new AppError('No vehicle found with that ID', 404));
//     }
//     res.status(200).json({
//         success: true,
//         message: 'The vehicle is deleted!',
//     });
// });
