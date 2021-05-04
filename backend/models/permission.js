const mongoose = require('mongoose');

const permissionSchema = mongoose.Schema({
    id: String,
    name: {
        type: String,
        required: true
    }

})

exports.Permission = mongoose.model('Permission', permissionSchema);