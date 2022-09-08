const bcrypt = require('bcrypt');

const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save({validateModifiedOnly: true})
        .then(() => res.status(201).json({message: 'Utilisateur créé'}))
        .catch(error => res.status(400).json({error}));
        console.log("-------------------New user -------------------");
        console.log(user);
        console.log('------------------------------------------');
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
      if (!user) {
          return res.status(404).json({ message: 'User does not exist !'});
      }
      bcrypt.compare(req.body.password, user.password)
          .then(valid => {
              if (!valid) {
                  return res.status(401).json({ message: 'Invalid password !' });
              }
              res.status(200).json({
                  userId: user._id,
                  token: jwt.sign(
                    { userId: user._id },
                    `${process.env.JWT_TOKEN_SECRET}`,
                    { expiresIn: '24h' } // l'utilisateur devra se reconnecter au bout de 24h
                  )
              });
          })
          .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};