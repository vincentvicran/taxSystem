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

        uploadedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },

        // insurance: Array,
    },
    { timestamps: true }
);

// vehicleSchema.pre('save', async function (next) {
//     const insurancePromise = this.insurance.map(
//         async (id) => await Insurance.findById(id)
//     );

//     this.insurance = await Promise.all(insurancePromise);

//     next();
// });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
