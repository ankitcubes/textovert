const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const scheduleSchema = new mongoose.Schema({ 
    email: { type: String,},    //email is unique //email is required for login            //password is required for login
    message: { type: String },                  //first name 
    label: { type: String },                  //last name
    phone: { type: String, },                  //phone number
    country_code: { type: String, },                  //phone number
    iso_code: { type: String, },                  //phone number
    message_type: { type: String, },    
    date: [],   
    nextdate:{ type: String, },
    time:  { type: String, },
    repeat:{ type: String, },
    userid:{ type: Schema.Types.ObjectId,ref: 'users',required:true }
                  //phone number
}, { timestamps: true});

module.exports = mongoose.model("schedules", scheduleSchema);


