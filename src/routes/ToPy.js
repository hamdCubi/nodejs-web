
const express = require('express');
const router = express.Router();
const authMiddleware= require("../middleware/AuthMiddleware")

const { getKeywords } = require('../controllers/openAIController');
const { toextractlink, togetcsv, togetunqiue, togetsimilar } = require('../controllers/topy');
router.post('/getextractLink',authMiddleware(true), toextractlink);
router.get('/getcsvLink',authMiddleware(true), togetcsv);
router.get('/getsimilar',authMiddleware(true), togetsimilar);
module.exports = router;