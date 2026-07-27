import { Request, Response } from 'express';
import { config } from '../../config/env';
import { AppError } from '../../errors/AppError';
import { AuthenticatedRequest } from '../../middleware/auth';
import { apiResponse } from '../../utils/apiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { AuthService } from './auth.service';

export class AuthController {
  static register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;
    const result = await AuthService.register(email, password, name);

    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: config.isProduction });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: config.isProduction });

    apiResponse(res, {
      statusCode: 201,
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  });

  static login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: config.isProduction });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: config.isProduction });

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User logged in successfully',
      data: result,
    });
  });

  static refresh = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new AppError(400, 'Refresh token is required');
    }

    const result = await AuthService.refresh(refreshToken);

    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: config.isProduction });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: config.isProduction });

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  });

  static logout = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Logged out successfully',
    });
  });

  static getMe = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await AuthService.getUserProfile(req.user.userId);

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User profile fetched successfully',
      data: { user },
    });
  });

  static updateProfile = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { name } = req.body;
    const updatedUser = await AuthService.updateProfile(req.user.userId, name);

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser },
    });
  });

  static changePassword = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { currentPassword, newPassword } = req.body;
    await AuthService.changePassword(req.user.userId, currentPassword, newPassword);

    apiResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Password changed successfully',
    });
  });
}
