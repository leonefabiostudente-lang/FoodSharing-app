import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Rotta per la registrazione utente
router.post('/register', register);

// Rotta per il login utente
router.post('/login', login);

export default router;
