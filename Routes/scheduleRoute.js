const express = require('express');
const router = express.Router();
const { createSchedule,getAllSchedule,updateSchedule,deleteSchedule} = require('../Controllers/scheduleController');
const { protect } = require('../middlewares/auth');


//get user profile
router.post('/createschedule', protect, createSchedule);



//get user profile
router.get('/getallschedule', protect,getAllSchedule);

//update user profile
router.put('/updateschedule/:id', protect,updateSchedule);

//Delete user profile
router.delete('/deleteschedule',protect,deleteSchedule);  

0


module.exports = router;