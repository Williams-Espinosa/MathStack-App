import { apiClient } from './api';
import { UserProfileResponse, User, GamificationStats } from '../types/api';

export const userService = {
  getProfile(): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>('/users/me');
  },

  getUserById(id: string): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>(`/users/${id}`);
  },

  updateUser(id: string, data: any): Promise<User> {
    return apiClient.patch<User>(`/users/${id}`, data);
  },

  updateGamificationStats(id: string, data: any): Promise<GamificationStats> {
    return apiClient.patch<GamificationStats>(`/users/${id}/gamification-stats`, data);
  },

  registerPushToken(id: string, subscription: any): Promise<any> {
    return apiClient.post(`/users/${id}/push-token`, subscription);
  }
};
