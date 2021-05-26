const {Vehicle} = require('../models/vehicle');

exports.getAllVehicles = async (req, res) =>{
    const vehicleList = await Vehicle.find();
    res.send(vehicleList);
};

exports.getVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if(!vehicle) {
        res.status(500).json({message: 'The vehicle is not found!'});
    }

    res.status(200).send(vehicle);
};

exports.addVehicle = async (req, res) =>{
    let vehicle = new Vehicle({
        vehicleId: req.body.vehicleId,
        ownerName: req.body.ownerName,
        vehicleRegistrationDate: req.body.vehicleRegistrationDate,
        vehicleType: req.body.vehicleType,
        vehicleNumber: req.body.vehicleNumber,
        engineCapacity: req.body.engineCapacity,
        latestPaymentDate: req.body.latestPaymentDate   
    });
    
    vehicle = await vehicle.save();

    if(!vehicle)
        return res.status(500).json({
            error: err,
            success: false,
            message: 'The vehicle cannot be created!'
        });

    res.send(vehicle);
};

exports.updateVehicle = async (req, res)=>{
    const vehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        {
            vehicleId: req.body.vehicleId,
            ownerName: req.body.ownerName,
            vehicleRegistrationDate: req.body.vehicleRegistrationDate,
            vehicleType: req.body.vehicleType,
            vehicleNumber: req.body.vehicleNumber,
            engineCapacity: req.body.engineCapacity,
            latestPaymentDate: req.body.latestPaymentDate   
        },
        {
            new: true
        }
    );

    if(!vehicle)
        return res.status(404).send('The vehicle cannot be created!');

    res.send(vehicle); 
};

exports.deleteVehicle = (req, res) => {
    Vehicle.findByIdAndRemove(req.params.id).then(Vehicle => {
        if(Vehicle){
            return res.status(200).json({success: true, message: 'The vehicle is deleted!'});
        }
        else{
            return res.status(404).json({success: false, message: 'The vehicle is not found!'});
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err});
    })
};

exports.getVehicleCount = async (req, res) =>{
    const vehicleCount = await Vehicle.countDocuments((count) => count)

    if(!vehicleCount) {
        res.status(500).json({success: false});
    } 
    res.send({
        vehicleCount: vehicleCount
    });
};