import { apiClient } from './api';
import { StudentDashboardMetricsResponse, PracticeSessionResponse } from '../types/api';

export const practiceService = {
  registerAttempt(userId: string, exerciseId: string, isCorrect: boolean): Promise<any> {
    return apiClient.post(`/practice/users/${userId}/attempts`, { exerciseId, isCorrect });
  },

  logSession(userId: string, sessionDate: string, minutesSpent: number): Promise<PracticeSessionResponse> {
    return apiClient.post<PracticeSessionResponse>(`/practice/users/${userId}/sessions`, { sessionDate, minutesSpent });
  },

  getDashboardMetrics(userId: string): Promise<StudentDashboardMetricsResponse> {
    return apiClient.get<StudentDashboardMetricsResponse>(`/practice/users/${userId}/dashboard`);
  },

  submitDiagnostic(userId: string, subjectId: number, score: number): Promise<any> {
    return apiClient.post(`/practice/users/${userId}/diagnostics`, { subjectId, score });
  }
};
