



// mainserver.js
const http = require('http'); // Change to http for local testing
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Serve static frontend files
app.use('/', express.static(path.join(__dirname, './frontend-itc/build')));
app.use('/portal', express.static(path.join(__dirname, './portal-itc/build')));

// Import routes from usermanager and bookingmanager
const userApp = require('./user-management-service/src/App');
const result = require('./result-manager-service/src/App');
const academic = require('./academic-manager-service/src/App');
const payment = require('./payment-model-service/src/App');

app.use('/user', userApp);
app.use('/result', result);
app.use('/academic', academic);
app.use('/fee', payment);

// Serve index.html for any frontend routes not served by static files
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend-itc/build', 'index.html'), (err) => {
        if (err) {
            console.error('Error serving frontend:', err);
            res.status(err.status).end();
        }
    });
});

app.get('/portal/*', (req, res) => {
    res.sendFile(path.join(__dirname, './portal-itc/build', 'index.html'), (err) => {
        if (err) {
            console.error('Error serving portal:', err);
            res.status(err.status).end();
        }
    });
});

// Start HTTP server for local development
const port = 5003; // You can use any available port for local testing
const httpServer = http.createServer(app);
httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

// Catch-all for 404 errors
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});
