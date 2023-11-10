const asyncHandler = require("express-async-handler");
const Schedule = require("../Models/schedule");
const moment = require("moment");

const createSchedule = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  console.log(userid);
  const {
    email,
    message,
    label,
    phone,
    country_code,
    message_type,
    time,
    repeat,
    iso_code,
    dateList,
  } = req.body;

  if (!message || !label || !message_type || !time || !dateList) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all fields",
    });
  }

  const datelist = dateList.toString().split(",");
  const date = [];
  const utcdate = [];
  var utctime;
  datelist.forEach((element) => {
    const localDate = new Date(element + "T" + time);
    const utcDate = new Date(localDate.toUTCString());
    console.log(utcDate);
    date.push(element);
    utcdate.push(moment.utc(utcDate).format("YYYY-MM-DD"));
    utctime = moment.utc(utcDate).format("HH:mm:ss");
  });

console.log(utcdate);
console.log(utctime);

  const nextdate = utcdate[0];
  const schedule = await Schedule.create({
    email,
    message,
    label,
    phone,
    country_code,
    message_type,
    time,
    repeat,
    date,
    nextdate,
    iso_code,
    utctime,
    utcdate,
    userid,
  });

  return res.status(200).json({
    Status: 1,
    Message: "create schedule",
    info: schedule,
  });
});

const getAllSchedule = asyncHandler(async (req, res) => {
  const schedules = await Schedule.find({ userid: req.user._id }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    Status: 1,
    Message: "create schedule",
    info: schedules,
  });
});
const getAllSchedulebyId = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);

  return res.status(200).json({
    Status: 1,
    Message: "create schedule",
    info: schedule,
  });
});
const updateSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return res.status(200).json({
      Status: 0,
      Message: "schedule not found",
    });
  }

  const {
    email,
    message,
    label,
    phone,
    country_code,
    message_type,
    time,
    repeat,
    iso_code,
    dateList,
  } = req.body;


 
  const date = [];
  const utcdate = [];
  var utctime;
  if (dateList) {
    const datelist = dateList.split(",");
    datelist.forEach((element) => {
      const localDate = new Date(element + "T" + time);
      const utcDate = new Date(localDate.toUTCString());
      utctime = moment.utc(utcDate).format("HH:mm:ss").toString();
      date.push(element);
      utcdate.push(moment.utc(utcDate).format("YYYY-MM-DD"));
    });
    
    // datelist.forEach((element) => {
    //   date.push(element);
    // });
    // console.log(date);
  }




  const nextdate = utcdate[0];

  schedule.email = email || schedule.fname;
  schedule.message = message || schedule.message;
  schedule.iso_code = iso_code || schedule.iso_code;
  schedule.label = label || schedule.label;
  schedule.phone = phone || schedule.phone;
  schedule.country_code = country_code || schedule.country_code;
  schedule.message_type = message_type || schedule.message_type;
  schedule.time = time || schedule.time;
  schedule.repeat = repeat || schedule.repeat;
  schedule.nextdate = date[0] || schedule.nextdate;
  schedule.date = date || schedule.date;
  schedule.utcdate = utcdate || schedule.utcdate;
  schedule.utctime = utctime || schedule.utctime;

  schedule.save();

  return res.status(200).json({
    Status: 1,
    Message: "update Schedule successfully",
    info: schedule,
  });
});
const deleteSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);
  if (schedule) {
    await Schedule.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ Status: 1, Message: "Schedule deleted successfully" });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "No Schedule found",
    });
  }
});

const adddate = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { datelist, time } = req.body;
  const date = [];
  var newtime = " ";

  const newdate = await moment.utc("2023-11-10 01:00:00").format("YYYY-MM-DD HH:mm:ss");
  date.push(newdate);
  // var start = new Date("2023-11-10 01:00:00");

  // var now_utc = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(),
  // start.getUTCDate(), start.getUTCHours(),
  // start.getUTCMinutes(), start.getUTCSeconds());

  // Create a date and time in a specific time zone (local time)
  // Replace this with your local date and time

  // Convert the local date to UTC date
  // const localDate = new Date('T12:30:00');
  // const utcDate = new Date(localDate.toUTCString());

  datelist.split(",").forEach((element) => {
    const localDate = new Date(element + "T" + time);

    const utcDate = new Date(localDate.toUTCString());
date.push(utcDate);
    // date.push(moment.utc(utcDate).format("YYYY-MM-DD"));
    // newtime = moment.utc(utcDate).format("HH:mm:ss");

  });

  return res.status(200).json({
    Status: 0,
    Message: "date List",
    date: date,
    time: newtime,
    // date:newdate.toISOString(),
    // now_utc:utcDate,
    // date: Date(),
  });
});

module.exports = {
  createSchedule,
  getAllSchedule,
  updateSchedule,
  deleteSchedule,
  getAllSchedulebyId,
  adddate,
};
