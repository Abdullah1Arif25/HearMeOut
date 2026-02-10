require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const connectDB = require('./config/database');
const { port } = require('./config/config'); 
const http = require("http");
const setupSocket = require("./config/socketIO");

connectDB(); // connect to db

const app = express();

// basic middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// routes
const userRoutes = require('./routes/users.routes');
const messageRoutes = require('./routes/messages.routes');
const localRoomsRoutes = require('./routes/localrooms.routes');
const globalRoutes = require('./routes/globalrooms.routes');
const branchingRoomRoutes = require('./routes/branchingrooms.routes');


// greeting route
app.get('/api', function (req, res) {
  res.json({ message: 'Welcome to the HMO API' });
});

// mount routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/localrooms',localRoomsRoutes );
app.use('/api/v1/globalrooms', globalRoutes);
app.use('/api/v1/branchingrooms',branchingRoomRoutes);
app.use('/api/v1/messages', messageRoutes);

// 404 fallback
app.use('/api/*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

// serve frontend
app.use(history());
const root = path.normalize(__dirname + '/..');
const client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// error handler
const env = app.get('env');
app.use(function (err, req, res, next) {
  console.error(err.stack);
  const err_res = {
    message: err.message,
    error: env === 'development' ? err.stack : {}
  };
  res.status(err.status || 500).json(err_res);
});

// create HTTP server
const httpServer = http.createServer(app);

// attach socket to HTTP server
setupSocket(httpServer, app);

// start server
httpServer.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express + SocketIO server running on port ${port}`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend (production): http://localhost:${port}/`);
});


module.exports = app;