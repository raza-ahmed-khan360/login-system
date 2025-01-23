// utils/otpUtils.ts

export function generateOTP(): string {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isOTPExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}
