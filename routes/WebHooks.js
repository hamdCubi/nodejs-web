
const express = require('express');
const router = express.Router();


const { getKeywords } = require('../controllers/openAIController');
const { WEBHOOKLINKEXT } = require('../controllers/topy');
const { WEEBHOOKCSVGENRATE } = require('../controllers/blogCSVController');
const { SimilarWEBHOOK } = require('../controllers/similarContentController');
const { WebHooksUnique } = require('../controllers/uniqueContentController');
router.post('/getextractLink', WEBHOOKLINKEXT);
router.post('/saveCSVfile', WEEBHOOKCSVGENRATE);
router.post('/similarContent', SimilarWEBHOOK);
router.post('/comparison', WebHooksUnique);

module.exports = router;