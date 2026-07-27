import { Response } from 'express';

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
}

export const apiResponse = <T>(res: Response, response: ApiResponse<T>): void => {
  res.status(response.statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
};
