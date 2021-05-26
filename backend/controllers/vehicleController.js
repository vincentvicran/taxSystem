const { Vehicle } = require('../models/vehicle');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

exports.getAllVehicles = catchAsync(async (req, res, next) => {
    const vehicleList = await Vehicle.find();
    res.send(vehicleList);
});

exports.getVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }

    res.status(200).send(vehicle);
});

exports.addVehicle = catchAsync(async (req, res, next) => {
    let vehicle = new Vehicle({
        vehicleId: req.body.vehicleId,
        ownerName: req.body.ownerName,
        vehicleRegistrationDate: req.body.vehicleRegistrationDate,
        vehicleType: req.body.vehicleType,
        vehicleNumber: req.body.vehicleNumber,
        engineCapacity: req.body.engineCapacity,
        latestPaymentDate: req.body.latestPaymentDate,
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
            vehicleId: req.body.vehicleId,
            ownerName: req.body.ownerName,
            vehicleRegistrationDate: req.body.vehicleRegistrationDate,
            vehicleType: req.body.vehicleType,
            vehicleNumber: req.body.vehicleNumber,
            engineCapacity: req.body.engineCapacity,
            latestPaymentDate: req.body.latestPaymentDate,
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

exports.deleteVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findByIdAndRemove(req.params.id);
    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }
    res.status(200).json({
        success: true,
        message: 'The vehicle is deleted!',
    });
});

exports.getVehicleCount = catchAsync(async (req, res, next) => {
    const vehicleCount = await Vehicle.countDocuments((count) => count);

    if (!vehicleCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        vehicleCount: vehicleCount,
    });
});
