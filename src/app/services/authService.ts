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
  }
};
