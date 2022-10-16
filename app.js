const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();

const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

require('./config/db.config'); // Connection to mongoDB

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

/**
 * Prevent SQL injection by sanatizing the received data
 */
app.use(mongoSanitize());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes); // login & signup routes for User
app.use('/api', sauceRoutes); // all routes for Sauce

module.exports = app;