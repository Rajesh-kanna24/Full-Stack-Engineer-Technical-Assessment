import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(3),
  companyId: z.string().uuid(),
  location: z.string().min(2),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
  workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']),
  salary: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).min(1),
  benefits: z.array(z.string()).optional(),
  description: z.string().min(10),
  deadline: z.string().datetime().optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const applyJobSchema = z.object({
  resumeUrl: z.string().url().optional(),
  coverLetter: z.string().optional(),
});
