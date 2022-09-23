const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauce');

router.get('/sauces', sauceController.readAllSauces);
router.get('/sauces/:id', sauceController.readOneSauce);

module.exports = router;