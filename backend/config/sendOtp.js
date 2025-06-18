const nodemailer = require("nodemailer");
const dotenv = require('dotenv')

dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from:process.env.EMAIL,
    to: email,
    subject: "OTP Verification - MyApp",
    html: `<h2>Your OTP is: <b>${otp}</b></h2>`
  });
};

module.exports = sendOTP;
