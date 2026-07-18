// server.js
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from './routes/auth.js';
import annunciRouter from "./routes/annunci.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://antispreco-app.vercel.app",
  "https://foodsharing-app.vercel.app",
  "https://www.viveretropea.it",
  "https://viveretropea.it"
];

app.use(cors({
  origin(origin, callback) {
    // Allow non-browser clients and same-origin requests without Origin header.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS origin non consentita: ${origin}`));
  },
  credentials: true
}));

// Rimosso il refuso "66" che causava crash sintattici
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/annunci', annunciRouter);

// Route di test che mostra lo stato del DB
app.get("/api/test", (req, res) => {
  const stato = mongoose.connection.readyState === 1 ? "connesso" : "non connesso";
  res.json({ message: "Backend online!", mongodb: stato });
});

const PORT = process.env.PORT || 5000;

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ Errore: MONGODB_URI non trovata nel file .env");
    process.exit(1);
  }

  try {
    // Connessione a MongoDB (rimosse opzioni deprecate useNewUrlParser e useUnifiedTopology)
    await mongoose.connect(uri);
    console.log("✅ MongoDB connesso");

    // Avvia il server solo dopo la connessione DB
    app.listen(PORT, () => {
      console.log(`Server in esecuzione su http://localhost:${PORT}`);
      console.log(`PORT env: ${process.env.PORT || 'non impostata, usando fallback'}`);
    });
  } catch (error) {
    console.error("❌ Errore connessione MongoDB:", error);
  }
}

start();