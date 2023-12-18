const express = require('express');
const router = express.Router();
const { registerUser,verifyEmail,resendOTP,loginUser,forgetpass,users,changepass,resetpass,getUserProfile,updateUserProfile,deleteUserProfile,thirdpartyUser,logout} = require('../Controllers/userController');
const { protect } = require('../Middlewares/auth');



//register user
router.route('/register').post(registerUser);
//register user
router.route('/users').post(users);

//thirdparty user
router.route('/thirdparty').post(thirdpartyUser);

//verify email
router.route('/verifyemail/:id').post(verifyEmail);

//resend otp
router.route('/resendotp/:id').post(resendOTP);

//login
router.route('/login').post(loginUser);

//forgot password
router.route('/forgetpassword').post(forgetpass)
// //verfiy otp for forget password
// router.route('/changepass/:id').post(changepass);
//verfiy otp for forget password
// router.route('/changepass/:id').post(changepass);
router.post('/changepass', protect, changepass);
router.post('/resetpass/:id',  resetpass);

//get user profile
router.get('/profile', protect,getUserProfile);

//update user profile
router.put('/updateprofile', protect, updateUserProfile);

//Delete user profile
router.delete('/deleteprofile',protect,deleteUserProfile);  


//Delete user profile
router.delete('/logout',protect,logout);  
module.exports = router;