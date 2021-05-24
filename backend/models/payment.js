const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    paymentId: {
        type: String,
        unique: true,
        required: true
    },

    userName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    ownerName: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Vehicle',
        required: true
    },

    vehicleNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Vehicle',
        required: true
    },

    paymentAmount: {
        type: String,
        required: true
    },

    voucherImage: {
        type: String,
        required: true
    },

    paymentDate: {
        type: Date,
        required: true,
        default: Date.now
    }

}, {timestamps: true});

exports.Payment = mongoose.model('Payment', paymentSchema);