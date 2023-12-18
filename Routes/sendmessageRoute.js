const express = require('express');

const router = express.Router();
const {sendmessagetest,sendMessage,sendMessageonTime,checkdate} = require('../Controllers/sendmessgaecontroller');
const { protect } = require('../Middlewares/auth');




router.route('/sendmessage').get(sendMessage);
router.route('/sendMessageonTime').get(sendMessageonTime);
router.route('/checkdate').get(checkdate);
router.route('/sendmessagetest').get(sendmessagetest);


module.exports = router;