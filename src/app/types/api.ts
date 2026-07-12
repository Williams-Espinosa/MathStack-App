export interface User {
  id: string;
  firebaseUid?: string;
  email: string;
  username: string;
  accessLevel: string;
  createdAt: string;
}

export interface GamificationStats {
  userId: string;
  coins: number;
  currentLevel: number;
  xpPoints: number;
  lessonsCompletedCount: number;
  currentStreak: number;
  maxStreak: number;
  minutesPracticed: number;
  lastPracticeDate: string | null;
  lastDiagnosticDate: string | null;
}

export interface UserProfileResponse {
  user: User;
  gamificationStats: GamificationStats;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SubjectResponse {
  id: number;
  name: string;
}

export interface LessonTypeResponse {
  id: number;
  name: string;
}

export interface LessonResponse {
  id: string;
  subjectId: number;
  lessonTypeId: number;
  title: string;
  difficultyLevel: number;
  content?: string;
}

export interface ExerciseResponse {
  id: string;
  lessonId: string;
  content: string;
  conceptTested: string | null;
}

export interface StudentDashboardMetricsResponse {
  weeklyMinutesSpent: number;
  pendingLessonsCount: number;
}

export interface PracticeSessionResponse {
  userId: string;
  sessionDate: string;
  minutesSpent: number;
}

export interface ItemTypeResponse {
  id: number;
  name: string;
}

export interface StoreItemResponse {
  id: string;
  itemTypeId: number;
  name: string;
  cost: number;
  assetUrl: string;
}

export interface UserInventoryItemResponse {
  userId: string;
  itemId: string;
  isEquipped: boolean;
  acquiredAt: string;
}

export interface FriendRequestResponse {
  userId: string;
  friendId: string;
  status: string;
}

export interface ChallengeResponse {
  id: string;
  creatorId: string;
  exerciseId: string;
  status: string;
}

export interface ChallengeParticipantResponse {
  challengeId: string;
  userId: string;
  score: number;
  timeTakenSeconds: number;
  completedAt: string;
}

export interface StepByStepRule {
  title: string;
  formula: string;
  description: string;
}

export interface StepByStepStep {
  stepNumber: number;
  title: string;
  equation: string;
  explanation: string;
}

export interface StepByStepData {
  rules: StepByStepRule[];
  steps: StepByStepStep[];
}

export interface ExerciseContentJSON {
  type: string;
  question: string;
  correctAnswer: string;
  hint: string;
  stepByStep?: StepByStepData;
}

export interface DiagnosticAnswerDto {
  exerciseId: string;
  isCorrect: boolean;
}

export interface SubmitDiagnosticRequest {
  answers: DiagnosticAnswerDto[];
}

export interface DiagnosticSubjectResultResponse {
  subjectId: number;
  subject: string;
  score: number;
}

export interface DiagnosticQuestionResponse extends ExerciseResponse {
  subjectId: number;
  subjectName: string;
}

export interface LearningPathLessonResponse {
  id: string;
  title: string;
  difficultyLevel: number;
  xp: number;
  status: string;
}

export interface LearningPathResponse {
  subjectId: number;
  subjectName: string;
  lessons: LearningPathLessonResponse[];
}
