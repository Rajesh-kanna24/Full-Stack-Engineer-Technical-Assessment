import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob, applyForJob, getApplications } from '../controllers/job.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes
router.use(protect);

// Application routes
router.post('/:id/apply', restrictTo('CANDIDATE'), applyForJob);

// Employer / Admin only routes
router.post('/', restrictTo('EMPLOYER', 'ADMIN'), createJob);
router.put('/:id', restrictTo('EMPLOYER', 'ADMIN'), updateJob);
router.delete('/:id', restrictTo('EMPLOYER', 'ADMIN'), deleteJob);

export default router;
