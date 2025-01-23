// app/api/auth/forgot-password/route.ts

import { NextResponse } from 'next/server';
import { sendOTPEmail } from '../../../utils/nodemailer';  // Helper to send OTP email
import { generateOTP } from '../../../utils/otpUtils';     // Helper for OTP generation
import { OTP_STORE } from '../../../utils/otpStore';       // Storage for OTP
import { getUserByEmail } from '../../../../sanity/lib/client';

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

  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to process request' 
    }, { status: 500 });
  }
}
