const express = require('express');
const router = express.Router();
const {sendMessage,sendMessageonTime} = require('../Controllers/sendmessgaecontroller');
const { protect } = require('../Middlewares/auth');




router.route('/sendmessage').get(sendMessage);
router.route('/sendMessageonTime').get(sendMessageonTime);


module.exports = router;