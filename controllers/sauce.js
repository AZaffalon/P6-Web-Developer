const Sauce = require('../models/sauce');

// Get all sauces
exports.readAllSauces = (req, res, next) => {
  Sauce.find()
    .then(allSauces => {
      allSauces.map(sauce => sauce.imageUrl = `${req.protocol}://${req.get('host')}${sauce.imageUrl}`);
      res.status(200).json(allSauces);
    })
    .catch(error => res.status(500).json({error}));
};

// Get one sauce
exports.readOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      sauce.imageUrl = `${req.protocol}://${req.get('host')}${sauce.imageUrl}`;
      res.status(200).json(sauce);
    })
    .catch(error => res.status(500).json({error}));
};

// Create a sauce
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

// Update a sauce
// TODO: test if this works
exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

// Like or Dislike a sauce
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      switch(req.body.like) {
        // If user want to like the sauce
        case 1:
          let likeToSend = {
            $inc:{likes: 1},
            $push:{usersLiked: req.auth.userId}
          };
          // if user already disliked the sauce
          if(sauce.usersDisliked.includes(req.auth.userId)){ /// ? OK ? ///
            likeToSend = {
              $inc:{likes:1, dislikes:-1}, // increment
              $push:{usersLiked: req.auth.userId}, // append value
              $pull:{usersDisliked: req.auth.userId} // remove from array all existing values matching the condition
            };
          }
          // if the user didn't put any like or dislike yet
          if(!sauce.usersLiked.includes(req.auth.userId)) { /// ? OK ? ///
            Sauce.findByIdAndUpdate({_id: req.params.id}, likeToSend, {new: true})
              .then(sauceUpdated => {
                res.status(200).json(sauceUpdated);
              })
              .catch(error => res.status(400).json({error}));
          } else {
            res.status(200).json({message: "You've already liked this sauce"});
          }
          break;
        // If user want to remove the like or dislike
        case 0:
          let likeToRemove = {
            $inc:{likes: -1},
            $pull:{usersLiked: req.auth.userId},
          };
          let dislikeToRemove = {
            $inc:{dislikes: -1},
            $pull:{usersDisliked: req.auth.userId},
          };
          // User want to remove the like /// ? OK ? ///
          if(sauce.usersLiked.includes(req.auth.userId)) {
            Sauce.findByIdAndUpdate({_id: req.params.id}, likeToRemove, {new: true})
              .then(sauceUpdated => {
                res.status(200).json(sauceUpdated);
              })
              .catch(error => res.status(400).json({error}));
              break;
          } 
          // User want to remove the dislike
          if(sauce.usersDisliked.includes(req.auth.userId)) {
            Sauce.findByIdAndUpdate({_id: req.params.id}, dislikeToRemove, {new: true})
              .then(sauceUpdated => {
                res.status(200).json(sauceUpdated);
              })
              .catch(error => res.status(400).json({error}));
              break;
          }
          // Never liked or disliked before
          if( (!sauce.usersLiked.includes(req.auth.userId)) && (!sauce.usersDisliked.includes(req.auth.userId)) ){
            res.status(422).json({message: "You've tried to remove a like or a dislike but never added one before"});
          }
          break;
        // If user want to dislike the sauce
        case -1:
          let dislikeToSend = {
            $inc:{dislikes: 1},
            $push:{usersDisliked: req.auth.userId}
          };
          // if user already liked the sauce
          if(sauce.usersLiked.includes(req.auth.userId)){ /// ? OK ? ///
            dislikeToSend = {
              $inc:{likes: -1, dislikes: 1},
              $push:{usersDisliked: req.auth.userId},
              $pull:{usersLiked: req.auth.userId}
            };
          }
          //if the user didn't put any like or dislike yet
          if(!sauce.usersDisliked.includes(req.auth.userId)) { /// ? OK ? ///
            Sauce.findByIdAndUpdate({_id: req.params.id}, dislikeToSend, {new: true})
              .then(sauceUpdated => {
                res.status(200).json(sauceUpdated);
              })
              .catch(error => res.status(400).json({error}));
          } else {
            res.status(200).json({message: "You've already disliked this sauce"});
          }
          break;
        default:
          res.status(422).json({message: "Invalid value for like. Value must be -1, 0 or 1"});
      }
    })
    .catch(error => res.status(400).json({error}));
};