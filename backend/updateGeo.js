// updateGeo.js
import mongoose from "mongoose";
import fetch from "node-fetch";
import Annuncio from "./models/annunci.js";

// 🔧 STRINGA MONGO (presa dal tuo .env)
const MONGO_URL = "mongodb+srv://leonefabiostudente_db_user:Amedeo13Azzurra28Nadia06@cluster0.mkig3m1.mongodb.net/antispreco_db?retryWrites=true&w=majority&appName=Cluster0";

// 🌍 Funzione geocoding
async function geocode(zona) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    zona + ", Italia"
  )}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "antispreco-app" }
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
    await mongoose.connect(MONGO_URL);

    console.log("📥 Recupero annunci senza coordinate...");
    const annunci = await Annuncio.find({
      $or: [{ latitudine: null }, { longitudine: null }]
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