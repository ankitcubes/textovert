const asyncHandler = require("express-async-handler");
const Schedule = require("../Models/schedule");
const moment = require("moment");
const { SendPushNotification } = require("../Middlewares/sendpush");
const accountSid = "ACc61bb1afd55deaba86740ce1e15b03b0";
const authToken = "1a236bb43d750dea0972a358525bfc8e";
var FCM = require("fcm-node");
const serverKey =
  "AAAAOHZH8w4:APA91bHCDhkmJ3EL6GofI5HcAoVrEvbqF5zREgqq8RlACPPurrDZdvhmKUhKmJ28Z2N7UA0DK6E0JyRUoDi93ry8ghP-QTEbFhIooRBV293SOAQbVAwVu7mL0KaCu9e3DQlTNEI0dylZ"; //put
const fcm = new FCM(serverKey);

async function messagesend(textmessage, phone) {
  const client = require("twilio")(accountSid, authToken);

  await client.messages
    .create({
      body: textmessage,
      to: phone, // Text your number
      from: "+18596059212", // From a valid Twilio number
    })
    .then((message) => handlemessage(message));

  function handlemessage(message) {
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
}

const sendMessage = asyncHandler(async (req, res) => {
  await messagesend("fdskhjk", "+918160812811");

  const date = new Date();
  const fdate = moment(date).format("YYYY-MM-DD");

  const schedules = await Schedule.find({ nextdate: fdate }).sort({
    createdAt: -1,
  });

  if (schedules) {
    schedules.forEach((element) => {
      const textmessage = element.message;
      const phone = element.country_code + element.phone;
    });

    return res.status(200).json({
      Status: 1,
      Message: "message send successfully",
      schedules: schedules,
    });
  }
});

const sendMessageonTime = asyncHandler(async (req, res) => {
  console.log("send message on time called");
  const date = new Date();
  const fdate = moment(date).format("YYYY-MM-DD");
  const ftime = moment(date).format("HH:mm");

  console.log(fdate);
  console.log(ftime);
  // time:ftime+":00",

  const schedules = await Schedule.find({
    nextdate: fdate,
    utctime: ftime,
    repeat: { $ne: "Never" },
  }).sort({
    createdAt: -1,
  });
  console.log(schedules);
  if (schedules) {
    schedules.forEach((element) => {
      const textmessage = element.message;
      const phone = element.country_code + element.phone;
      console.log(element.userid);
      var Data = {
        title: "TEXTOVERT",
        text: element.message,
        // notification_type: type,
      };
      //   if (info)
      //  {
      //     Data = { ...Data, ...info };
      //   }
      const message = {
        notification: {
          title: element.label,
          body: element.message,
          text: element.message,
          msg: element.message,
          sound: "default",
        },
        data: Data,
        ios_badgeType: "Increase",
        ios_badgeCount: 1,
      };
      SendPushNotification({ userId: element.userid, message: message });
      if (element.repeat == "Daily") {
        const originalDate = new Date(element.nextdate);

        // Add one day
        const nextDay = new Date(originalDate);
        nextDay.setDate(originalDate.getDate() + 1);

        console.log("Original Date:", originalDate.toISOString());
        console.log("Next Day:", nextDay.toISOString());
        element.nextdate = nextDay;
        element.save();
      }
      if (element.repeat == "weekly") {
        const originalDate = new Date(element.nextdate);

        // Add one day
        const nextDay = new Date(originalDate);
        nextDay.setDate(originalDate.getDate() + 7);

        console.log("Original Date:", originalDate.toISOString());
        console.log("Next Day:", nextDay.toISOString());
        element.nextdate = nextDay;
        element.save();
      }
      if (element.repeat == "Monthly") {
        const originalDate = new Date(element.nextdate);

        // Add one day
        const nextDay = new Date(originalDate);
        nextDay.setMonth(originalDate.getMonth() + 1);

        console.log("Original Date:", originalDate.toISOString());
        console.log("Next Day:", nextDay.toISOString());
        element.nextdate = nextDay;
        element.save();
      }
      if (element.repeat == "Annually") {
        const originalDate = new Date(element.nextdate);

        // Add one day
        const nextDay = new Date(originalDate);
        nextDay.setFullYear(originalDate.getFullYear() + 1);

        console.log("Original Date:", originalDate.toISOString());
        console.log("Next Day:", nextDay.toISOString());
        element.nextdate = nextDay;
        element.save();
      }
      if (element.repeat == "Custom") {

        var index = element.utctime.indexOf(element.nextdate);
        if(element.utctime.length>index+1){
          
          element.nextdate = element.utctime[index+1];
        }else{
          element.nextdate = "";

        }
        element.save();
      }
    });

    return res.status(200).json({
      Status: 1,
      Message: "message send successfully",
      schedules: schedules,
      fdate: fdate,
      time: ftime,
    });
  }
});

const checkdate = asyncHandler(async (req, res) => {
  //   const originalDate = new Date(req.body.date);
  //   const nextDay = new Date(originalDate);
  // nextDay.setDate(originalDate.getDate() + 1);

  // console.log("Original Date:", originalDate.toISOString());
  // console.log("Next Day:", nextDay.toISOString());
  // console.log(req.body);

  var date = new Date("2023-12-27");
  console.log(date);
  console.log(date.getMonth());
  date.setFullYear(date.getFullYear() + 1);
  console.log(date);
  // 2023-12-05T04:45:59.025Z
  // 2023-12-06T04:45:59.025Z
  return res.status(200).json({
    Status: 1,
    Message: "message send successfully",

    date: date,
  });
});
const sendmessagetest = asyncHandler(async (req, res) => {
  var Data = {
    title: "TEXTOVERT",
    text: req.body.message,
    // notification_type: type,
  };
  //   if (info)
  //  {
  //     Data = { ...Data, ...info };
  //   }
  const message = {
    notification: {
      title: "TEXTOVERT",
      body: req.body.message,
      text: req.body.message,
      msg: req.body.message,
      sound: "default",
    },
    data: Data,
    ios_badgeType: "Increase",
    ios_badgeCount: 1,
  };
  // var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
  //   to: 'dkWcH_NnQPWHCuY9F7-H8G:APA91bETwfDJ0H3DtiBxUmQccUJdQq8-nS0Q7DBBQ79GsggYpW2C-aKJMdkuuwCJ2FiAMlW5MyxCusGD-_jgJZ2CZY0oAjXg7t0U4J9RLbGnvtb5iMoJxnd0lrVQVx8znLWHpwKJ4Nrp',
  //   collapse_key: 'your_collapse_key',

  //   notification: {
  //       title: 'TEXTOVERT',
  //       body: req.body.message,
  //   },

  //   data: Data
  // };
  message["to"] =
    "dkWcH_NnQPWHCuY9F7-H8G:APA91bETwfDJ0H3DtiBxUmQccUJdQq8-nS0Q7DBBQ79GsggYpW2C-aKJMdkuuwCJ2FiAMlW5MyxCusGD-_jgJZ2CZY0oAjXg7t0U4J9RLbGnvtb5iMoJxnd0lrVQVx8znLWHpwKJ4Nrp";
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("something went wrong!");
      console.log(err);
      // return {status: false,response:err};
      return res.status(200).json({
        Status: 0,
        Message: "message send successfully",

        response: err,
      });
    } else {
      console.log(
        "Successfully sent user_id = " + user_id + " with response: ",
        response
      );
      return res.status(200).json({
        Status: 1,
        Message: "message send successfully",

        response: response,
      });
    }
  });
});
module.exports = {
  sendMessage,
  sendMessageonTime,
  checkdate,
  sendmessagetest,
};
