const express = require('express');
const router = express.Router();
const authMiddleware= require("../middleware/AuthMiddleware")

const { validate } = require('../utils/Common');
const { body } = require('express-validator');

const { joinUser, addUser, CheckLogin, logout } = require('../controllers/AuthController');

router.post('/login', joinUser);
router.post('/logout',authMiddleware(true), logout);
router.post('/add-new',authMiddleware(true), addUser);
router.get('/tokenStatus', CheckLogin);

module.exports = router;