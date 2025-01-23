"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserData { 
  email: string;
  name?: string;
  // add other user properties as needed
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
        .then((data) => setUser(data))
        .catch((error) => {
          console.error('Failed to fetch user data:', error);
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
        <li><Link href="/logout" onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}>Logout</Link></li>
      </ul>
    </div>
  );
}
