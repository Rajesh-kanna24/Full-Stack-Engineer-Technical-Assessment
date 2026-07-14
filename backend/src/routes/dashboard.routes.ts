import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);
router.get('/', getDashboardStats);

export default router;
