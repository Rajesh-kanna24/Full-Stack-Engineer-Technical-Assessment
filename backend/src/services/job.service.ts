import { jobRepository } from '../repositories/job.repository';
import { Prisma } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';

export class JobService {
  async createJob(data: Prisma.JobUncheckedCreateInput) {
    return await jobRepository.create(data);
  }

  async getJobs(filters: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    // Build Prisma query
    const query: any = { deletedAt: null, status: 'OPEN' };
    
    if (filters.search) {
      query.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { company: { name: { contains: filters.search, mode: 'insensitive' } } }
      ];
    }
    
    if (filters.location) {
      query.location = { contains: filters.location, mode: 'insensitive' };
    }

    if (filters.employmentType) {
      query.employmentType = filters.employmentType;
    }

    if (filters.workMode) {
      query.workMode = filters.workMode;
    }

    const [jobs, total] = await Promise.all([
      jobRepository.findAll(query, skip, limit),
      jobRepository.count(query)
    ]);

    return { jobs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getJobById(id: string) {
    const job = await jobRepository.findById(id);
    if (!job || job.deletedAt) {
      throw new AppError('Job not found', 404);
    }
    return job;
  }

  async updateJob(id: string, employerId: string, data: Prisma.JobUpdateInput) {
    const job = await this.getJobById(id);
    if (job.employerId !== employerId) {
      throw new AppError('Unauthorized to update this job', 403);
    }
    return await jobRepository.update(id, data);
  }

  async deleteJob(id: string, employerId: string) {
    const job = await this.getJobById(id);
    if (job.employerId !== employerId) {
      throw new AppError('Unauthorized to delete this job', 403);
    }
    return await jobRepository.delete(id);
  }

  async applyForJob(jobId: string, candidateId: string, data: any) {
    const job = await this.getJobById(jobId);
    if (job.status !== 'OPEN') {
      throw new AppError('This job is no longer open for applications', 400);
    }
    try {
      return await jobRepository.apply({
        jobId,
        candidateId,
        resumeUrl: data.resumeUrl,
        coverLetter: data.coverLetter
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new AppError('You have already applied for this job', 400);
      }
      throw e;
    }
  }

  async getApplications(userId: string, role: string) {
    if (role === 'EMPLOYER') {
      return await jobRepository.getApplicationsForEmployer(userId);
    } else {
      return await jobRepository.getApplicationsForCandidate(userId);
    }
  }
}

export const jobService = new JobService();
