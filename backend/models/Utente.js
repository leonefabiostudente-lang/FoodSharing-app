import mongoose from "mongoose";

const UtenteSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["privato", "associazione", "commerciante"],
    required: true
  },

  nome: { type: String },
  cognome: { type: String },

  nome_associazione: { type: String },
  partita_iva: { type: String },

  nome_attivita: { type: String },
  categoria_attivita: { type: String },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    select: false
  }
,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date }
});

export default mongoose.model("Utente", UtenteSchema);