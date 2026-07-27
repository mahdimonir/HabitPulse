import { prisma } from '../../prisma';
import { calculateStreaks, formatDateKey } from '../../utils/streak';
import { AppError } from '../../errors/AppError';

export interface GetHabitsOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  filter?: 'active' | 'completed' | 'archived' | 'all';
  sortBy?: 'newest' | 'streak' | 'rate' | 'title';
  includeArchived?: boolean;
}

export class HabitsService {
  static async getUserHabits(userId: string, options: GetHabitsOptions = {}) {
    const {
      page = 1,
      limit = 12,
      search = '',
      category,
      filter = 'active',
      sortBy = 'newest',
      includeArchived = false,
    } = options;

    const todayStr = formatDateKey(new Date());

    const whereCondition: any = {
      userId,
    };

    if (filter === 'active') {
      whereCondition.archived = false;
    } else if (filter === 'archived') {
      whereCondition.archived = true;
    } else if (!includeArchived && filter !== 'all') {
      whereCondition.archived = false;
    }

    if (category && category !== 'All') {
      whereCondition.category = category;
    }

    if (search.trim()) {
      whereCondition.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const habits = await prisma.habit.findMany({
      where: whereCondition,
      include: {
        checkIns: {
          select: {
            date: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let processed = habits.map((habit: any) => {
      const dates = habit.checkIns.map((c: any) => c.date);
      const streakInfo = calculateStreaks(dates);
      const todayCompleted = dates.includes(todayStr);

      return {
        id: habit.id,
        title: habit.title,
        description: habit.description,
        category: habit.category || 'General',
        archived: habit.archived,
        createdAt: habit.createdAt,
        updatedAt: habit.updatedAt,
        todayCompleted,
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        totalCheckIns: streakInfo.totalCheckIns,
        completionRate90Days: streakInfo.completionRate90Days,
        checkInDates: dates,
      };
    });

    if (filter === 'completed') {
      processed = processed.filter((h: any) => h.todayCompleted);
    }

    if (sortBy === 'streak') {
      processed.sort((a: any, b: any) => b.currentStreak - a.currentStreak);
    } else if (sortBy === 'rate') {
      processed.sort((a: any, b: any) => b.completionRate90Days - a.completionRate90Days);
    } else if (sortBy === 'title') {
      processed.sort((a: any, b: any) => a.title.localeCompare(b.title));
    } else {
      processed.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = processed.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * limit;
    const paginatedHabits = processed.slice(startIndex, startIndex + limit);

    return {
      habits: paginatedHabits,
      meta: {
        page: currentPage,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getHabitById(userId: string, habitId: string) {
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
      include: {
        checkIns: {
          select: {
            id: true,
            date: true,
            createdAt: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!habit) {
      throw new AppError(404, 'Habit not found');
    }

    const dates = habit.checkIns.map((c: any) => c.date);
    const streakInfo = calculateStreaks(dates);
    const todayStr = formatDateKey(new Date());

    return {
      id: habit.id,
      title: habit.title,
      description: habit.description,
      category: habit.category || 'General',
      archived: habit.archived,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      todayCompleted: dates.includes(todayStr),
      currentStreak: streakInfo.currentStreak,
      longestStreak: streakInfo.longestStreak,
      totalCheckIns: streakInfo.totalCheckIns,
      completionRate90Days: streakInfo.completionRate90Days,
      checkIns: habit.checkIns,
      checkInDates: dates,
    };
  }

  static async createHabit(userId: string, title: string, description?: string, category?: string) {
    const habit = await prisma.habit.create({
      data: {
        userId,
        title,
        description: description || null,
        category: category || 'General',
      },
    });

    return {
      id: habit.id,
      title: habit.title,
      description: habit.description,
      category: habit.category || 'General',
      archived: habit.archived,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      todayCompleted: false,
      currentStreak: 0,
      longestStreak: 0,
      totalCheckIns: 0,
      completionRate90Days: 0,
      checkInDates: [],
    };
  }

  static async updateHabit(userId: string, habitId: string, data: { title?: string; description?: string; category?: string; archived?: boolean }) {
    const existing = await prisma.habit.findFirst({ where: { id: habitId, userId } });
    if (!existing) {
      throw new AppError(404, 'Habit not found');
    }

    const updated = await prisma.habit.update({
      where: { id: habitId },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.archived !== undefined ? { archived: data.archived } : {}),
      },
    });

    return updated;
  }

  static async deleteHabit(userId: string, habitId: string) {
    const existing = await prisma.habit.findFirst({ where: { id: habitId, userId } });
    if (!existing) {
      throw new AppError(404, 'Habit not found');
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    return { success: true };
  }
}
