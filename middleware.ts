import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Add paths that should be protected (require authentication)
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings'
];

// Add paths that are only for non-authenticated users
const authOnlyPaths = [
  '/login',
  '/signup',
  '/forgot-password'
];

// Add paths that should be public
const publicPaths = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/images',
  '/assets',
  '/' // Home page is public
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = token ? verifyToken(token) : false;

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname === path);
  const isAuthOnlyPath = authOnlyPaths.some(path => pathname === path);

  // If user is authenticated
  if (isAuthenticated) {
    // Redirect to home if trying to access auth-only pages
    if (isAuthOnlyPath) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // If user is not authenticated
  if (isProtectedPath) {
    // Redirect to login if trying to access protected pages
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 