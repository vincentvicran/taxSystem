const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

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
        default: '',
        required: true
    },

    userContact: {
        type: String,
        required: true
    },

    userPassword: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        require: true,
        default: false
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;