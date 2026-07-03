import { apiClient } from './api';
import { SubjectResponse, LessonTypeResponse, LessonResponse, ExerciseResponse } from '../types/api';

export const academicService = {
  getSubjects(): Promise<SubjectResponse[]> {
    return apiClient.get<SubjectResponse[]>('/academic/subjects');
  },

  getLessonTypes(): Promise<LessonTypeResponse[]> {
    return apiClient.get<LessonTypeResponse[]>('/academic/lesson-types');
  },

  getLessons(subjectId: number): Promise<LessonResponse[]> {
    return apiClient.get<LessonResponse[]>(`/academic/subjects/${subjectId}/lessons`);
  },

  getLessonById(lessonId: string): Promise<LessonResponse> {
    return apiClient.get<LessonResponse>(`/academic/lessons/${lessonId}`);
  },

  getExercises(lessonId: string): Promise<ExerciseResponse[]> {
    return apiClient.get<ExerciseResponse[]>(`/academic/lessons/${lessonId}/exercises`);
  }
};
