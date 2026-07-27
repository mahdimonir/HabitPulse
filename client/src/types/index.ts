export interface User {
  id: string;
  email: string;
  name?: string | null;
}

export interface CheckIn {
  id: string;
  date: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string | null;
  category?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  todayCompleted: boolean;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  completionRate90Days: number;
  checkInDates: string[];
  checkIns?: CheckIn[];
}
