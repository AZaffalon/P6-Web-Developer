const express = require('express');
const cors = require('cors');
const app = express();

const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

require('./config/db.config'); // Connection to mongoDB

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes); // login & signup routes for User
app.use('/api', sauceRoutes); // all routes for Sauce

module.exports = app;