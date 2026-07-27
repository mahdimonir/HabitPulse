export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  completionRate90Days: number;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export function calculateStreaks(checkInDates: string[], todayDate?: Date): StreakResult {
  const totalCheckIns = checkInDates.length;
  if (totalCheckIns === 0) {
    return { currentStreak: 0, longestStreak: 0, totalCheckIns: 0, completionRate90Days: 0 };
  }

  const uniqueDates = Array.from(new Set(checkInDates)).sort().reverse();
  const dateSet = new Set(uniqueDates);

  const today = todayDate ? new Date(todayDate) : new Date();
  const todayStr = formatDateKey(today);
  const yesterdayStr = formatDateKey(subDays(today, 1));

  let currentStreak = 0;
  let checkPointer: Date | null = null;

  if (dateSet.has(todayStr)) {
    checkPointer = new Date(today);
  } else if (dateSet.has(yesterdayStr)) {
    checkPointer = subDays(today, 1);
  }

  if (checkPointer) {
    while (true) {
      const dateStr = formatDateKey(checkPointer);
      if (dateSet.has(dateStr)) {
        currentStreak++;
        checkPointer = subDays(checkPointer, 1);
      } else {
        break;
      }
    }
  }

  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  const chronologicalDates = Array.from(dateSet).sort();

  for (const dateStr of chronologicalDates) {
    const currentDate = new Date(dateStr + 'T00:00:00');

    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    prevDate = currentDate;
  }

  let countLast90Days = 0;
  for (let i = 0; i < 90; i++) {
    const dStr = formatDateKey(subDays(today, i));
    if (dateSet.has(dStr)) {
      countLast90Days++;
    }
  }
  const completionRate90Days = Math.round((countLast90Days / 90) * 100);

  return {
    currentStreak,
    longestStreak,
    totalCheckIns,
    completionRate90Days,
  };
}
