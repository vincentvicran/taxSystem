const {Insurance} = require('../models/insurance');
const {Vehicle} = require('../models/vehicle');


exports.getAllInsurance = async (req, res) =>{
    const insuranceList = await Insurance.find()
        .populate('vehicleNumber', 'vehicleNumber');
    res.send(insuranceList);
};

exports.addInsurance = async (req, res) =>{

    const vehicleNumber = (await Vehicle.findById(req.body.vehicleNumber).populate('Vehicle').select('vehicleNumber'));

    const insurance = new Insurance({
        insuranceId: req.body.insuranceId,
        insuranceType: req.body.insuranceType,
        vehicleNumber: vehicleNumber,
        insuranceDOI: req.body.insuranceDOI,
        insuranceDOE: req.body.insuranceDOE        
    });
    insurance.save().then((createdInsurance => {
        res.status(201).json(createdInsurance)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
};

exports.updateInsurance = async (req, res)=>{
    const insurance = await Insurance.findByIdAndUpdate(
        req.params.id,
        {
            // insuranceId: req.body.insuranceId,
            insuranceType: req.body.insuranceType,
            vehicleNumber: req.body.vehicleNumber,
            insuranceDOI: req.body.insuranceDOI,
            insuranceDOE: req.body.insuranceDOE 
        },
        {
            new: true
        }
    );

    if(!insurance)
        return res.status(404).send('The insurance cannot be created!');

    res.send(insurance); 
};


exports.getInsuranceCount = async (req, res) =>{
    const insuranceCount = await Insurance.countDocuments((count) => count)

    if(!insuranceCount) {
        res.status(500).json({success: false});

    } 
    res.send({
        insuranceCount: insuranceCount
    });
};