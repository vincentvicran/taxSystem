const mongoose = require('mongoose');

const insuranceSchema = mongoose.Schema({
    id: String,
    name: {
        type: String,
        required: true
    }

})

exports.Insurance = mongoose.model('Insurance', insuranceSchema);