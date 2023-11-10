
const asyncHandler = require("express-async-handler");
const Schedule = require("../Models/schedule");
const moment = require("moment");

const accountSid = 'AC90e2c0c178d0d747bced0e65cd2d8305';
const authToken = '051115c2cfa8fa08324ad73988f8f348';


async function messagesend(textmessage, phone)  {
const client = require('twilio')(accountSid, authToken);


await client.messages
  .create({
    body: textmessage,
    to: phone, // Text your number
    from: '+13526783833', // From a valid Twilio number

  }).then((message) =>handlemessage(message) );

function handlemessage(message){

console.log(message);
console.log("message send successfully");


// if(!message){
//     return res.status(200).json({
//     Status: 1,
//     Message: "message send successfully",
//   });
// }else{
//     return res.status(200).json({
//         Status: 0,
//         Message: "message send successfully",
//       });
//   }
    
}
};

const sendMessage = asyncHandler(async (req, res) => {
  const date = new Date();
 const fdate =  moment(date).format('YYYY-MM-DD');


const schedules = await Schedule.find({nextdate:fdate }).sort({
  createdAt: -1,
});

if(schedules){
  schedules.forEach((element) => {
    const textmessage = element.message;
    const phone = element.country_code+element.phone;
   messagesend(textmessage, phone);
  });

 return res.status(200).json({
  Status: 1,
  Message: "message send successfully",
  schedules:schedules,
});
}



    // return res.status(200).json({
    //     Status: 0,
    //     Message: "message send successfully",
    //     schedules:schedules,
    //   });

});


const sendMessageonTime = asyncHandler(async (req, res) => {
  console.log("send message on time called");
  const date = new Date();
 const fdate =  moment(date).format('YYYY-MM-DD');
 const ftime =  moment(date).format('HH:mm:ss');

 console.log(fdate);
 console.log(ftime);

const schedules = await Schedule.find().sort({
  createdAt: -1,
});
console.log(schedules);
if(schedules){
  schedules.forEach((element) => {
    const textmessage = element.message;
    const phone = element.country_code+element.phone;
   messagesend(textmessage, phone);
  });

 return res.status(200).json({
  Status: 1,
  Message: "message send successfully",
  schedules:schedules,
});
}



    // return res.status(200).json({
    //     Status: 0,
    //     Message: "message send successfully",
    //     schedules:schedules,
    //   });

});
module.exports = {
    sendMessage,
    sendMessageonTime
  };
  