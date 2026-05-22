// updateGeo.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fetch from "node-fetch";
import Annuncio from "./models/annunci.js";

// 🔧 STRINGA MONGO (SRV) — FUNZIONA SU WINDOWS CON TLS ATTIVO
const MONGO_URL = process.env.MONGO_URL;

// 🌍 Funzione geocoding
async function geocode(zona) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    zona + ", Italia"
  )}`;

  const res = await fetch(url, {
  headers: {
    "User-Agent": "antispreco-app/1.0 (leonefabiostudente-lang@gmail.com)",
    "Accept-Language": "it"
  }
});


  const data = await res.json();

  if (!data || data.length === 0) {
    console.log("❌ Nessun risultato per:", zona);
    return { lat: null, lon: null };
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };
}

async function aggiornaAnnunci() {
  try {
    console.log("⏳ Connessione al database...");

    // ⭐ FIX PER WINDOWS: TLS + timeout
    await mongoose.connect(MONGO_URL, {
      tls: true,
      serverSelectionTimeoutMS: 8000
    });

    console.log("📥 Recupero annunci senza coordinate...");
    const annunci = await Annuncio.find({
      $or: [
        { latitudine: null },
        { longitudine: null },
        { latitudine: { $exists: false } },
        { longitudine: { $exists: false } }
      ]
    });

    console.log(`🔍 Trovati ${annunci.length} annunci da aggiornare`);

    for (const a of annunci) {
      console.log(`📌 Geocoding: ${a.zona}`);

      const coords = await geocode(a.zona);

      a.latitudine = coords.lat;
      a.longitudine = coords.lon;

      await a.save();

      console.log(`✅ Aggiornato: ${a.titolo} → ${coords.lat}, ${coords.lon}`);
    }

    console.log("🎉 Aggiornamento completato!");
    process.exit();

  } catch (err) {
    console.error("❌ Errore:", err);
    process.exit(1);
  }
}

aggiornaAnnunci();