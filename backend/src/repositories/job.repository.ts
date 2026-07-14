import prisma from '../database/prisma';
import { Prisma } from '@prisma/client';

export class JobRepository {
  async create(data: Prisma.JobUncheckedCreateInput) {
    return await prisma.job.create({ data, include: { company: true } });
  }

  async findAll(query: any, skip: number, take: number) {
    return await prisma.job.findMany({
      where: query,
      skip,
      take,
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(query: any) {
    return await prisma.job.count({ where: query });
  }

  async findById(id: string) {
    return await prisma.job.findUnique({
      where: { id },
      include: { company: true, applications: true },
    });
  }

  async update(id: string, data: Prisma.JobUpdateInput) {
    return await prisma.job.update({ where: { id }, data, include: { company: true } });
  }

  async delete(id: string) {
    return await prisma.job.update({
      where: { id },
      data: { status: 'CLOSED', deletedAt: new Date() },
    });
  }

  async apply(data: Prisma.ApplicationUncheckedCreateInput) {
    return await prisma.application.create({ data });
  }

  async getApplicationsForEmployer(employerId: string) {
    return await prisma.application.findMany({
      where: { job: { employerId } },
      include: { job: true, candidate: { select: { id: true, name: true, email: true, resumeUrl: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getApplicationsForCandidate(candidateId: string) {
    return await prisma.application.findMany({
      where: { candidateId },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const jobRepository = new JobRepository();
