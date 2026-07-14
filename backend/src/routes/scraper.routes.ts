import express from 'express';
import { triggerScraper } from '../controllers/scraper.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);
router.post('/', restrictTo('ADMIN', 'EMPLOYER'), triggerScraper);

export default router;
