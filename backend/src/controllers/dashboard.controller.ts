import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../database/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getDashboardStats = catchAsync(async (req: AuthRequest, res: Response) => {
  const role = req.user!.role;
  const userId = req.user!.id;

  if (role === 'ADMIN') {
    const [totalUsers, totalCompanies, totalJobs, applications, jobsScraped, recentActivity] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.company.count(),
      prisma.job.count({ where: { deletedAt: null } }),
      prisma.application.count(),
      prisma.scrapedJob.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      prisma.application.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { candidate: true, job: true } }),
    ]);

    const topSkills = await prisma.job.findMany({ select: { skills: true }, where: { deletedAt: null } });
    const skillCounts = topSkills.flatMap((job) => job.skills).reduce((acc: Record<string, number>, skill: string) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

    const topCompanies = await prisma.company.findMany({ take: 5, select: { name: true, _count: { select: { jobs: true } } } });
    const topLocations = await prisma.job.groupBy({ by: ['location'], _count: { location: true } });

    const stats = {
      totalUsers,
      totalCompanies,
      totalJobs,
      applications,
      jobsScrapedToday: jobsScraped,
      topSkills: Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
      topCompanies,
      topLocations,
      recentActivity,
    };

    res.status(200).json({ status: 'success', data: stats });
    return;
  }

  if (role === 'EMPLOYER') {
    const [myJobs, applicants, activeJobs] = await Promise.all([
      prisma.job.count({ where: { employerId: userId, deletedAt: null } }),
      prisma.application.count({ where: { job: { employerId: userId } } }),
      prisma.job.findMany({ where: { employerId: userId, deletedAt: null }, take: 8, orderBy: { createdAt: 'desc' } }),
    ]);
    res.status(200).json({ status: 'success', data: { myJobs, applicants, activeJobs } });
    return;
  }

  const [savedJobs, appliedJobs, appliedList] = await Promise.all([
    prisma.savedJob.count({ where: { userId } }),
    prisma.application.count({ where: { candidateId: userId } }),
    prisma.application.findMany({ where: { candidateId: userId }, take: 5, include: { job: { include: { company: true } } }, orderBy: { createdAt: 'desc' } }),
  ]);

  res.status(200).json({ status: 'success', data: { savedJobs, appliedJobs, appliedList } });
});
