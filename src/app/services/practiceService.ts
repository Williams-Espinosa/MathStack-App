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

  generateDiagnosticQuiz(userId: string): Promise<import('../types/api').ExerciseResponse[]> {
    return apiClient.get<import('../types/api').ExerciseResponse[]>(`/practice/users/${userId}/diagnostics/generate`);
  },

  submitDiagnostic(userId: string, answers: { exerciseId: string; isCorrect: boolean }[]): Promise<any> {
    return apiClient.post(`/practice/users/${userId}/diagnostics`, { answers });
  },

  getLearningPath(userId: string): Promise<any> {
    return apiClient.get(`/practice/users/${userId}/learning-path`);
  }
};
