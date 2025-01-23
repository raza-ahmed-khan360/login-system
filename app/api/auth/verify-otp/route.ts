// app/api/auth/verify-otp/route.ts

import { NextResponse } from 'next/server';
import { OTP_STORE } from '../../../utils/otpStore'; // Storage for OTP

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const storedOtp = OTP_STORE[email];

    if (!storedOtp) {
      return NextResponse.json({ error: 'OTP has not been requested or expired' }, { status: 400 });
    }

    if (storedOtp.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (Date.now() > storedOtp.expiresAt) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // OTP is valid, so proceed
    // Proceed to password creation or next step in signup process
    return NextResponse.json({ message: 'OTP verified successfully' });

  } catch (error) {
    console.error('OTP Verification API Error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
