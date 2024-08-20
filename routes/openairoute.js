
const express = require('express');
const router = express.Router();
const authMiddleware= require("../middleware/AuthMiddleware")

const { getKeywords } = require('../controllers/openAIController');
router.post('/getKeywords',authMiddleware(true), getKeywords);
module.exports = router;