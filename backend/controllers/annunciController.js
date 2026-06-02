import Annuncio from "../models/annunci.js";
import fetch from "node-fetch";

/* ---------------------------------------------
   FUNZIONI DI UTILITÀ INTERNE
--------------------------------------------- */
function normalizeCategoria(cat) {
  if (!cat) return "altro";
  const c = cat.toLowerCase().trim().replace(/\s+/g, "_");
  const valid = ["pane", "dolci", "frutta", "verdura", "pasti_pronti", "bevande", "altro"];
  return valid.includes(c) ? c : "altro";
}

async function geocode(zona) {
  try {
    const url = `https://openstreetmap.org{encodeURIComponent(zona + ", Italia")}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "antispreco-app (tua-email-o-contatto@example.com)" }
    });
    if (!res.ok) return { lat: null, lon: null };
    const data = await res.json();
    if (!data || data.length === 0) return { lat: null, lon: null };
    
    // Correzione bug di lettura array
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error("Errore di rete durante il geocoding:", error);
    return { lat: null, lon: null };
  }
}

/* ---------------------------------------------
   LOGICA DEI CONTROLLER ESPORTATA
--------------------------------------------- */

// Gestisce GET /api/annunci
export const getAnnunci = async (req, res) => {
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
};

// Gestisce POST /api/annunci
export const creaAnnuncio = async (req, res) => {
  try {
    const { zona } = req.body;

    if (!zona || !zona.trim()) {
      return res.status(400).json({
        error: "Errore nella creazione dell'annuncio",
        dettagli: "Il campo 'zona' è obbligatorio"
      });
    }

    const coords = await geocode(zona);

    if (!coords.lat || !coords.lon) {
      return res.status(400).json({
        error: "Errore nella creazione dell'annuncio",
        dettagli: "Geocoding fallito: coordinate non trovate per la zona indicata."
      });
    }

    const nuovoAnnuncio = new Annuncio({
      ...req.body,
      categoria: normalizeCategoria(req.body.categoria),
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
};
