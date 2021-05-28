const mongoose = require('mongoose');

const insuranceSchema = mongoose.Schema(
    {
        // insuranceId: Number,

        insuranceType: {
            type: String,
            required: true,
            enum: ['Third Party', 'Full Insurance'],
            default: 'Third Party',
        },

        payor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        insuranceDOI: {
            type: Date,
            required: true,
        },

        insuranceDOE: {
            type: Date,
            required: true,
        },

        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
        },
    },
    { timestamps: true }
);

const Insurance = mongoose.model('Insurance', insuranceSchema);

module.exports = Insurance;
