const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({

    userName: {
        type: String,
        required: [true, 'Please enter your name!']
    },

    userEmail: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email!']
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
        required: [true, 'Please enter a password!'],
        minlength: 6
    },

    // userPasswordConfirm: {
    //     type: String,
    //     required: [true, 'Please confirm your password!'],
    //     validate: {
    //         //this only works on CREATE and SAVE 
    //         validator: function(el) {
    //             return el === this.password;
    //         },
    //         message: 'Passwords does not match!'
    //     }
    // },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

userSchema.pre('save', async function(next) {
    //only run this function if password actually gets modified
    if(!this.isModified('userPassword'))
        return next();

    //hash the password with cost of 12
    this.userPassword = await bcrypt.hashSync(this.userPassword, 12);

    //delete the password confirm field
    // this.userPasswordConfirm = undefined;

    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;