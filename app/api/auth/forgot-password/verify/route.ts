import { NextResponse } from 'next/server';
import { OTP_STORE } from '../../../../utils/otpStore';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const storedOtp = OTP_STORE[email];

    if (!storedOtp) {
      return NextResponse.json({ 
        success: false,
        error: 'OTP has expired or not requested' 
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

    return NextResponse.json({ 
      success: true,
      message: 'OTP verified successfully' 
    });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to verify OTP' 
    }, { status: 500 });
  }
} 
