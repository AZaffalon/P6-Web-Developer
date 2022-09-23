const Sauce = require('../models/sauce');

exports.readAllSauces = (req, res, next) => {
  Sauce.find()
    .then(allSauces => {
      allSauces.map(sauce => sauce.imageUrl = `${req.protocol}://${req.get('host')}${sauce.imageUrl}`);
      res.status(200).json(allSauces);
    })
    .catch(error => res.status(500).json({error}));
};

exports.readOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      sauce.imageUrl = `${req.protocol}://${req.get('host')}${sauce.imageUrl}`;
      res.status(200).json(sauce);
    })
    .catch(error => res.status(500).json({error}));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({message: 'Sauce créée !'}))
    .catch(error => res.status(401).json({error}));
};