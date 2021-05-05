const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    vehicleId: String,

    ownerName: {
        type: String,
        required: true
    },
    
    vehicleRegistrationDate: {
        type: Date,
        required: true
    },

    vehicleType: {
        type: String,
        required: true
    },

    vehicleNumber: {
        type: String,
        required: true
    },

    engineCapacity: {
        type: String,
        required: true
    },

    latestPaymentDate: {
        type: Date,
        required: true
    }
})

exports.Vehicle = mongoose.model('Vehicle', vehicleSchema);