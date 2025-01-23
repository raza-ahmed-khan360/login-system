import { NextResponse } from 'next/server';
import { OTP_STORE } from '@/app/utils/otpStore';
import { getUserByEmail, updateUserPassword } from '@/sanity/lib/client';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    // Verify OTP again for security
    const storedOtp = OTP_STORE[email];
    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid or expired OTP' 
      }, { status: 400 });
    }

    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in Sanity
    await updateUserPassword(user._id, hashedPassword);

    // Clear OTP
    delete OTP_STORE[email];

    return NextResponse.json({ 
      success: true,
      message: 'Password reset successful' 
    });

  } catch (error) {
    console.error('Password Reset Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to reset password' 
    }, { status: 500 });
  }
} 