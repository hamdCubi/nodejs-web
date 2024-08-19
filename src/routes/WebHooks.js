
const express = require('express');
const router = express.Router();


const { getKeywords } = require('../controllers/openAIController');
const { WEBHOOKLINKEXT } = require('../controllers/topy');
router.post('/getextractLink', WEBHOOKLINKEXT);

module.exports = router;