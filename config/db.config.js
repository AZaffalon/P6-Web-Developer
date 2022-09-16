require("dotenv").config();

const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;

// Store Connection Object
const db = mongoose.connection;

const config = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(URI, config);

db.on("open", () => { console.log('Connexion à MongoDB réussie !'); })
  .on("error", (err) => { console.log('Connexion à MongoDB échouée !'); });

module.exports = db;