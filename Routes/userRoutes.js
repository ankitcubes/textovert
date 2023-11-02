const express = require('express');
const router = express.Router();
const { registerUser,verifyEmail,resendOTP,loginUser,forgetpass,changepass,getUserProfile,updateUserProfile,deleteUserProfile} = require('../Controllers/userController');
const { protect } = require('../Middlewares/auth.js');



//register user
router.route('/register').post(registerUser);

//verify email
router.route('/verifyemail/:id').post(verifyEmail);

//resend otp
router.route('/resendotp/:id').post(resendOTP);

//login
router.route('/login').post(loginUser);

//forgot password
router.route('/forgetpassword').post(forgetpass)
//verfiy otp for forget password
router.route('/changepass/:id').post(changepass);

//get user profile
router.get('/profile', protect,getUserProfile);

//update user profile
router.put('/updateprofile', protect, updateUserProfile);

//Delete user profile
router.delete('/deleteprofile',protect,deleteUserProfile);  



module.exports = router;