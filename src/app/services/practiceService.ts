import { apiClient } from './api';
import { StudentDashboardMetricsResponse, PracticeSessionResponse, DiagnosticQuestionResponse, DiagnosticAnswerDto, DiagnosticSubjectResultResponse, LearningPathResponse } from '../types/api';

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

  generateDiagnosticQuiz(userId: string): Promise<DiagnosticQuestionResponse[]> {
    return apiClient.get<DiagnosticQuestionResponse[]>(`/practice/users/${userId}/diagnostics/generate`);
  },

<<<<<<< Updated upstream
  submitDiagnostic(userId: string, answers: { exerciseId: string; isCorrect: boolean }[]): Promise<any> {
    return apiClient.post(`/practice/users/${userId}/diagnostics`, { answers });
  },

  getLearningPath(userId: string): Promise<any> {
    return apiClient.get(`/practice/users/${userId}/learning-path`);
=======
  submitDiagnostic(userId: string, answers: DiagnosticAnswerDto[]): Promise<DiagnosticSubjectResultResponse[]> {
    return apiClient.post<DiagnosticSubjectResultResponse[]>(`/practice/users/${userId}/diagnostics`, { answers });
  },

  getLearningPath(userId: string): Promise<LearningPathResponse[]> {
    return apiClient.get<LearningPathResponse[]>(`/practice/users/${userId}/learning-path`);
  },

  completeLesson(userId: string, lessonId: string): Promise<any> {
    return apiClient.post(`/practice/users/${userId}/lessons/${lessonId}/complete`, {});
>>>>>>> Stashed changes
  }
};
