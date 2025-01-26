// app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { sendOTPEmail } from '../../../utils/nodemailer';
import { generateOTP } from '../../../utils/otpUtils';
import { OTP_STORE } from '../../../utils/otpStore';
import { createUser, getUserByEmail } from '../../../../sanity/lib/client';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, otp, password } = await req.json();

    if (!otp) {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
      }

      const generatedOtp = generateOTP();
      await sendOTPEmail(email, 'VERIFY', email, generatedOtp);
      OTP_STORE[email] = { otp: generatedOtp, expiresAt: Date.now() + 300000 };

      return NextResponse.json({ success: true, message: 'OTP sent to your email' });
    }

    const storedOtp = OTP_STORE[email];
    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await createUser(email, hashedPassword);
      delete OTP_STORE[email];

      return NextResponse.json({ success: true, message: 'Signup successful' });
    }

    return NextResponse.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
