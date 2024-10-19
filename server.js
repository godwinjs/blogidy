// server.js
const express = require('express');
const next = require('next');

// Check if the app is in development mode
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Example of a custom route using Express
  server.get('/p/:id', (req, res) => {
    const actualPage = '/post';
    const queryParams = { id: req.params.id }; // Send id as a query parameter
    app.render(req, res, actualPage, queryParams);
  });

   // server.js (continued)
    server.get('/api/custom', (req, res) => {
        res.json({ message: 'This is a custom API route using Express!' });
    });

  // Default request handler for all other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server on a specific port
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server ready on http://localhost:${PORT}`);
  });
});
