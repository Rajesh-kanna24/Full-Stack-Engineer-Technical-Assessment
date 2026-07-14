import express from 'express';
import { getApplications, updateApplicationStatus } from '../controllers/job.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);
router.get('/', getApplications);
router.patch('/:id/status', updateApplicationStatus);

export default router;
