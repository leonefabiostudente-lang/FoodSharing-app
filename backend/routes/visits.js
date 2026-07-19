import express from 'express';
import { incrementVisitCount } from '../controllers/visitsController.js';

const router = express.Router();

router.post('/', incrementVisitCount);

export default router;
