import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ 
        success: false,
        error: 'Token is required' 
      }, { status: 400 });
    }

    const response = NextResponse.json({ 
      success: true,
      message: 'Auth token set successfully' 
    });

    // Set the auth token cookie
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
  } catch (error) {
    console.error('Set token error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to set auth token' 
    }, { status: 500 });
  }
} 