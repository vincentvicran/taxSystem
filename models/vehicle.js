const mongoose = require('mongoose');
// const Insurance = require('./insurance');

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
            unique: true,
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

        expiryDate: {
            type: Date,
            required: true,
        },

        uploadedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },

        // insurance: Array,
    },
    { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
