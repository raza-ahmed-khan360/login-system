// app/api/auth/forgot-password/route.ts

import { NextResponse } from 'next/server';
import { sendOTPEmail } from '@/app/utils/nodemailer';  // Correct path
import { generateOTP } from '@/app/utils/otpUtils';     // Correct path
import { OTP_STORE } from '@/app/utils/otpStore';       // Correct path
import { getUserByEmail } from '@/sanity/lib/client';   // Correct path

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'No account found with this email' 
      }, { status: 404 });
    }

    // Generate and send OTP
    const generatedOtp = generateOTP();
    await sendOTPEmail(
      email,
      'RESET',  // emailType for password reset
      user._id,  // userId from the found user
      generatedOtp
    );

    // Store OTP with expiration
    OTP_STORE[email] = {
      otp: generatedOtp,
      expiresAt: Date.now() + 300000 // 5 minutes
    };

    return NextResponse.json({ 
      success: true,
      message: 'OTP sent successfully' 
    });

  } catch (error: unknown) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to process request' 
    }, { status: 500 });
  }
}
