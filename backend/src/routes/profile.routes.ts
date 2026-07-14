import express from 'express';
import { getMe, updateProfile, changePassword } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);
router.get('/', getMe);
router.put('/', updateProfile);
router.put('/change-password', changePassword);

export default router;
