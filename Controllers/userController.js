const asyncHandler = require("express-async-handler");
const User = require("../Models/user");
const sendResetPasswordEmail = require("../Middlewares/sendmail.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../Middlewares/generateToken");
const multer = require("multer");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(200).json({
      Status: 0,
      Message: "Email already used",
    });
  }
  console.log(req.body);
  console.log(userExists);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate a random 4-digit OTP
  const everification = "confirm your email";
  const otp = Math.floor(1000 + Math.random() * 9000);
  await sendResetPasswordEmail(email, otp, everification, req);

  const user = await User.create({
    email,
    password: hashedPassword,
    otp: otp,
  });

  if (user) {
    res.status(200).json({
      Status: 1,
      Message: "Otp sent to your email for verification",
      user_id: user._id,
      otp: user.otp,
    });
  } else {
    return res.status(200).json({ error: "Invaild user data" });
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    console.log(user);
    return res.status(200).json({
      Status: 0,

      Message: "Please Register first",
    });
  }

  const { otp, pass_req } = req.body;

  const exists = await User.findOne({ email: user.email, otp: otp });

  if (exists) {
    if (pass_req == 0) {
      user.emailverified = true;
      user.otp = null;
      await user.save();
      res.status(200).json({
        Status: 1,
        Message: "Registration successfully",
        info: user,
        UserToken: generateToken(user._id),
      });
    } else if (pass_req == 1) {
      user.emailverified = true;
      user.otp = null;
      res.status(200).json({
        Status: 1,
        Message: "OTP verified successfully",
      });
    } else {
      res.status(200).json({
        Status: 0,
        Message: "Please provide flag",
      });
    }
  } else {
    // await User.findByIdAndDelete(user._id);
    return res.status(200).json({
      Status: 0,
      Message: "Invaild OTP",
    });
  }
});
//resend otp
const resendOTP = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.params.id);
  const email = req.params.id;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "Email is not Registered",
    });
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  const verification = "confirm your email";
  // try{
  await sendResetPasswordEmail(email, otp, verification, req);

  user.otp = otp;
  user.emailverified = false;
  await user.save();

  res.status(200).json({
    Status: 1,
    Message: "OTP sent successfully",
    info: {
      // user_id: user._id,
      // first_name: user.fname,
      // last_name: user.lname,
      // email_id: user.email,
      // user_role: user.role,
      //  is_email_verified: user.emailverified,
      otp: otp,
    },
  });
  // }catch(e){
  //     return res.status(200).json(
  //         {
  //         Status:0,
  //         Message: 'Something went wrong try again',
  //         data:e
  //     }
  //     );
  // }
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }

  const user = await User.findOne({ email });
  if (!user || !user.emailverified) {
    if (!user) {
      return res.status(200).json({
        Status: 0,
        Message: "Email is not Registered Please register it first",
      });
    }
    if (!user.emailverified) {
      return res.status(200).json({
        Status: 2,
        Message: "Email is not verified.Please verify your email",
        user_id: user._id,
      });
    }
  }
  if (
    user &&
    (await bcrypt.compare(password, user.password)) &&
    user.emailverified
  ) {
    res.status(200).json({
      Status: 1,
      Message: "Login successful",
      info: {
        user_id: user._id,
        first_name: user.fname ?? "",
        last_name: user.lname ?? "",
        email_id: user.email,
        user_role: user.role,
        UserToken: generateToken(user._id),
      },
    });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "Invalid email or password or email not verified",
    });
  }
});

const forgetpass = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User is not Register",
    });
  }

  if(user.logintype != "email"){
    return res.status(200).json({
      Status: 0,
      Message: "You can not do forgot password for this email because you did login with different login tyoe",
    });
  }
  // Generate a reset token and set an expiration time
  const resetToken = Math.floor(1000 + Math.random() * 9000);
  // const resetExpires = Date.now() + 300000; // 5 min

  user.otp = resetToken;

  await user.save();
  await sendResetPasswordEmail(email, resetToken, "reset your password", req);
  res.status(200).json({
    Status: 1,
    Message: "otp sent successfully",
    user_id: user._id,
    otp: resetToken,
  });
});

const changepass = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User not found",
    });
  }
  const { oldpassword, newpassword} = req.body;
  if (!oldpassword || !newpassword) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all fields",
    });
  }
  // const {otp} = req.body;
  // console.log(otp);
  if (!(await bcrypt.compare(oldpassword, user.password))) {
    return res.status(200).json({
      Status: 0,
      Message: "Old password is not correct",
    });
  }

  if (await bcrypt.compare(newpassword, user.password)) {
    return res.status(200).json({
      Status: 0,
      Message: "New password and old password cannot be same",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newpassword, salt);

  user.password = hashedPassword;
  user.resettoken = null;
  user.resettokentime = null;
  await user.save();
  res.status(200).json({
    Status: 1,
    Message: "Change password successful",
  });
});

const resetpass = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // const {otp} = req.body;
  // console.log(otp);
  if (req.body.password) {
    const newpassword = req.body.password;

    // if (await bcrypt.compare(newpassword, user.password)) {
    //   return res.status(200).json({
    //     Status: 0,
    //     Message: "New password and old password cannot be same",
    //   });
    // }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);

    const exists = await User.findOne({ email: user.email });

    if (exists) {
      user.password = hashedPassword;
      user.resettoken = null;
      user.resettokentime = null;
      await user.save();
      res.status(200).json({
        Status: 1,
        Message: "Reset password successful",
        newpassword: user.password,
      });
    } else {
      return res.status(200).json({
        Status: 0,
        Message: "User not found",
      });
    }
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "All fields are mandatory",
    });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(200).json({
        Status: 0,
        Message: "User not found",
      });
    }

    if (!user.profilepic) {
      return res.status(200).json({
        Status: 0,
        Message: "Profile picture not found",
      });
    }

    const profilePicFilename = user.profilepic;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageurl = baseUrl + "/userprofiles/" + profilePicFilename;

    const { _id, fname, lname, email } = user;
    res.status(200).json({
      Status: 1,
      Message: "Profile fetched successfully",
      info: {
        user: user,
        privacy_policy: "https://www.google.com/",
        toc: "https://www.google.com/",
      },
    });
  } catch (error) {
    //   console.error(error);
    res.status(200).json({ Status: 0, Message: "Error in profile fetching" });
  }
});

const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/userprofiles"); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
  // limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
});

const updateUserProfile = asyncHandler(async (req, res) => {
  console.log(req.user._id);
  try {
    const user = await User.findById(req.user._id);
    console.log(user);
    if (!user) {
      return res.status(200).json({
        Status: 0,
        Message: "User not found",
      });
    }

    const previousProfilePic = user.profilepic;

    upload.single("profilepic")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(200)
          .json({ Status: 0, Message: "File upload error" });
      } else if (err) {
        return res.status(200).json({
          Status: 0,
          // error : err,
          Message: "Internal server error",
        });
      }

      if (req.file) {
        user.profilepic = req.file.filename;
        console.log(user.profilepic);
        if (
          previousProfilePic != null &&
          previousProfilePic != "generaluserpic.png"
        ) {
          const parentDirectory = path.dirname(__dirname);
          const previousImagePath = path.join(
            parentDirectory,
            "public/userprofiles",
            previousProfilePic
          );
          console.log(previousImagePath);
          // Check if the file exists before attempting to delete it
          fs.access(previousImagePath, fs.constants.F_OK, (err) => {
            if (err) {
              // File doesn't exist
              console.error(
                `Error deleting previous image: File does not exist`
              );
            } else {
              // File exists, attempt to delete it
              fs.unlink(previousImagePath, (err) => {
                if (err) {
                  console.error(`Error deleting previous image: ${err}`);
                } else {
                  console.log(`Previous image deleted successfully`);
                }
              });
            }
          });
        }
      }

      const { fname, lname, phone_number, country_code,ios_code } = req.body;
      user.fname = fname || user.fname;
      user.lname = lname || user.lname;
      user.phone = phone_number || user.phone;
      user.country_code = country_code || user.country_code;
      user.ios_code = ios_code || user.ios_code;

      await user.save();

      res.status(200).json({
        Status: 1,
        Message: "Updated successfully",
        info: {
          user_id: user._id,
          first_name: user.fname??"",
          last_name: user.lname??"",
          phone:user.phone??"",
          user_profile: user.profilepic || "generaluserpic.png",
          user: user,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({
      Status: 0,
      Message: "Something went wrong. Profile not updated",
      err:err
    });
  }
});

//delete user
const deleteUserProfile = asyncHandler(async (req, res) => {
  console.log(req.user.id);
  const user = await User.findById(req.user._id);
  if (user && user.emailverified) {
    await User.findByIdAndDelete(req.user._id);
    res
      .status(200)
      .json({ Status: 1, Message: "Your Account deleted successfully" });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "No User found or Login first",
    });
  }
});


//Thiredparty Api

const thirdpartyUser = asyncHandler(async (req, res) => {
  console.log("login_by_thirdparty api called", req.body);
  const { email, loginbythirdpartyid, logintype,fname,lname } = req.body;
  if (!email || !loginbythirdpartyid || !logintype) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  const user = await User.findOne({email:email});
  if(user){
    if (user.logintype != logintype){
      return res.status(200).json({
        Status: 0,
        Message: "this emial is already login with another login method",
      });
    }
  }
  const thirdpartyuser = await User.findOne({loginbythirdpartyid:loginbythirdpartyid, });

console.log(thirdpartyuser);
console.log(user);
  if (thirdpartyuser) {
   

    if (thirdpartyuser.logintype == logintype && thirdpartyuser.loginbythirdpartyid == loginbythirdpartyid) {
      console.log(thirdpartyuser.logintype);
      res.status(200).json({
        Status: 1,
        Message: "Login successful",
        info: {
          user_id: thirdpartyuser._id,
          fname: thirdpartyuser.fname ?? "",
          lname: thirdpartyuser.lname ?? "",
          email_id: thirdpartyuser.email,
          user_role: thirdpartyuser.role,
          issignup:0,
          UserToken: generateToken(thirdpartyuser._id),
        },
      });
    } else {


      return res.status(200).json({
        Status: 0,
        Message: "this emial is already login with another login method",
      });
    }
  } else {
   const emailverified = true;
    const newuser = await User.create({
      email,
     logintype,
     loginbythirdpartyid,
     emailverified,
     fname,
     lname,

    });
    console.log(newuser);
if(newuser){
  res.status(200).json({
    Status: 1,
    Message: "signup successful",
    info: {
      user_id: newuser._id,
      fname: newuser.fname ?? "",
      lname: newuser.lname ?? "",
      email_id: newuser.email,
      user_role: newuser.role,
      issignup:1,
      UserToken: generateToken(newuser._id),
    },
  });
}


  }


});


const users = asyncHandler(async (req, res) => {
  const users = await User.findOne({email: req.body.email});
  res.status(200).json({
    Status: 1,
    Message: "Login successful",
    info:users,
  });


});



module.exports = {
  registerUser,
  verifyEmail,
  resendOTP,
  loginUser,
  forgetpass,
  changepass,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  resetpass,
  thirdpartyUser,
  users
};

// exports.login_by_thirdparty = (req, result) => {
//   console.log("login_by_thirdparty api called", req.body);
//   var user_data = {};
//   const sign = {};
//   var body = {};
//   var email_id = req.body.email_id ? req.body.email_id : "";
//   db.query(
//     "Select * from tbl_users where thirdparty_id = ? OR email_id = ?",
//     [req.body.thirdparty_id, email_id],
//     (err, data) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       } else {
//         var token_data = {
//           device_token: req.body.device_token,
//           device_type: req.body.device_type,
//           device_id: req.body.device_id,
//         };
//         user_data.thirdparty_id = req.body.thirdparty_id;
//         user_data.is_email_verified = 1;
//         if (req.body.first_name) {
//           user_data.first_name = req.body.first_name;
//         }
//         if (req.body.username) {
//           user_data.username = req.body.username;
//         }
//         if (req.body.last_name) {
//           user_data.last_name = req.body.last_name;
//         }
//         if (req.body.email_id) {
//           user_data.email_id = req.body.email_id;
//         }
//         if (req.body.login_type) {
//           user_data.login_type = req.body.login_type;
//         }
//         if (data.length <= 0) {
//           console.log("sign up");
//           usersService.findByUsername(req.body.username, (err, res1) => {
//             if (err) {
//               console.log(err);
//             } else {
//               if (res1) {
//                 body.Status = 0;
//                 body.Message = "Username is already exists in our records";
//                 result(null, body);
//               } else {
//                 db.query(
//                   "INSERT INTO tbl_users SET ?",
//                   [user_data],
//                   (err, res3) => {
//                     if (err) {
//                       console.log("error", err);
//                       result(err, null);
//                       return;
//                     } else {
//                       token_data.user_id = res3.insertId;
//                       sign.sub = res3.insertId;
//                       usersService.manage_token(token_data, (err, res4) => {
//                         if (err) {
//                           console.log("error", err);
//                           result(err, null);
//                           return;
//                         } else {
//                           body.Status = 1;
//                           body.Message = "Registration successful";
//                           body.info = res4[0];
//                           body.UserToken = jwt.sign(sign, "dont_be_oversmart");
//                           result(null, body);
//                           return;
//                         }
//                       });
//                     }
//                   }
//                 );
//               }
//             }
//           });
//         } else {
//           if (data[0].is_block == 1) {
//             body.Status = 0;
//             body.Message =
//               "An account blocked with your email. Please contact to admin.";
//             result(null, body);
//             return;
//           } else if (data[0].is_delete == 1) {
//             body.Status = 0;
//             body.Message =
//               "An account deleted with your email. Please contact to admin.";
//             result(null, body);
//             return;
//           } else if (data[0].login_type != req.body.login_type) {
//             body.Status = 0;
//             body.Message = "You are login with another login method";
//             result(null, body);
//             return;
//           } else if (
//             req.body.email_id &&
//             data[0].email_id != null &&
//             data[0].email_id != req.body.email_id
//           ) {
//             body.Status = 0;
//             body.Message = "Please entre valid email";
//             result(null, body);
//             return;
//           } else {
//             db.query(
//               "UPDATE tbl_users SET ? WHERE user_id = ?",
//               [user_data, data[0].user_id],
//               (err, res1) => {
//                 if (err) {
//                   console.log("error", err);
//                   result(err, null);
//                   return;
//                 } else {
//                   token_data.user_id = data[0].user_id;
//                   sign.sub = data[0].user_id;
//                   usersService.manage_token(token_data, (err, res2) => {
//                     if (err) {
//                       console.log("error", err);
//                       result(err, null);
//                       return;
//                     } else {
//                       body.Status = 1;
//                       body.Message = "Login successful";
//                       body.info = res2[0];
//                       body.UserToken = jwt.sign(sign, "dont_be_oversmart");
//                       result(null, body);
//                       return;
//                     }
//                   });
//                 }
//               }
//             );
//           }
//         }
//       }
//     }
//   );
// };
