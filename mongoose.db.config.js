const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose');

function mongooseConnectDB() {
  mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_MDP}@clusterpiiquante.nsroogp.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
}

module.exports = mongooseConnectDB;