import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { jobService } from '../services/job.service';
import { createJobSchema, updateJobSchema, applyJobSchema } from '../validators/job.validator';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createJob = catchAsync(async (req: AuthRequest, res: Response) => {
  const validated = createJobSchema.parse(req.body);
  const job = await jobService.createJob({
    ...validated,
    employerId: req.user!.id,
  });
  
  res.status(201).json({ status: 'success', data: job });
});

export const getJobs = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const result = await jobService.getJobs(req.query, page, limit);
  
  res.status(200).json({ status: 'success', data: result });
});

export const getJobById = catchAsync(async (req: Request, res: Response) => {
  const job = await jobService.getJobById(req.params.id);
  res.status(200).json({ status: 'success', data: job });
});

export const updateJob = catchAsync(async (req: AuthRequest, res: Response) => {
  const validated = updateJobSchema.parse(req.body);
  const job = await jobService.updateJob(req.params.id, req.user!.id, validated);
  res.status(200).json({ status: 'success', data: job });
});

export const deleteJob = catchAsync(async (req: AuthRequest, res: Response) => {
  await jobService.deleteJob(req.params.id, req.user!.id);
  res.status(204).json({ status: 'success', data: null });
});

export const applyForJob = catchAsync(async (req: AuthRequest, res: Response) => {
  const validated = applyJobSchema.parse(req.body);
  const application = await jobService.applyForJob(req.params.id, req.user!.id, validated);
  res.status(201).json({ status: 'success', data: application });
});

export const getApplications = catchAsync(async (req: AuthRequest, res: Response) => {
  const applications = await jobService.getApplications(req.user!.id, req.user!.role);
  res.status(200).json({ status: 'success', data: applications });
});
