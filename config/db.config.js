require("dotenv").config();

const mongoose = require('mongoose');
const bunyan = require('bunyan')

const URI = process.env.MONGO_URI;

// Store Connection Object
const db = mongoose.connection;

const config = { useNewUrlParser: true, useUnifiedTopology: true, ssl: true };

// Log of DB query and error in console
const log = bunyan.createLogger({
  name: "MongoDB Driver",
  serializers: {
    dbQuery: serializer,
  },
  streams: [
    {
      stream: process.stdout,
      level: "info",
    },
    {
      stream: process.stdout,
      level: "debug",
    },
    {
      stream: process.stderr,
      level: "error",
    },
    {
      type: "rotating-file",
      path: "./logs/mongodb.log", // Keep logs in this path
      period: "1d", // Daily rotation
      count: 3, // Keep 3 back copies
    },
  ],
});

// Return JSON objects from Javascript objects
function serializer(data) {
  let query = JSON.stringify(data.query);
  let options = JSON.stringify(data.options || {});

  return `db.${data.coll}.${data.method}(${query}, ${options});`;
}

mongoose.set("debug", function (coll, method, query, doc, options) {
  let set = {
    coll: coll,
    method: method,
    query: query,
    doc: doc,
    options: options,
  };

  log.info({
    dbQuery: set,
  });
});

mongoose.connect(URI, config);

db.on("open", () => { console.log('Connexion à MongoDB réussie !'); })
  .on("error", (err) => { console.log('Connexion à MongoDB échouée !'); });

module.exports = db;