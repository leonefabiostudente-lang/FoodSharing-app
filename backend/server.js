// server.js
// Avvia il server solo dopo che la connessione a MongoDB è stata stabilita

import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from './routes/auth.js';
import annunciRouter from "./routes/annunci.js";


// ...dopo il middleware


const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://antispreco-app.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());66
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
    // Connessione a MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connesso");

    // Avvia il server solo dopo la connessione DB
    app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
  console.log(`PORT env: ${process.env.PORT || 'non impostata, usando fallback'}`);
});
  } catch (error) {
    console.error("❌ Errore connessione MongoDB:", error);
    // Non terminare il processo: lascia nodemon riavviare dopo correzione
  }
}

start();