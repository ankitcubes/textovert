const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const scheduleSchema = new mongoose.Schema({ 
    planid: { type: String,required:true}, 
    price: { type: String,required:true},   
    transcationsreceipt: { type: String,required:true },                  
    enddate: { type: String,required:true },          
    userid:{ type: Schema.Types.ObjectId,ref: 'users',required:true }
}, { timestamps: true});

module.exports = mongoose.model("subscriptions", scheduleSchema);


