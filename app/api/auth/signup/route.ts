// app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { sendOTPEmail } from '../../../utils/nodemailer';  // Helper to send OTP email
import { generateOTP } from '../../../utils/otpUtils';     // Helper for OTP generation
import { OTP_STORE } from '../../../utils/otpStore';       // Storage for OTP
import { createUser, getUserByEmail } from '../../../../sanity/lib/client';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, otp, password } = await req.json();

    // If OTP is not sent yet, check if user exists and send OTP
    if (!otp) {
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json({ 
          success: false,
          error: 'Email already registered' 
        }, { status: 400 });
      }

      try {
        const generatedOtp = generateOTP();
        await sendOTPEmail(
          email,
          'VERIFY',  // emailType for signup verification
          email,     // using email as temporary userId since user isn't created yet
          generatedOtp
        );

        // Store OTP and expiration time
        OTP_STORE[email] = { 
          otp: generatedOtp, 
          expiresAt: Date.now() + 300000  // 5 minutes expiry
        };
        
        return NextResponse.json({ 
          success: true,
          message: 'OTP sent to your email' 
        });
      } catch (error: any) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ 
          success: false,
          error: error.message || 'Failed to send OTP' 
        }, { status: 500 });
      }
    }

    // If OTP is entered, validate it
    const storedOtp = OTP_STORE[email];

    if (!storedOtp) {
      return NextResponse.json({ 
        success: false,
        error: 'OTP has not been requested or expired' 
      }, { status: 400 });
    }

    if (storedOtp.otp !== otp) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid OTP' 
      }, { status: 400 });
    }

    if (Date.now() > storedOtp.expiresAt) {
      delete OTP_STORE[email];
      return NextResponse.json({ 
        success: false,
        error: 'OTP has expired' 
      }, { status: 400 });
    }

    // If we have password, create the user in Sanity
    if (password) {
      try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in Sanity
        await createUser(email, hashedPassword);
        
        // Remove OTP from store after successful verification
        delete OTP_STORE[email];

        return NextResponse.json({ 
          success: true,
          message: 'Signup successful' 
        });
      } catch (error: any) {
        console.error('User creation error:', error);
        return NextResponse.json({ 
          success: false,
          error: 'Failed to create user account' 
        }, { status: 500 });
      }
    }

    // If we reach here, OTP is valid but no password yet
    return NextResponse.json({ 
      success: true,
      message: 'OTP verified successfully' 
    });

  } catch (error: any) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
