const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true,'Password is required']
    },
},
{ collection: 'users' }
);

const model = mongoose.model('userSchema', userSchema);

module.exports = model;