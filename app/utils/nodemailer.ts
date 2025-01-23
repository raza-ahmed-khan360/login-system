// utils/nodemailer.ts

import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    // do not fail on invalid 
    rejectUnauthorized: false,
  },
});

// Verify connection configuration
transporter.verify(function (error) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

interface EmailResponse {
  success: boolean;
  message: string;
}

interface EmailError {
  code?: string;
  message: string;
  response?: unknown;
}

export const sendOTPEmail = async (
  email: string, 
  emailType: 'VERIFY' | 'RESET',
  userId: string,
  otp: string
): Promise<EmailResponse> => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Email configuration is missing');
  }

  const mailOptions = {
    from: `"OTP Verification" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: emailType === 'VERIFY' ? 'Your OTP for Signup' : 'Reset Password OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your One-Time Password</h2>
        <p>Here is your OTP for ${emailType === 'VERIFY' ? 'signup verification' : 'password reset'}:</p>
        <h1 style="font-size: 36px; background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 5px;">
          ${otp}
        </h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true, message: 'Email sent successfully' };
  } catch (error: unknown) {
    const emailError = error as EmailError;
    console.error('Email sending error:', {
      message: emailError.message || 'Unknown error',
      code: emailError.code,
      response: emailError.response,
    });
    
    if (emailError.code === 'EAUTH') {
      throw new Error('Invalid email credentials. Please check your email settings.');
    }
    
    throw new Error('Failed to send email. Please try again later.');
  }
};
