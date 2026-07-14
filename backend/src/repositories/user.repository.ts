import prisma from '../database/prisma';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({ where: { id }, data });
  }
}

export const userRepository = new UserRepository();
