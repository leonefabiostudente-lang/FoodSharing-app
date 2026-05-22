import auth from "../middleware/auth.js";
import express from "express";
import Annuncio from "../models/annunci.js";
import fetch from "node-fetch";

const router = express.Router();

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
--------------------------------------------- */
router.post("/", auth, async (req, res) => {
  try {
    const { zona } = req.body;

    // 1️⃣ Ottieni latitudine/longitudine dalla zona
    const coords = await geocode(zona);

    // 2️⃣ CONTROLLO AGGIUNTO (Soluzione A)
    //    Se il geocoding fallisce → blocca la creazione
    if (!coords.lat || !coords.lon) {
      return res.status(400).json({
        error: "Errore nella creazione dell'annuncio",
        dettagli: "Geocoding fallito: coordinate non trovate per la zona indicata"
      });
    }

    // 3️⃣ Crea annuncio con coordinate
    const nuovoAnnuncio = new Annuncio({
      ...req.body,
      utente_id: req.utente.id,
      nome_utente: req.utente.nome,

      // 🔵 Coordinate salvate correttamente
      latitudine: coords.lat,
      longitudine: coords.lon

      /*
      ❗ PRIMA QUI NON C'ERA CONTROLLO
      e MongoDB tentava di creare un indice geospaziale
      su valori nulli → errore "must be an array or object"
      */
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