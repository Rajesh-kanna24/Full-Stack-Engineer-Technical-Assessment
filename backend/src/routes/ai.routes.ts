import express from 'express';
import { matchResume } from '../controllers/ai.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);
router.use(restrictTo('EMPLOYER', 'ADMIN'));
router.post('/match-resume', matchResume);

export default router;
