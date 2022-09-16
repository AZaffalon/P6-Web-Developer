const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauce');

router.get('/sauces', sauceController.getAllSauces);
router.get('/sauces/:id', sauceController.getOneSauce);

module.exports = router;