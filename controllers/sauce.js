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
