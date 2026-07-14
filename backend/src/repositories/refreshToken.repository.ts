import prisma from '../database/prisma';

export class RefreshTokenRepository {
  async create(token: string, userId: string, expiresAt: Date) {
    const existing = await prisma.refreshToken.findUnique({ where: { token } });

    if (existing) {
      return await prisma.refreshToken.update({
        where: { token },
        data: { userId, expiresAt },
      });
    }

    return await prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });
  }

  async findByToken(token: string) {
    return await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async delete(token: string) {
    return await prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteByUserId(userId: string) {
    return await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
