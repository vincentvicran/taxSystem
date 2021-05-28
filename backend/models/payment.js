const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
    {
        payor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
        },

        paymentAmount: {
            type: String,
            required: true,
        },

        voucherImage: {
            type: String,
            required: true,
        },

        paymentDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
