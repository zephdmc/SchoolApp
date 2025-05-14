const http = require('http');
const app = require('./App');

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Academic Management Microservice running on port ${PORT}`);
});
