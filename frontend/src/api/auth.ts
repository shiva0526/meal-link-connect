// frontend/src/api/auth.ts
import api from './axios';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  // 1. Send OTP
  requestOtp: async (phone: string, isLogin: boolean) => {
    const response = await api.post('/auth/request-otp', { phone, is_login: isLogin });
    // Log the returned data (debug_otp available when backend DEBUG_RETURN_OTP is true)
    console.debug('[authApi.requestOtp] response:', response.data);
    if (response.data?.debug_otp) {
      console.info('[DEBUG OTP] ', response.data.debug_otp);
    }
    return response.data;
  },

  // 2. Verify OTP & Login
  verifyOtp: async (phone: string, otp: string, role?: string, fullName?: string, orphanageDetails?: any) => {
    const payload = {
      phone,
      otp,
      role,
      full_name: fullName,
      orphanage_details: orphanageDetails,
    };
    // Filter out undefined values (like full_name during login)
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined)
    );

    const response = await api.post<LoginResponse>('/auth/verify-otp', cleanPayload);
    return response.data;
  }
};