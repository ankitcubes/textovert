const mongoose = require("mongoose");


const contactusSchema = new mongoose.Schema({ 
    user_id: { type: String, required: true, },    //email is unique //email is required for login
    subject: { type: String, required: true },               //password is required for login
    message: { type: String,required: true},                  //first name 
}, { timestamps: true});

module.exports = mongoose.model("contactus", contactusSchema);


