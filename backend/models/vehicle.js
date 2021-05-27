const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema(
    {
        // vehicleId: String,

        ownerName: {
            type: String,
            required: true,
        },

        vehicleRegistrationDate: {
            type: Date,
            required: true,
        },

        vehicleType: {
            type: String,
            required: true,
            enum: ['TwoWheeler', 'FourWheeler'],
            default: 'TwoWheeler',
        },

        vehicleNumber: {
            type: String,
            required: true,
        },

        engineCapacity: {
            type: String,
            required: true,
        },

        latestPaymentDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
