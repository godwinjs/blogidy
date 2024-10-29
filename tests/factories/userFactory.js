const mongoose = require('mongoose');

const User = mongoose.model('User');

module.export = () => {
    return new User({}).save();
}