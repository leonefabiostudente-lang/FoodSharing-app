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

// POST crea un nuovo annuncio
router.post("/", async (req, res) => {
  try {
    const nuovoAnnuncio = new Annuncio(req.body);
    await nuovoAnnuncio.save();
    res.status(201).json(nuovoAnnuncio);
  } catch (err) {
    res.status(400).json({ error: "Errore nella creazione dell'annuncio", dettagli: err });
  }
});

export default router;