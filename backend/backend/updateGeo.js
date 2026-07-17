// updateGeo.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fetch from "node-fetch";
import Annuncio from "./models/annunci.js";

// ✅ ALLINEATO: Usa lo stesso nome del file server.js per non risultare "undefined"
const MONGO_URL = process.env.MONGODB_URI || process.env.MONGO_URL;

console.log("MONGO_URL RILEVATO:", MONGO_URL ? "Stringa presente" : "Mancante ❌");

// Funzione di utilità per creare una pausa artificiale (Evita il blocco IP su Nominatim)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 🌍 Funzione geocoding
async function geocode(zona) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      zona + ", Italia"
    )}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "antispreco-app/1.0 (leonefabiostudente-lang@gmail.com)",
        "Accept-Language": "it"
      }
    });

    if (!res.ok) return { lat: null, lon: null };

    const data = await res.json();

    if (!data || data.length === 0) {
      console.log("❌ Nessun risultato geografico trovato per:", zona);
      return { lat: null, lon: null };
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error(`Errore di geocoding per la zona ${zona}:`, error.message);
    return { lat: null, lon: null };
  }
}

async function aggiornaAnnunci() {
  try {
    if (!MONGO_URL) {
      console.error("❌ Errore: Nessuna stringa di connessione a MongoDB trovata nelle variabili d'ambiente.");
      process.exit(1);
    }

    console.log("⏳ Connessione al database...");
    await mongoose.connect(MONGO_URL, {
      tls: true,
      serverSelectionTimeoutMS: 8000
    });
    console.log("✅ Connessione database riuscita!");

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
      console.log(`📌 Elaborazione geocoding per: ${a.zona}`);

      const coords = await geocode(a.zona);

      a.latitudine = coords.lat;
      a.longitudine = coords.lon;

      await a.save();
      console.log(`✅ Aggiornato nel database: ${a.titolo} → ${coords.lat}, ${coords.lon}`);

      // ✅ PAUSA DI SICUREZZA: Attende 1.2 secondi prima del prossimo annuncio per rispettare la policy di OSM
      console.log("⏳ Attesa di sicurezza per non intasare l'API...");
      await sleep(1200);
    }

    console.log("🎉 Aggiornamento di tutti gli annunci completato con successo!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Errore generale durante lo script:", err);
    process.exit(1);
  }
}

aggiornaAnnunci();