# Login System with Next.js

A full-featured authentication system built with Next.js, featuring secure user management and email verification.

## Features

### Authentication
- Email & Password Login with JWT
- Secure Password Hashing with bcrypt
- HTTP-Only Cookie Session Management
- Authentication Status Check

### User Management
- User Registration with Email Verification
- Password Reset Flow
- OTP (One-Time Password) System
- Session Management
- Logout Functionality

### Email Features
- Email Verification System
- Password Reset Emails
- OTP Delivery via Email
- HTML Email Templates
- Gmail SMTP Integration

### Security Features
- OTP Expiration (5 minutes)
- Secure Password Hashing
- HTTP-Only Cookies
- Input Validation
- Secure Email Delivery

## API Endpoints

### Authentication
```typescript
POST /api/auth/signup
// Register new user
// Body: { email: string, password?: string, otp?: string }

POST /api/auth/login
// Login user
// Body: { email: string, password: string }

GET /api/auth/check
// Check authentication status
```

### Password Management
```typescript
POST /api/auth/forgot-password
// Request password reset
// Body: { email: string }

POST /api/auth/forgot-password/verify
// Verify reset OTP
// Body: { email: string, otp: string }
```

### OTP Verification
```typescript
POST /api/auth/verify-otp
// Verify OTP for registration
// Body: { email: string, otp: string }
```

## Environment Variables

Create a `.env.local` file with:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password
JWT_SECRET=your-jwt-secret
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
├── api/
│   └── auth/
│       ├── check/
│       ├── forgot-password/
│       ├── login/
│       ├── signup/
│       └── verify-otp/
├── utils/
│   ├── nodemailer.ts
│   └── userUtils.ts
```

## Technical Stack
- Next.js 13+ (App Router)
- TypeScript
- Nodemailer for Email Service
- bcryptjs for Password Hashing
- JSON Web Tokens (JWT)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
