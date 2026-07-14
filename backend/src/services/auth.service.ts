import { userRepository } from '../repositories/user.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { AppError } from '../middlewares/errorHandler';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import prisma from '../database/prisma';

export class AuthService {
  private async createRefreshRecord(userId: string) {
    const tokens = generateTokens(userId, 'CANDIDATE');
    await refreshTokenRepository.create(tokens.refreshToken, userId, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    return tokens;
  }

  async register(data: { email: string; password: string; name: string; role?: string }) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    if (data.password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const role = (data.role || 'CANDIDATE').toUpperCase() as 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';

    const user = await userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role,
    } as any);

    const tokens = generateTokens(user.id, user.role);
    await refreshTokenRepository.create(tokens.refreshToken, user.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, tokens };
  }

  async login(email: string, pass: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const tokens = generateTokens(user.id, user.role);
    await refreshTokenRepository.create(tokens.refreshToken, user.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, tokens };
  }

  async refresh(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const storedToken = await refreshTokenRepository.findByToken(token);

      if (!storedToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      const tokens = generateTokens(decoded.id, decoded.role);
      await refreshTokenRepository.delete(token);
      await refreshTokenRepository.create(tokens.refreshToken, decoded.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

      return tokens;
    } catch (e) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(token: string) {
    await refreshTokenRepository.delete(token);
  }

  async getProfile(userId: string) {
    return userRepository.findById(userId);
  }

  async updateProfile(userId: string, data: { name?: string; bio?: string; profileImage?: string; resumeUrl?: string }) {
    return userRepository.update(userId, data as any);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    if (!await bcrypt.compare(currentPassword, user.password)) throw new AppError('Current password is incorrect', 400);
    if (newPassword.length < 8) throw new AppError('Password must be at least 8 characters', 400);
    const hashed = await bcrypt.hash(newPassword, 12);
    await userRepository.update(userId, { password: hashed } as any);
    return { message: 'Password updated successfully' };
  }

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return { message: 'If the account exists, a reset link has been sent' };
    return { message: 'If the account exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    if (newPassword.length < 8) throw new AppError('Password must be at least 8 characters', 400);
    return { message: 'Password reset is ready for integration with an email provider' };
  }
}

export const authService = new AuthService();
