const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    id: String,
    name: {
        type: String,
        required: false
    }

})

exports.Vehicle = mongoose.model('Vehicle', vehicleSchema);