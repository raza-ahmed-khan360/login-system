import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const protectedPaths = ['/dashboard', '/profile', '/settings'];
const authOnlyPaths = ['/login', '/signup', '/forgot-password'];
const publicPaths = ['/api', '/_next', '/favicon.ico', '/images', '/assets', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = token ? verifyToken(token) : false;

  if (isAuthenticated) {
    if (authOnlyPaths.some(path => pathname === path)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (protectedPaths.some(path => pathname === path)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};