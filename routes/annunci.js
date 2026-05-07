import auth from "../middleware/auth.js";
import express from "express";
import Annuncio from "../models/annunci.js";

const router = express.Router();

// GET /api/annunci + filtro zona
router.get("/", async (req, res) => {
  try {
    const filtro = {};

    if (req.query.zona) {
      filtro.zona = { $regex: req.query.zona, $options: "i" };
    }

    const annunci = await Annuncio.find(filtro);
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
      utente_id: req.utente.id,
      nome_utente: req.utente.nome
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
