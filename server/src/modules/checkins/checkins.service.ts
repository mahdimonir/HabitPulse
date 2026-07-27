import { prisma } from '../../prisma';
import { formatDateKey } from '../../utils/streak';
import { HabitsService } from '../habits/habits.service';
import { AppError } from '../../errors/AppError';

export class CheckinsService {
  static async toggleCheckIn(userId: string, habitId: string, targetDate?: string) {
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      throw new AppError(404, 'Habit not found or access denied');
    }

    const dateStr = targetDate || formatDateKey(new Date());

    const existingCheckIn = await prisma.checkIn.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: dateStr,
        },
      },
    });

    let isCompleted: boolean;

    if (existingCheckIn) {
      await prisma.checkIn.delete({
        where: {
          id: existingCheckIn.id,
        },
      });
      isCompleted = false;
    } else {
      await prisma.checkIn.create({
        data: {
          habitId,
          date: dateStr,
        },
      });
      isCompleted = true;
    }

    const updatedHabit = await HabitsService.getHabitById(userId, habitId);

    return {
      habitId,
      date: dateStr,
      isCompleted,
      habit: updatedHabit,
    };
  }
}
