import Annuncio from "../models/annunci.js";
import fetch from "node-fetch";

/* ---------------------------------------------
   NORMALIZZAZIONE CATEGORIA
--------------------------------------------- */
function normalizeCategoria(cat) {
  if (!cat) return "altro";
  const c = cat.toLowerCase().trim().replace(/\s+/g, "_");
  const valid = ["pane", "dolci", "frutta", "verdura", "pasti_pronti", "bevande", "altro"];
  return valid.includes(c) ? c : "altro";
}

/* ---------------------------------------------
   GEOCODING (solo se necessario)
--------------------------------------------- */
async function geocode(zona) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      zona + ", Italia"
    )}&limit=1&countrycodes=it`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "antispreco-app/1.0 (leonefabiostudente-lang@gmail.com)",
        "Accept-Language": "it"
      }
    });

    if (!res.ok) return { lat: null, lon: null };

    const data = await res.json();

    if (!data || data.length === 0) {
      console.log("❌ Nessun risultato trovato per la zona:", zona);
      return { lat: null, lon: null };
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error("Errore interno durante il geocoding:", error.message);
    return { lat: null, lon: null };
  }
}

/* ---------------------------------------------
   GET /api/annunci
--------------------------------------------- */
export const getAnnunci = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.zona) {
      filtro.zona = { $regex: req.query.zona, $options: "i" };
    }
    // Recupera gli annunci (Mongoose includerà automaticamente il campo foto)
    const annunci = await Annuncio.find(filtro);
    res.json(annunci);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero degli annunci" });
  }
};

/* ---------------------------------------------
   POST /api/annunci
--------------------------------------------- */
export const creaAnnuncio = async (req, res) => {
  try {
    const { zona, lat, lng, foto } = req.body;

    if (!zona || !zona.trim()) {
      return res.status(400).json({
        error: "Errore nella creazione dell'annuncio",
        dettagli: "Il campo 'zona' è obbligatorio"
      });
    }

    let latitudine = lat;
    let longitudine = lng;

    // Se il frontend NON ha inviato lat/lng → geocoding
    if (!latitudine || !longitudine) {
      const coords = await geocode(zona);

      if (!coords.lat || !coords.lon) {
        return res.status(400).json({
          error: "Errore nella creazione dell'annuncio",
          dettagli: "Geocoding fallito: coordinate non trovate per la zona indicata."
        });
      }

      latitudine = coords.lat;
      longitudine = coords.lon;
    }

    // ⭐ GESTIONE STRUTTURA FOTO IN BASE64
    // Ci assicuriamo che il campo foto sia salvato come array di stringhe coerente con il Model
    let listaFoto = [];
    if (foto) {
      if (Array.isArray(foto)) {
        listaFoto = foto; // È già un array, lo teniamo così
      } else if (typeof foto === "string" && foto.trim() !== "") {
        listaFoto = [foto]; // È una stringa singola, la avvolgiamo in un array
      }
    }

    const nuovoAnnuncio = new Annuncio({
      ...req.body,
      categoria: normalizeCategoria(req.body.categoria),
      utente_id: req.utente.id,
      nome_utente: req.utente.nome,
      latitudine,
      longitudine,
      foto: listaFoto // <--- Sovrascriviamo con l'array normalizzato e sicuro
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