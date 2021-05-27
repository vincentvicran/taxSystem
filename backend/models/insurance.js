const mongoose = require('mongoose');

const insuranceSchema = mongoose.Schema(
    {
        insuranceId: Number,

        insuranceType: {
            type: String,
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
    },
    { timestamps: true }
);

const Insurance = mongoose.model('Insurance', insuranceSchema);

module.exports = Insurance;
