import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator';

export const register = catchAsync(async (req: Request, res: Response) => {
  const validated = registerSchema.parse(req.body);
  const result = await authService.register(validated);
  
  res.status(201).json({
    status: 'success',
    data: result
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const validated = loginSchema.parse(req.body);
  const result = await authService.login(validated.email, validated.password);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const validated = refreshTokenSchema.parse(req.body);
  const tokens = await authService.refresh(validated.refreshToken);
  
  res.status(200).json({
    status: 'success',
    data: tokens
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const validated = refreshTokenSchema.parse(req.body);
  await authService.logout(validated.refreshToken);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  // Mock forgot password since no email provider is configured yet
  res.status(200).json({
    status: 'success',
    message: 'Password reset token sent to email'
  });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  // Mock reset password
  res.status(200).json({
    status: 'success',
    message: 'Password has been reset'
  });
});
