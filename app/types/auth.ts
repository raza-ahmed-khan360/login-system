export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  error?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  error?: string;
}  