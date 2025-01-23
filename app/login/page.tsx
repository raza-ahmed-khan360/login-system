'use client';

import { Suspense } from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

export default LoginPage; 