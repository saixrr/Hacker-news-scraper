const express = require('express');
const cors = require('cors');
const getStories = require('../controllers/getstories'); // CommonJS import

const router = express.Router();

router.get("/getstories", getStories);

module.exports = router; // Correct export
