require('dotenv').config();
const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./Database/connect.js');
const userRoutes = require('./Routes/userRoutes.js');
const contactusRoutes = require('./Routes/contactusRoute.js');
const scheduleRoutes = require('./Routes/scheduleRoute.js');
const sendmessageRoutes = require('./Routes/sendmessageRoute.js');
// const path = require('path');
// const inspectionRoutes = require('./Routes/inspectionRoutes');
// const observationRoutes = require('./Routes/observationRoutes');

// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// const User = require('./models/user');


const app = express();
const PORT = process.env.PORT || 8080;



// Middlewares
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => { res.send('Welcome To Textovert') ; res.end();});
app.use('/api', userRoutes);
app.use('/api/contactus', contactusRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/sendmessage', sendmessageRoutes);
// app.use('/api/admin', require('./Routes/adminRoutes'));



const start = async () => {
    console.log(process.env.MONGODB_URI);
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(PORT, () => { console.log(`Server is running on PORT ${PORT}`) });  
        } catch (error) {
            console.log(error);
        }
};


start();

// process.exit(1);