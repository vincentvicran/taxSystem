const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: String,
    name: {
        type: String,
        required: true
    }

})

exports.User = mongoose.model('User', userSchema);