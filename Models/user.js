const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({ 
    email: { type: String, required: true, unique: true },    //email is unique //email is required for login
    password: { type: String, required: true },               //password is required for login
    fname: { type: String },                  //first name 
    lname: { type: String },                  //last name
    phone: { type: String, required: false },                  //phone number
    country_code: { type: String, required: false },                  //phone number
    profilepic: { type: String, required: false, default: "generaluserpic.png" },   //profile pic required is false because it is not mandatory and default is generaluserpic.png 
    emailverified: { type: Boolean, required: true , default: false},    //email is verified or not 
    role: { type: String, required: true , default: "user"},
    otp: { type: String, required: false },
    resettoken : {type:String, required: false, default: undefined},
    resettokentime : {type:String, required: false, default: undefined}, 
}, { timestamps: true});

module.exports = mongoose.model("users", userSchema);


