// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { getUserByEmail } from '../../../../sanity/lib/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ 
        success: false,
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({  
        success: false,
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create response and set cookie
    const response = NextResponse.redirect('/dashboard'); // Redirect to dashboard
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error: unknown) {
    console.error('Login API Error:', error);
    return NextResponse.json({ 
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred'
    }, { status: 500 });
  }
}
