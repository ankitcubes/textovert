const express = require('express');
const router = express.Router();
const {contactUs,getAllcontactUs} = require('../Controllers/contactusController');
const { protect } = require('../Middlewares/auth');



//contact us
router.post('/:id', protect,contactUs);
// router.post()
// router.route('/contactus/:id').post(contactUs);

//contact us
router.get('/getallcontactus', protect,getAllcontactUs);


module.exports = router;