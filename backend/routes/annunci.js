import express from "express";
import auth from "../middleware/auth.js";
import { getAnnunci, creaAnnuncio } from "../controllers/annunciController.js";

const router = express.Router();

router.get("/", getAnnunci);
router.get("", getAnnunci);

router.post("/", auth, creaAnnuncio);
router.post("", auth, creaAnnuncio);

export default router;