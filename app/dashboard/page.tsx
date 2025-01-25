'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status, router]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      
      // Also call our logout API to clear the auth token cookie
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      router.replace('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
        <div className="mt-4 space-y-2">
          <p className="text-gray-600">
            Email: {session.user?.email}
          </p>
          <p className="text-gray-600">
            Name: {session.user?.name}
          </p>
          {session.user?.image && (
            <div>
              <p className="text-gray-600 mb-2">Profile Image:</p>
              <Image 
                src={session.user.image} 
                alt="Profile" 
                width={500}
                height={300}
                className="w-16 h-16 rounded-full"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
            <p className="mt-2 text-sm text-gray-600">
              Update your personal information and preferences
            </p>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Security</h3>
            <p className="mt-2 text-sm text-gray-600">
              Manage your password and security settings
            </p>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <p className="mt-2 text-sm text-gray-600">
              Configure your notification preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 