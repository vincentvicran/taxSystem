const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, 'Please enter your name!'],
        },

        userEmail: {
            type: String,
            required: [true, 'Please provide your email!'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please enter a valid email!'],
        },

        userDOB: {
            type: Date,
            required: true,
        },

        userAddress: {
            type: String,
            default: '',
            required: true,
        },

        userContact: {
            type: String,
            required: true,
        },

        userPassword: {
            type: String,
            required: [true, 'Please enter a password!'],
            minlength: 6,
            select: false,
        },

        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password!'],
            validate: {
                //this only works on CREATE and SAVE
                validator: function (el) {
                    return el === this.userPassword;
                },
                message: 'Passwords does not match!',
            },
        },

        userPasswordChangedAt: {
            type: Date,
        },

        passwordResetToken: String,

        passwordResetExpiry: Date,

        active: {
            type: Boolean,
            default: true,
            select: false,
        },

        role: {
            type: String,
            required: true,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
);

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

userSchema.pre('save', async function (next) {
    //only run this function if password actually gets modified
    if (!this.isModified('userPassword')) return next();

    //hash the password with cost of 12
    this.userPassword = await bcrypt.hashSync(this.userPassword, 12);

    //delete the password confirm field
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', async function (next) {
    //only run this function if password actually is not modified, or nw document
    if (!this.isModified('userPassword') || this.isNew) return next();

    this.userPasswordChangedAt = Date.now() - 1000;

    next();
});

userSchema.pre(/^find/, function (next) {
    //* this points to current query
    this.find({ active: { $ne: false } });

    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compareSync(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.userPasswordChangedAt) {
        const changedTimestamp = parseInt(
            this.userPasswordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }

    //* false means not changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpiry = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
