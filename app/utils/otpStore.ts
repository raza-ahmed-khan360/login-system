// utils/otpStore.ts

interface OTPData {
  otp: string;
  expiresAt: number;
  type?: 'signup' | 'reset-password';
}

export const OTP_STORE: { [key: string]: OTPData } = {};
