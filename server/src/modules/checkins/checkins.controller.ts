import { Response } from 'express';
import { CheckinsService } from './checkins.service';
import { AuthenticatedRequest } from '../../middleware/auth';
import { catchAsync } from '../../utils/catchAsync';
import { apiResponse } from '../../utils/apiResponse';

export class CheckinsController {
  static toggleCheckIn = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const habitId = req.params.habitId as string;
    const date = req.body?.date;

    const result = await CheckinsService.toggleCheckIn(userId, habitId, date);

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: result.isCompleted ? 'Check-in recorded' : 'Check-in removed',
      data: result,
    });
  });
}
