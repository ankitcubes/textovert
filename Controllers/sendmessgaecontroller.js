
const asyncHandler = require("express-async-handler");
const accountSid = 'AC20b30839d62ac8ab11e85f75e45a62fb';
const authToken = 'e6cee17aab2d5875247be4030771821e';

const sendMessage = asyncHandler(async (req, res) => {
  


const client = require('twilio')(accountSid, authToken);


await client.messages
  .create({
    body: 'Hello from twilio-node',
    to: '+918160812811', // Text your number
    from: '+12296291794', // From a valid Twilio number
  }).then((message) =>handlemessage(message) );

function handlemessage(message){

console.log(message);
if(!message){
    return res.status(200).json({
    Status: 1,
    Message: "message send successfully",
  });
}else{
    return res.status(200).json({
        Status: 0,
        Message: "message send successfully",
      });
  }
    // return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}




});
module.exports = {
    sendMessage
  };
  