import { GamificationStats } from '../types/api';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: GamificationStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'Primeros Pasos',
    description: 'Completaste tu primera lección',
    icon: '🚀',
    condition: (stats) => stats.lessonsCompletedCount >= 1,
  },
  {
    id: 'five_lessons',
    title: 'Estudiante Aplicado',
    description: 'Completaste 5 lecciones',
    icon: '📚',
    condition: (stats) => stats.lessonsCompletedCount >= 5,
  },
  {
    id: 'ten_lessons',
    title: 'Maratón Mental',
    description: 'Completaste 10 lecciones',
    icon: '🧠',
    condition: (stats) => stats.lessonsCompletedCount >= 10,
  },
  {
    id: 'streak_3',
    title: 'Fuego Inicial',
    description: 'Alcanzaste una racha de 3 días',
    icon: '🔥',
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Imparable',
    description: 'Alcanzaste una racha de 7 días',
    icon: '⚡',
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'xp_500',
    title: 'Aprendiz',
    description: 'Conseguiste 500 puntos de XP',
    icon: '⭐',
    condition: (stats) => stats.xpPoints >= 500,
  },
  {
    id: 'xp_1000',
    title: 'Erudito',
    description: 'Conseguiste 1,000 puntos de XP',
    icon: '🎓',
    condition: (stats) => stats.xpPoints >= 1000,
  }
];

export function getUnlockedAchievements(stats: GamificationStats | undefined): Achievement[] {
  if (!stats) return [];
  return ACHIEVEMENTS.filter(achievement => achievement.condition(stats));
}

export function getNewlyUnlockedAchievements(oldStats: GamificationStats, newStats: GamificationStats): Achievement[] {
  const oldUnlocked = getUnlockedAchievements(oldStats);
  const newUnlocked = getUnlockedAchievements(newStats);

  return newUnlocked.filter(na => !oldUnlocked.find(oa => oa.id === na.id));
}
