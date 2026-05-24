import auth from "../middleware/auth.js";
import express from "express";
import Annuncio from "../models/annunci.js";
import fetch from "node-fetch";

const router = express.Router();

/* ---------------------------------------------
   NORMALIZZAZIONE CATEGORIA (aggiunto)
--------------------------------------------- */
function normalizeCategoria(cat) {
  if (!cat) return "altro";

  const c = cat.toLowerCase().trim().replace(/\s+/g, "_");

  const valid = [
    "pane",
    "dolci",
    "frutta",
    "verdura",
    "pasti_pronti",
    "bevande",
    "altro"
  ];

  return valid.includes(c) ? c : "altro";
}

/* ---------------------------------------------
   FUNZIONE DI GEOCODING (OpenStreetMap)
--------------------------------------------- */
async function geocode(zona) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    zona + ", Italia"
  )}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "antispreco-app" }
  });

  const data = await res.json();

  if (!data || data.length === 0) {
    return { lat: null, lon: null };
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };
}

/* ---------------------------------------------
   GET /api/annunci + filtro zona
--------------------------------------------- */
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

/* ---------------------------------------------
   POST /api/annunci (PROTETTO)
   + geocoding automatico
   + normalizzazione categoria (aggiunto)
--------------------------------------------- */
router.post("/", auth, async (req, res) => {
  try {
    const { zona } = req.body;

    // 1️⃣ Ottieni latitudine/longitudine dalla zona
    const coords = await geocode(zona);

    // 2️⃣ Se il geocoding fallisce → blocca la creazione
    if (!coords.lat || !coords.lon) {
      return res.status(400).json({
        error: "Errore nella creazione dell'annuncio",
        dettagli: "Geocoding fallito: coordinate non trovate per la zona indicata"
      });
    }

    // 3️⃣ Crea annuncio con categoria normalizzata
    const nuovoAnnuncio = new Annuncio({
      ...req.body,
      categoria: normalizeCategoria(req.body.categoria), // ⭐ AGGIUNTO
      utente_id: req.utente.id,
      nome_utente: req.utente.nome,
      latitudine: coords.lat,
      longitudine: coords.lon
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