const asyncHandler = require("express-async-handler");
const Schedule = require("../Models/schedule");
const moment = require("moment");
const Device = require("../Models/device");
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
    utctime,
    utcdateList,
  } = req.body;

  if (!message || !label || !message_type || !time || !dateList) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all fields",
    });
  }

  // const datelist = dateList.toString().split(",");
  const date = dateList.toString().split(",");
  const utcdate = utcdateList.toString().split(",");
  // const date = [];
  // const utcdate = [];
  // var utctime;
  // datelist.forEach((element) => {
  //   const localDate = new Date(element + "T" + time);
  //   const utcDate = new Date(localDate.toUTCString());
  //   console.log(utcDate);
  //   date.push(element);
  //   utcdate.push(moment.utc(utcDate).format("YYYY-MM-DD"));
  //   utctime = moment.utc(utcDate).format("HH:mm:ss");
  // });

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
    utctime,
    utcdateList,
  } = req.body;

  const date = dateList.toString().split(",");
  const utcdate = utcdateList.toString().split(",");
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
  // console.log(req.body);
  const { datelist, time } = req.body;

  // Create a date and time in a specific time zone (local time)
  const localDate = new Date("2023-11-10T12:00:00"); // Replace this with your local date and time

  // Convert the local date to UTC date
  const utcDate = new Date(localDate.toISOString());
  const date = Date();

  // console.log("Local Date and Time:", localDate);
  // console.log("UTC Date and Time:", utcDate);
  console.log("UTC Date and Time:", date);

  return res.status(200).json({
    Status: 0,
    Message: "date List",
    // date: date,
    // utcDate: utcDate,

    // localDate:localDate,
    date: date,

    // time: newtime,
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
const getSchedule = asyncHandler(async (req, res) => {
  const date = new Date();
  const fdate = moment(date).format("YYYY-MM-DD");
  const ftime = moment(date).format("HH:mm");

  console.log(fdate);
  console.log(ftime);
  const schedules = await Schedule.find({ userid: req.user._id }).sort({
    createdAt: -1,
  });
  const devices = await Device.find().sort({
    createdAt: -1,
  });

  // const device = await Device.findOne({deviceId:"ec38a33901af6b87"});
  const device = await Device.find({ userid: "656f171903ccba3aa9c283c2" });
  return res.status(200).json({
    Status: 1,
    Message: "create schedule",
    fdate: fdate,
    ftime: ftime,
    ftime1: moment(date).format("HH:mm"),
    ftime2: moment(date).format("HH:mm:ss"),
    info: schedules,
    devices: devices,
    device: device,
  });
});
module.exports = {
  createSchedule,
  getAllSchedule,
  updateSchedule,
  deleteSchedule,
  getAllSchedulebyId,
  adddate,
  getSchedule,
};
