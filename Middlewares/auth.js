const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../Models/user');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  // console.log(req.headers.authorization);
  if(req.headers.authorization){
    try {  
      console.log('token found');

        //get token from header
      token = req.headers.authorization;
      //verify token  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      //get user from db
      const user = await User.findById(decoded.id).select('emailverified');
    //   console.log(user);
      if(user.emailverified == true)
      req.user = await User.findById(decoded.id).select('-password');
    //   console.log(decoded);
    console.log(req.user);
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({error:'Not authorized, token failed'});
    }
  }
  if(!token){
    res.status(401).json({error:'Token is not found Please provide token'});
  }
});


module.exports= {protect};