import { userRepository } from '../repositories/user.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { AppError } from '../middlewares/errorHandler';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { Prisma } from '@prisma/client';

export class AuthService {
  async register(data: Prisma.UserCreateInput) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

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
      await refreshTokenRepository.delete(token); // Delete old one
      await refreshTokenRepository.create(tokens.refreshToken, decoded.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      
      return tokens;
    } catch (e) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(token: string) {
    await refreshTokenRepository.delete(token);
  }
}

export const authService = new AuthService();
