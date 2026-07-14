import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema, changePasswordSchema } from '../validators/auth.validator';
import { AuthRequest } from '../middlewares/auth.middleware';

export const register = catchAsync(async (req: Request, res: Response) => {
  const validated = registerSchema.parse(req.body);
  const result = await authService.register(validated);

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const validated = loginSchema.parse(req.body);
  const result = await authService.login(validated.email, validated.password);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const validated = refreshTokenSchema.parse(req.body);
  const tokens = await authService.refresh(validated.refreshToken);

  res.status(200).json({
    status: 'success',
    data: tokens,
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const validated = refreshTokenSchema.parse(req.body);
  await authService.logout(validated.refreshToken);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const validated = forgotPasswordSchema.parse(req.body);
  const result = await authService.forgotPassword(validated.email);
  res.status(200).json({ status: 'success', data: result });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const validated = resetPasswordSchema.parse(req.body);
  const result = await authService.resetPassword(validated.token, validated.newPassword);
  res.status(200).json({ status: 'success', data: result });
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const profile = await authService.getProfile(req.user!.id);
  res.status(200).json({ status: 'success', data: profile });
});

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const validated = updateProfileSchema.parse(req.body);
  const profile = await authService.updateProfile(req.user!.id, validated);
  res.status(200).json({ status: 'success', data: profile });
});

export const changePassword = catchAsync(async (req: AuthRequest, res: Response) => {
  const validated = changePasswordSchema.parse(req.body);
  const result = await authService.changePassword(req.user!.id, validated.currentPassword, validated.newPassword);
  res.status(200).json({ status: 'success', data: result });
});
