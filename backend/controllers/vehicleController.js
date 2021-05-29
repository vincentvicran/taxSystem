const Vehicle = require('../models/vehicle');

const factory = require('./handlerFactory');

const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

exports.getAllUserVehicles = catchAsync(async (req, res, next) => {
    const vehicleList = await Vehicle.find({
        uploadedBy: req.user.id,
    }).populate({
        path: 'uploadedBy',
        select: 'userName',
    });
    res.send(vehicleList);
});

exports.getAllVehicles = catchAsync(async (req, res, next) => {
    const vehicleList = await Vehicle.find().populate({
        path: 'uploadedBy',
        select: 'userName',
    });
    res.send(vehicleList);
});

exports.getVehicle = factory.getOne(Vehicle, {
    path: 'uploadedBy',
    select: 'username',
});
<<<<<<< HEAD
=======
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
>>>>>>> 3f5bec6ff37506710c7e9671b74ae43279c80359

exports.addVehicle = catchAsync(async (req, res, next) => {
    let vehicle = new Vehicle({
        ownerName: req.body.ownerName,
        vehicleRegistrationDate: req.body.vehicleRegistrationDate,
        vehicleType: req.body.vehicleType,
        vehicleNumber: req.body.vehicleNumber,
        engineCapacity: req.body.engineCapacity,
        latestPaymentDate: req.body.latestPaymentDate,
        uploadedBy: req.user.id,
    });

    vehicle = await vehicle.save();

    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }

    res.send(vehicle);
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
            // uploadedBy: req.user.id,
        },
        {
            new: true,
        }
    );

    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }

    res.send(vehicle);
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
