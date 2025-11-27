// frontend/src/api/auth.ts
import api from './axios';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  // 1. Send OTP
  requestOtp: async (phone: string) => {
    const response = await api.post('/auth/request-otp', { phone });
    return response.data;
  },

  // 2. Verify OTP & Login
  verifyOtp: async (phone: string, otp: string, role?: string, fullName?: string) => {
    const payload = {
      phone,
      otp,
      role,
      full_name: fullName,
    };
    // Filter out undefined values (like full_name during login)
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined)
    );
    
    const response = await api.post<LoginResponse>('/auth/verify-otp', cleanPayload);
    return response.data;
  }
};