import { apiClient } from './api';
import { AuthResponse } from '../types/api';

export const authService = {
  login(data: any): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  register(data: any): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  loginWithGoogle(data: any): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/google', data);
  },

  verifyOtp(data: { email: string, code: string }): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/verify-otp', data);
  },

  forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  },

  resetPassword(data: { email: string, code: string }): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/reset-password', data);
  }
};
