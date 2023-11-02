const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ankitmalaviya13@gmail.com",
    pass: "unkpzartkojbhdtd",
  },
});

// Function to send the reset password email
function    sendResetPasswordEmail(email, otp, verification, req) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  console.log(baseUrl);
  const mailOptions = {
    from: "ankitmalaviya13@gmail.com",
    to: email,
    subject: "email confirmation OTP",
    html: `
              <html>
                <head>
                  <style>
                    /* Add your CSS styles here for formatting the email */
                    body {
                      font-family: Arial, sans-serif;
                    }
                    .container {  
                      padding: 20px;
                      background-color: #f2f2f2;
                    }
                    .otp {
                      font-size: 24px;
                      font-weight: bold;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>Email confirmation</h1>
                    <img src="${baseUrl}/emailpic.png" alt="Email Confirmation Image" width="100" height="100" style="display: block; margin: 0 auto; max-width: 100%;">   
                    <p>You've requested an account. Please use the following OTP to ${verification}:</p>
                    <p class="otp">${otp}</p>
                    
                    <p>If you didn't request this, please ignore this email.</p>
                  </div>
                </body>
              </html>
            `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
      //    return info.response;
    }
  });
}

module.exports = sendResetPasswordEmail;
