"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserData {
  email: string;
  name?: string;
  id?: string;
  // add other user properties as needed
}

interface ApiError {
  message: string;
  status?: number;
}

export default function HomePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => { 
    // Try to get the JWT token from localStorage or cookies
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // If no token, redirect to login page
    } else {
      // Fetch the user info or decode the token to get the user data (e.g. email, userId)
      fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data: UserData) => setUser(data))
        .catch((error: ApiError) => {
          console.error('Failed to fetch user data:', error.message);
          router.push('/login');
        });
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Welcome, {user.email}!</h1>
      <p>This is your dashboard. Here are some of the things you can do:</p>
      {/* Example links to other pages */}
      <ul>
        <li><Link href="/profile">Go to your profile</Link></li>
        <li><Link href="/settings">Settings</Link></li>
        <li>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="text-blue-600 hover:underline"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
