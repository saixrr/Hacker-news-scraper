const express = require('express');
const cors = require('cors');
const getStories = require('../controllers/getstories');

const router = express.Router();

router.get("/getstories", getStories);

module.exports = router; 