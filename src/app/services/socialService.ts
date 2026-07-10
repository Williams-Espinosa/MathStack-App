import { apiClient } from './api';
import { FriendRequestResponse, ChallengeResponse, ChallengeParticipantResponse } from '../types/api';

export const socialService = {
  sendFriendRequest(friendId: string): Promise<FriendRequestResponse> {
    return apiClient.post<FriendRequestResponse>('/social/friends/request', { friendId });
  },

  acceptFriendRequest(friendId: string): Promise<FriendRequestResponse> {
    return apiClient.put<FriendRequestResponse>(`/social/friends/${friendId}/accept`);
  },

  getFriends(): Promise<string[]> {
    return apiClient.get<string[]>('/social/friends');
  },

  createChallenge(exerciseId: string, friendIds: string[]): Promise<ChallengeResponse> {
    return apiClient.post<ChallengeResponse>('/social/challenges', { exerciseId, friendIds });
  },

  submitChallengeResult(challengeId: string, score: number, timeTakenSeconds: number): Promise<ChallengeParticipantResponse> {
    return apiClient.post<ChallengeParticipantResponse>(`/social/challenges/${challengeId}/submit`, { score, timeTakenSeconds });
  },

  getGlobalChallenges(): Promise<any[]> {
    return apiClient.get<any[]>('/social/challenges/global');
  }
};
