const Sauce = require('../models/sauce');


exports.readAllSauces = (req, res, next) => {
  Sauce.find()
    .then(allSauces => res.status(200).json({ allSauces }))
    .catch(error => res.status(500).json({error}));
};

exports.readOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json({sauce}))
    .catch(error => res.status(500).json({error}));
};

exports.createSauce = (req, res, next) => {
  delete req.body._id;
  const sauce = new Sauce({
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper, 
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    usersLiked: req.body.usersLiked,
    usersDisliked: req.body.usersDisliked
  });
  sauce.save()
    .then(() => res.status(201).json({message: 'Sauce créée !'}))
    .catch(error => res.status(401).json({error}));
};