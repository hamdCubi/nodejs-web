
const express = require('express');
const router = express.Router();


const { getKeywords } = require('../controllers/openAIController');
const { WEBHOOKLINKEXT } = require('../controllers/topy');
const { WEEBHOOKCSVGENRATE } = require('../controllers/blogCSVController');
router.post('/getextractLink', WEBHOOKLINKEXT);
router.post('/saveCSVfile', WEEBHOOKCSVGENRATE);

module.exports = router;