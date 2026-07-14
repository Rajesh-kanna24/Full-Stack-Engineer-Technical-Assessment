import express from 'express';
import { getApplications } from '../controllers/job.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);
router.get('/', getApplications);

export default router;
