const express = require('express');
const cors = require('cors');
const app = express();

const userRoutes = require('./routes/user');

require('./config/db.config'); // Connection to mongoDB

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/api/auth', userRoutes); // login & signup routes for User

module.exports = app;