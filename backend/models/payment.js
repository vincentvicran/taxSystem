const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    paymentId: {
        type: String,
        unique: true,
        required: true
    },

    userId: {
        type: String,
        required: true
    },

    bookId: {
        type: String,
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
        required: true
    }

})

exports.Payment = mongoose.model('Payment', paymentSchema);