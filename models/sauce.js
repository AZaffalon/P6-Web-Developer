const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String },
  name: { type: String, required: true },
  manufacturer: { type: String },
  description: { type: String },
  mainPepper: { type: String }, // main spicy ingredient 
  imageUrl: { type: String },
  heat: { type: Number },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: [{type: String}], // Array of userId who liked the sauce
  usersDisliked: [{type: String}] //Arrey of userId who disliked the sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);