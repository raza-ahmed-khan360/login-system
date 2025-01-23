// app/auth/otp-verify/page.tsx

'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'OTP verification failed');
        return;
      }

      // OTP verified, redirect to set password page
      router.push('/auth/signup');
    } catch (err) {
      console.error('OTP error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>OTP Verification</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleOtpSubmit}>
        <div>
          <label>OTP</label>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        </div>
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
}
