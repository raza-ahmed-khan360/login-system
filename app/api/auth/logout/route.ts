import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  }, {
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });

  // Clear the auth token cookie with all attributes
  response.cookies.delete({
    name: 'auth_token',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return response;
} 