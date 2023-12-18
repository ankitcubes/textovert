const express = require('express');
const router = express.Router();
const {getSchedule, createSchedule,getAllSchedule,updateSchedule,deleteSchedule,getAllSchedulebyId,adddate} = require('../Controllers/scheduleController');


const { protect } = require('../Middlewares/auth');


//get user profile
router.post('/createschedule', protect, createSchedule);



//get user profile
router.get('/getallschedule', protect,getAllSchedule);
//get user profile
router.get('/getSchedule', protect,getSchedule);

//get user profile
router.get('/adddate',adddate);

//update user profile
router.put('/updateschedule/:id', protect,updateSchedule);

//getAllSchedulebyId profile
router.get('/getschedulebyid/:id', protect,getAllSchedulebyId);

//Delete user profile
router.delete('/deleteschedule/:id',protect,deleteSchedule);  

0


module.exports = router;