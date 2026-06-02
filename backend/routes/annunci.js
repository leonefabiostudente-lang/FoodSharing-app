import express from "express";
import auth from "../middleware/auth.js";
import { getAnnunci, creaAnnuncio } from "../controllers/annunciController.js";

const router = express.Router();

// Rotta per ottenere gli annunci (Pubblica)
router.get("/", getAnnunci);

// Rotta per creare gli annunci (Protetta)
router.post("/", auth, creaAnnuncio);

export default router;
