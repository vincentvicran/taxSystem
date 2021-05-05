const mongoose = require('mongoose');

const permissionSchema = mongoose.Schema({
    permissionId: String,

    permissionRoleId: {
        type: String,
        required: true
    },

    permissionTitle: {
        type: String,
        required: true
    }

})

exports.Permission = mongoose.model('Permission', permissionSchema);