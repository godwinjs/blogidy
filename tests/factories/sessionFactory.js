
const { v4: uuidv4 } = require('uuid');
const { v5: uuidv5 } = require('uuid')
require('dotenv').config();
const keys = require('../config/keys')

const { sign } = require('../node_modules/cookie-signature')
const Buffer = require('safe-buffer').Buffer;

module.exports = (id) => {

    const sessionObject = {
        passport: { user: id }
    }

    const namespace = uuidv4().toString();
    const token = Buffer.from(JSON.stringify(sessionObject)).toString('base64')
    const userUUID = uuidv5(token, namespace ).toString();

    const userSig = sign('s:'+userUUID, keys.cookieKey);

    return { session: token, signature: userSig }
}