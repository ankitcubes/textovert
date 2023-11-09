const express = require('express');
const router = express.Router();
const { createSchedule,getAllSchedule,updateSchedule,deleteSchedule,getAllSchedulebyId} = require('../Controllers/scheduleController');


const { protect } = require('../Middlewares/auth');


//get user profile
router.post('/createschedule', protect, createSchedule);



//get user profile
router.get('/getallschedule', protect,getAllSchedule);

//update user profile
router.put('/updateschedule/:id', protect,updateSchedule);

//getAllSchedulebyId profile
router.get('/getschedulebyid/:id', protect,getAllSchedulebyId);

//Delete user profile
router.delete('/deleteschedule/:id',protect,deleteSchedule);  

0


module.exports = router;