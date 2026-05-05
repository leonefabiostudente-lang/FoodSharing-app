import auth from "../middleware/auth.js";
import express from "express";
import Annuncio from "../models/annunci.js";

const router = express.Router();

// GET tutti gli annunci
router.get("/", async (req, res) => {
  try {
    const annunci = await Annuncio.find();
    res.json(annunci);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero degli annunci" });
  }
});

// POST crea un nuovo annuncio (PROTETTO)
router.post("/", auth, async (req, res) => {
  try {
    const nuovoAnnuncio = new Annuncio({
      ...req.body,
      utente_id: req.utente.id,     // preso dal token
      nome_utente: req.utente.nome  // preso dal token
    });

    await nuovoAnnuncio.save();
    res.status(201).json(nuovoAnnuncio);
  } catch (err) {
    res.status(400).json({
      error: "Errore nella creazione dell'annuncio",
      dettagli: err.message
    });
  }
});

export default router;
