const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = function () {
    return new User({}).save();
}