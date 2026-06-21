import express from 'express';
import { register, login, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/register/', register);

router.post('/login', login);
router.post('/login/', login);

router.post('/forgot-password', forgotPassword);
router.post('/forgot-password/', forgotPassword);

router.post('/reset-password', resetPassword);
router.post('/reset-password/', resetPassword);

router.get('/verify/:token', verifyEmail);

router.get('/verify/:token/', verifyEmail);

export default router;