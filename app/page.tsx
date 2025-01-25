'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { status } = useSession();
 
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    } else if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status, router]);
 
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Our Platform</h1>
          <p className="text-xl text-gray-600 mb-8">Please login or create an account to continue</p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
