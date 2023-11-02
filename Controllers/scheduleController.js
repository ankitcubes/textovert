const asyncHandler = require("express-async-handler");
const Schedule = require("../Models/schedule");

const createSchedule = asyncHandler(async (req, res) => {
  const datelist = req.body.date.split(",");
  const date = [];

  datelist.forEach((element) => {
    date.push(element);
  });

  console.log(date);

  const {
    email,
    message,
    label,
    phone,
    country_code,
    message_type,
    time,
    repeat,
  } = req.body;
  const nextdate = date[0];
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
  });

  return res.status(200).json({
    Status: 1,
    Message: "create schedule",
    info: schedule,
  });
});

const getAllSchedule = asyncHandler(async (req, res) => {
  const schedules = await Schedule.find();

  return res.status(200).json({
    Status: 1,
    Message: "create schedule",
    info: schedules,
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
  const datelist = req.body.date.split(",");
  const date = [];

  datelist.forEach((element) => {
    date.push(element);
  });
  const {
    email,
    message,
    label,
    phone,
    country_code,
    message_type,
    time,
    repeat,
  } = req.body;
  schedule.email = email || schedule.fname;
  schedule.message = message || schedule.message;
  schedule.label = label || schedule.label;
  schedule.phone = phone || schedule.phone;
  schedule.country_code = country_code || schedule.country_code;
  schedule.message_type = message_type || schedule.message_type;
  schedule.time = time || schedule.time;
  schedule.repeat = repeat || schedule.repeat;
  schedule.nextdate = date[0] || schedule.nextdate;
  schedule.date = date[0] || schedule.date;
  schedule.save();

  return res.status(200).json({
    Status: 1,
    Message: "create schedule",
    info: schedule,
  });
});
const deleteSchedule = asyncHandler(async (req, res) => {
    console.log(req.user.id);
    const schedule = await Schedule.findById(req.user._id);
    if (!schedule) {
        await User.findByIdAndDelete(req.user._id);
        res
          .status(200)
          .json({ Status: 1, Message: "Schedule deleted successfully" });
      } else {
        return res.status(200).json({
          Status: 0,
          Message: "No Schedule found",
        });
      } 
    return res.status(200).json({
      Status: 1,
      Message: "create schedule",
      info: schedules,
    });
  });
  
module.exports = {
  createSchedule,
  getAllSchedule,
  updateSchedule,
  deleteSchedule,
};
