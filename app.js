const express = require('express');
// Set various http headers to help secure the app
const helmet = require("helmet");
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
// Limit number of request per window in a certain time
const rateLimit = require('express-rate-limit');

/**
 * Limiter | number of requests for login and signup routes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // Limit each IP to 6 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Limiter | number of requests for all other routes of the project
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Limit spped of request after a certain number
const slowDown = require("express-slow-down");

/**
 * Limit speed of requests after a 100
 */
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests to go at full-speed, then...
  delayMs: 500 // 101th request has a 500ms delay, 7th has a 1000ms delay, 8th gets 1500ms, etc.
});

const app = express();

const path = require('path');

const hateoasLinker = require("express-hateoas-links");

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

require('./config/db.config'); // Connection to mongoDB

app.use(cors());

app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

/**
 * Log Database
 * ! TO BE FINISHED !
 */
// var bunyan = require('bunyan');
// var log = bunyan.createLogger({name: "myapp"});
// log.info("hi");

/**
 * To add hateoas links to our methods
 */
app.use(hateoasLinker);

/**
 * Prevent SQL injection by sanatizing the received data
 */
app.use(mongoSanitize());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', authLimiter, userRoutes); // login & signup routes for User
app.use('/api', limiter, speedLimiter, sauceRoutes); // all routes for Sauce

module.exports = app;