const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId: String,

    userRole: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    userEmail: {
        type: String,
        required: true
    },

    userDOB: {
        type: Date,
        required: true
    },

    userAddress: {
        type: String,
        required: true
    },

    userPassword: {
        type: String,
        required: true
    }


})

exports.User = mongoose.model('User', userSchema);