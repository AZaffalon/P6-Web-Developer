// Import bcrypt to encrypt password
const bcrypt = require('bcrypt');

require("dotenv").config();

// Import User model
const User = require('../models/user');

const jwt = require('jsonwebtoken');

// import Crypto-js to encrypt email
const CryptoJS = require('crypto-js');
const CRYPTOJS_KEY = process.env.CRYPTOJS_KEY;
const iv = process.env.CRYPTOJS_IV;

// Signup logic  
exports.signup = (req, res, next) => {
  const cypherEmail = encrypt(req.body.email);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: cypherEmail,
        password: hash
      });
      user.save()
        .then((userCreated) => res.status(201).json({
            message: 'User created', 
            user: decrypt(userCreated.email)
          })
        )
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

// Sign-in logic
exports.login = (req, res, next) => {
  User.findOne({ email: encrypt(req.body.email) })
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
                  user: user,
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

// encrypt email using crypto-js AES
function encrypt(string) {
  const encryptedEmail = CryptoJS.AES.encrypt(string, CryptoJS.enc.Base64.parse(CRYPTOJS_KEY), {
    iv: CryptoJS.enc.Base64.parse(iv),
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encryptedEmail.toString();
}

// Decrypt email that has been encrypted by 'encrypt()'
function decrypt(encrypted_string) {
  const bytes = CryptoJS.AES.decrypt(encrypted_string, CryptoJS.enc.Base64.parse(CRYPTOJS_KEY), {
    iv: CryptoJS.enc.Base64.parse(iv),
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return bytes.toString(CryptoJS.enc.Utf8);
}