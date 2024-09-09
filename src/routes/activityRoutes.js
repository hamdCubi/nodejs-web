const express = require('express');
const router = express.Router();
const authMiddleware= require("../middleware/AuthMiddleware");
const { getLinkActivitiesPending } = require('../controllers/ActivityController');

router.get('/get-pending-links',authMiddleware(true), getLinkActivitiesPending);


module.exports = router;