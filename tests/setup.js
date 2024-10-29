require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();
const keys = require('../config/keys')


mongoose.Promise = global.Promise; // use nodeJS implementation of promise
mongoose.connect(keys.mongoURI);

