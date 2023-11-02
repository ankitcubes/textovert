const Contactus = require("../Models/contact_us");
const asyncHandler = require("express-async-handler");
const User = require("../Models/user");

const contactUs = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  const user_id = req.params.id;
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  Contactus.user_id = req.params.id;
  Contactus.subject = subject;
  Contactus.message = message;
  Contactus.create({
    user_id,
    subject,
    message,
  });

  if (Contactus) {
    //    const contact = Contactus.fin
    return res.status(200).json({
      Status: 1,
      Message: "message send successfully",
      info: Contactus._id,
    });
  } else {
    return res.status(200).json({ error: "Invaild user data" });
  }
});

const getAllcontactUs = asyncHandler(async (req, res) => {

  const contactus =await Contactus.find();

  if (contactus) {
    return res.status(200).json({
      Status: 1,
      Message: "message send successfully",
      info: contactus,
    });
  } else {
    return res.status(200).json({ error: "Invaild user data" });
  }
});
module.exports = { contactUs, getAllcontactUs };
