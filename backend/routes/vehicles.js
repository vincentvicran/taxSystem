const {Vehicle} = require('../models/vehicle');
const express = require('express');
const router = express.Router();


//* get request response
//?for all vehicles
router.get(`/`, async (req, res) =>{
    const vehicleList = await Vehicle.find();
    res.send(vehicleList);
})

//?for specific vehicle
router.get(`/:id`, async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if(!vehicle) {
        res.status(500).json({message: 'The vehicle is not found!'});
    }

    res.status(200).send(vehicle);
})


//* post request response
router.post(`/`, async (req, res) =>{
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
})


//* update
router.put(`/:id`, async (req, res)=>{
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
})


//* delete request and response
router.delete(`/:id`, (req, res) => {
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
})

router.get(`/get/count`, async (req, res) =>{
    const vehicleCount = await Vehicle.countDocuments((count) => count)

    if(!vehicleCount) {
        res.status(500).json({success: false});
    } 
    res.send({
        vehicleCount: vehicleCount
    });
})

module.exports = router;