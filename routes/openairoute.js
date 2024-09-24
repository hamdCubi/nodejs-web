
const express = require('express');
const router = express.Router();
const authMiddleware= require("../middleware/AuthMiddleware")

const { getKeywords, getGenratedKeywords } = require('../controllers/openAIController');
router.post('/getKeywords',authMiddleware(true), getKeywords);
router.get('/genrated-content',authMiddleware(true), getGenratedKeywords);
module.exports = router;