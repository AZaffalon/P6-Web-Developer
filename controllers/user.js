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
      // Test if email is valid
      if (!validateEmail(req.body.email)) {
        return res.status(401).json({ message: 'Invalid Email !'});
      }
      if (!checkPasswordStrength(req.body.password)) {
        return res.status(401).json({message: 'Password complexity is weak, please check that your password contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and 8 characters'});
      }
      const user = new User({
        email: cypherEmail,
        password: hash
      });
      user.save()
        .then((userCreated) => {
          userCreated.email = decrypt(userCreated.email);
          res.status(201).json({
            message: 'User created',
            user: userCreated
          });
        }
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
          user.email = decrypt(user.email);
          res.status(200).json({
            userId: user.id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_TOKEN_SECRET,
              { expiresIn: '24h' } // User must reconnect after 24h
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

// Email validity
function validateEmail(val) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(val);
}

// Check password complexity
function checkPasswordStrength(password) {
  let strength = 0;

  // contain at least 1 lowercase letter
  if (password.match(/(?=.*[a-z])/)) {
    strength += 1;
  }

  // contain at least 1 uppercase letter
  if (password.match(/(?=.*[A-Z])/)) {
    strength += 1;
  }

  // contain at least 1 number
  if (password.match(/[0-9]+/)) {
    strength += 1;
  }

  // contain at least 1 special character
  if (password.match(/[$@#&!]+/)) {
    strength += 1;
  }
  
  // At least 8 characters long
  if (password.length > 7) {
    strength += 1;
  }

  if (strength < 4) {
    return false;
  } else if (strength < 5){
    return true;
  } else {
    return true;
  }
}