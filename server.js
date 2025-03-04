// server.js
const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const { v5: uuidv5 } = require('uuid');
const Buffer = require('safe-buffer').Buffer;
//
require('dotenv').config();
//
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

require('./models/User');
require('./models/Blog');
require('./services/passport');
require('./services/cache')

mongoose.Promise = global.Promise; // what implementation of promise should mongoose use
mongoose.connect(keys.mongoURI);

// Check if the app is in development mode
const dev = process.env.NODE_ENV !== 'production';
const server = next({ dev });
const handle = server.getRequestHandler();

server.prepare().then(() => {
    
    const app = express();

    app.use(bodyParser.json());

    app.use(session({
        genid: function(req) {

            const userID = req.user?.id || req.headers['x-User-id'] || req.sessionID;
            const sessionObject = {
                passport: { user: userID }
            }

            const namespace = uuidv4().toString();
            const token = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
            const userUUID = uuidv5(token, namespace );
            return userUUID;
        },
        secret: keys.cookieKey,  // You should use an environment variable for security
        resave: false,            // Don't save session if unmodified
        saveUninitialized: true,  // Save uninitialized sessions (for login)
        cookie: { 
            secure: process.env.NODE_ENV === 'production', 
            maxAge:  24 * 60 * 60 * 1000 // Set to true in production when using HTTPS
        }
    }));
    // 
    app.use(passport.initialize());
    app.use(passport.session());
    
    // routes
    require('./routes/authRoutes')(app);
    require('./routes/blogRoutes')(app);
    
    // Example of a page url request that renders a nextjs page url
    app.get('/p/:id', (req, res) => {
    const actualPage = '/blogs';
    const queryParams = { id: req.params.id }; // Send id as a query parameter
    app.render(req, res, actualPage+ '/' + queryParams.id); // next route:
    });

    // express route: Example of a custom route using Express
    app.get('/api/custom', (req, res) => {
        res.json({ message: 'This is a custom API route using Express!' });
    });

    // Default request handler for all other routes
    app.all('*', (req, res) => {
        return handle(req, res);
    });

    // Start the server on a specific port
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, (err) => {
        if (err) throw err;
            console.log(`Server ready on http://localhost:${PORT}`);
        }
    );
});

// ref: https://github.com/balmasi/migrate-mongoose
