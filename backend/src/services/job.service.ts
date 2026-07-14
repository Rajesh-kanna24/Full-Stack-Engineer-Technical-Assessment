import { jobRepository } from '../repositories/job.repository';
import prisma from '../database/prisma';
import { AppError } from '../middlewares/errorHandler';

export class JobService {
  async createJob(data: any) {
    let companyId = data.companyId;

    if (!companyId && data.companyName) {
      const company = await prisma.company.create({ data: { name: data.companyName, employerId: data.employerId } });
      companyId = company.id;
    }

    if (!companyId) {
      throw new AppError('A company is required to create a job', 400);
    }

    const payload = {
      title: data.title,
      companyId,
      employerId: data.employerId,
      location: data.location,
      employmentType: data.employmentType,
      workMode: data.workMode,
      salary: data.salary,
      experience: data.experience,
      skills: data.skills || [],
      benefits: data.benefits || [],
      description: data.description,
      deadline: data.deadline ? new Date(data.deadline) : null,
      status: 'OPEN',
    };

    return await jobRepository.create(payload as any);
  }

  async getJobs(filters: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const query: any = { deletedAt: null, status: 'OPEN' };

    if (filters.search) {
      query.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { company: { name: { contains: filters.search, mode: 'insensitive' } } },
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

    if (filters.minSalary) {
      query.salary = { not: null };
    }

    const [jobs, total] = await Promise.all([
      jobRepository.findAll(query, skip, limit),
      jobRepository.count(query),
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

  async updateJob(id: string, employerId: string, data: any) {
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
        coverLetter: data.coverLetter,
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
    }
    return await jobRepository.getApplicationsForCandidate(userId);
  }

  async updateApplicationStatus(applicationId: string, userId: string, role: string, status: string) {
    if (role !== 'EMPLOYER' && role !== 'ADMIN') {
      throw new AppError('You are not allowed to review applications', 403);
    }

    const application = await jobRepository.findApplicationById(applicationId);
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.job.employerId !== userId) {
      throw new AppError('You are not allowed to review this application', 403);
    }

    return await jobRepository.updateApplicationStatus(applicationId, status);
  }
}

export const jobService = new JobService();
