
const express = require('express');
const router = express.Router();
const authMiddleware= require("../middleware/AuthMiddleware")

const { getKeywords } = require('../controllers/openAIController');
const { main } = require('../controllers/googleAPI');
router.post('/getGoogleKeywords',main);
module.exports = router;