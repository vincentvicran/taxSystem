const {Vehicle} = require('../models/vehicle');
const express = require('express');
const router = express.Router();

//* get request response
router.get(`/`, async (req, res) =>{
    const vehicleList = await Vehicle.find();
    res.send(vehicleList);
})


//* post request response
router.post(`/`, (req, res) =>{
    const vehicle = new Vehicle({
        id: req.body.id,
        name: req.body.name,
        
    });
    vehicle.save().then((createdVehicle => {
        res.status(201).json(createdVehicle)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

module.exports = router;