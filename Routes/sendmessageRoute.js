const express = require('express');
const router = express.Router();
const {sendMessage} = require('../Controllers/sendmessgaecontroller');
const { protect } = require('../middlewares/auth');




router.route('/sendmessage').post(sendMessage);


module.exports = router;