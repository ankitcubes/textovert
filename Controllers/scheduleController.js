const asyncHandler = require("express-async-handler");
const Schedule = require("../Models/schedule");

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
    dateList
  } = req.body;

  if (!message||!label||!message_type||!time||!dateList) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all fields",
    });
  }

  const datelist = dateList.split(",");
  const date = [];

  datelist.forEach((element) => {
    date.push(element);
  });

  console.log(date);


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
    iso_code,
    userid
  });

  return res.status(200).json({
    Status: 1,
    Message: "create schedule",
    info: schedule,
  });
});

const getAllSchedule = asyncHandler(async (req, res) => {
  const schedules = await Schedule.find({userid:req.user._id}).sort({ createdAt: -1 });

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
    dateList
  } = req.body;
  
  const date = [];
  
if(dateList){ 
   const datelist = dateList.split(",");
   console.log(datelist);
  datelist.forEach((element) => {
    date.push(element);
  });
  console.log(date);
}
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
  
module.exports = {
  createSchedule,
  getAllSchedule,
  updateSchedule,
  deleteSchedule,
  getAllSchedulebyId
};
