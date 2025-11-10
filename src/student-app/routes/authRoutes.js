import express from 'express';
import { register, login, forgotPassword } from '../controllers/authController.js';
import { uploadFaceImage, handleMulterError } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', uploadFaceImage, handleMulterError, register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

export default router;