const asyncHandler = require('express-async-handler');
const Device = require('../Models/device');

const deviceAddUpdate = asyncHandler(async (req, res) => {
    console.log(req);
    const{devicetoken,deviceId,type, userid} = req;

// const device =await Device.find({deviceId:deviceId});
const device = await Device.findOne({deviceId:deviceId});
console.log("Fdsfksjdflsdkjl");
console.log(device);
if(device){
    console.log("Fdsfksjdflsdkjl");
device.devicetoken = devicetoken;
device.type = type;
device.userid = userid;
await device.save();
//  device.save();

return {status: true,response:device};
}else{
const newdevice =await Device.create({
    devicetoken:devicetoken,
    deviceId:deviceId,
    type:type,
    userid:userid,
});
if(newdevice){
    return {status: true,response:newdevice};
}else{
    return {status: false,response:newdevice};
}

}





});


module.exports= {deviceAddUpdate};