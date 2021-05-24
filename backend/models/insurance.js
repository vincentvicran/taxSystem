const mongoose = require('mongoose');

const insuranceSchema = mongoose.Schema({
    insuranceId: String,

    insuranceType: {
        type: String,
        required: true
    },

    insuranceDOI: {
        type: Date,
        required: true
    },

    insuranceDOE: {
        type: Date,
        required: true
    }

}, {timestamps: true});

exports.Insurance = mongoose.model('Insurance', insuranceSchema);