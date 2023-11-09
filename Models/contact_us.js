const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const contactusSchema = new mongoose.Schema({ 
    subject: { type: String, required: true },               //password is required for login
    message: { type: String,required: true},       
    user_id:{ type: Schema.Types.ObjectId,ref: 'users',required:true }           //first name 
}, { timestamps: true});

module.exports = mongoose.model("contactus", contactusSchema);


