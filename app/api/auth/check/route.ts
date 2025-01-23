import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        error: 'No token found',
        message: 'Please log in to continue' 
      }, { 
        status: 401,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      
      if (!decoded || !decoded.email || !decoded.userId) {
        throw new Error('Invalid token data');
      }

      return NextResponse.json({ 
        authenticated: true,
        user: {
          email: decoded.email,
          userId: decoded.userId
        }
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
    } catch (error) {
      // If token verification fails, clear the invalid token
      const response = NextResponse.json({ 
        authenticated: false,
        error: 'Invalid token',
        message: 'Your session has expired. Please log in again'
      }, { 
        status: 401,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      response.cookies.delete('auth_token');
      return response;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: 'Server error',
      message: 'An error occurred while checking authentication'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  }
} 
