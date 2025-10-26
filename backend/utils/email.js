// backend/utils/email.js
require('dotenv').config(); // ensure dotenv is loaded
const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS set?', process.env.EMAIL_PASS ? true : false);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 16-char Gmail App Password
  },
  tls: { rejectUnauthorized: false }, // dev only
});

transporter.verify((err, success) => {
  if (err) console.error('❌ Email transporter failed:', err);
  else console.log('✅ Email transporter ready');
});

async function sendBookingConfirmation(to, subject, text, html, attachments) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
      attachments,
    });
    console.log('Booking confirmation sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Error sending booking confirmation:', err);
    throw err;
  }
}

// Send OTP email
async function sendOTP(to, otp) {
  const subject = 'Your OTP for Password Reset';
  const text = `Your OTP for password reset is: ${otp}`;
  const html = `<p>Your OTP for password reset is: <b>${otp}</b></p>`;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log('OTP email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Error sending OTP email:', err);
    throw err;
  }
}

// Send signup confirmation email
async function sendSignupConfirmation(to, name) {
  const subject = 'Welcome to Event Management System!';
  const text = `Hi ${name},\n\nThank you for signing up! Your account has been created successfully.\n\nYou can now log in to your account and start booking events.\n\nBest regards,\nEvent Management Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Welcome to Event Management System!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for signing up! Your account has been created successfully.</p>
      <p>You can now log in to your account and start booking events.</p>
      <br>
      <p>Best regards,<br>Event Management Team</p>
    </div>
  `;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log('Signup confirmation email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Error sending signup confirmation email:', err);
    throw err;
  }
}

module.exports = { sendBookingConfirmation, sendOTP, sendSignupConfirmation };
