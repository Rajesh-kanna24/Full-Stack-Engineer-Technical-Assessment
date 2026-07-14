import prisma from '../database/prisma';

export class JobRepository {
  async create(data: any) {
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

  async update(id: string, data: any) {
    return await prisma.job.update({ where: { id }, data, include: { company: true } });
  }

  async delete(id: string) {
    return await prisma.job.update({
      where: { id },
      data: { status: 'CLOSED', deletedAt: new Date() },
    });
  }

  async apply(data: any) {
    return await prisma.application.create({ data });
  }

  async getApplicationsForEmployer(employerId: string) {
    return await prisma.application.findMany({
      where: { job: { employerId } },
      include: { job: true, candidate: { select: { id: true, name: true, email: true, resumeUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findApplicationById(id: string) {
    return await prisma.application.findUnique({
      where: { id },
      include: { job: true, candidate: true },
    });
  }

  async updateApplicationStatus(id: string, status: string) {
    return await prisma.application.update({
      where: { id },
      data: { status: status as any },
      include: { job: true, candidate: true },
    });
  }

  async getApplicationsForCandidate(candidateId: string) {
    return await prisma.application.findMany({
      where: { candidateId },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const jobRepository = new JobRepository();
