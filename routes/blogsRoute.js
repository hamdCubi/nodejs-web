const express = require('express');
const router = express.Router();
const authMiddleware= require("../middleware/AuthMiddleware")

const { addLinkFile, GetLinks } = require('../controllers/blogLinkController');
const { addCSVFile, GetCSV } = require('../controllers/blogCSVController');
const { addUniqueFile, getautoUnique } = require('../controllers/uniqueContentController');
const { addsimilarFile, getSimilarLogs } = require('../controllers/similarContentController');

router.post('/saveLinksFile',authMiddleware(true), addLinkFile);
router.post('/saveCSVfile',authMiddleware(true), addCSVFile);
router.post('/saveUniqueFile',authMiddleware(true), addUniqueFile);
router.post('/saveSimilarFile',authMiddleware(true), addsimilarFile);
router.get('/similarlogs',authMiddleware(true), getSimilarLogs);
router.get('/fetchLinks',authMiddleware(true), GetLinks);
router.get('/getautoUnique', getautoUnique);
router.get('/fetchCSV',authMiddleware(true), GetCSV);

module.exports = router;