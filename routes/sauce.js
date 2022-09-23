const express = require('express');
const router = express.Router();

const auth = require('../config/auth');
const multer = require('../config/multer-config');

const sauceController = require('../controllers/sauce');

router.get('/sauces', auth, sauceController.readAllSauces);
router.get('/sauces/:id', auth, sauceController.readOneSauce);
router.post('/sauces', auth, multer, sauceController.createSauce);

module.exports = router;