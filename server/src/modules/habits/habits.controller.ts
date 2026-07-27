import { Response } from 'express';
import { HabitsService } from './habits.service';
import { AuthenticatedRequest } from '../../middleware/auth';
import { catchAsync } from '../../utils/catchAsync';
import { apiResponse } from '../../utils/apiResponse';

export class HabitsController {
  static getHabits = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;

    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '12', 10);
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || undefined;
    const filter = (req.query.filter as any) || (req.query.includeArchived === 'true' ? 'all' : 'active');
    const sortBy = (req.query.sortBy as any) || 'newest';
    const includeArchived = req.query.includeArchived === 'true';

    const result = await HabitsService.getUserHabits(userId, {
      page,
      limit,
      search,
      category,
      filter,
      sortBy,
      includeArchived,
    });

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Habits retrieved successfully',
      data: result,
    });
  });

  static getHabitById = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const habit = await HabitsService.getHabitById(userId, id);

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Habit fetched successfully',
      data: habit,
    });
  });

  static createHabit = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { title, description, category } = req.body;

    const habit = await HabitsService.createHabit(userId, title.trim(), description, category);

    apiResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Habit created successfully',
      data: habit,
    });
  });

  static updateHabit = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const { title, description, category, archived } = req.body;

    const habit = await HabitsService.updateHabit(userId, id, { title, description, category, archived });

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Habit updated successfully',
      data: habit,
    });
  });

  static deleteHabit = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    await HabitsService.deleteHabit(userId, id);

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Habit deleted successfully',
    });
  });
}
