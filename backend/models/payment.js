const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    id: String,
    name: {
        type: String,
        required: true
    }

})

exports.Payment = mongoose.model('Payment', paymentSchema);