import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../database/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getDashboardStats = catchAsync(async (req: AuthRequest, res: Response) => {
  const role = req.user!.role;
  const userId = req.user!.id;

  let stats = {};

  if (role === 'ADMIN') {
    const [totalUsers, totalCompanies, totalJobs, applications, jobsScraped] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.scrapedJob.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
      })
    ]);
    stats = { totalUsers, totalCompanies, totalJobs, applications, jobsScrapedToday: jobsScraped };
  } else if (role === 'EMPLOYER') {
    const [myJobs, applicants] = await Promise.all([
      prisma.job.count({ where: { employerId: userId } }),
      prisma.application.count({ where: { job: { employerId: userId } } })
    ]);
    stats = { myJobs, applicants };
  } else {
    // CANDIDATE
    const [savedJobs, appliedJobs] = await Promise.all([
      prisma.savedJob.count({ where: { userId } }),
      prisma.application.count({ where: { candidateId: userId } })
    ]);
    stats = { savedJobs, appliedJobs };
  }

  res.status(200).json({ status: 'success', data: stats });
});
