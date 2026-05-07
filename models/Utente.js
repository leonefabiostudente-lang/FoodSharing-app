import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const UtenteSchema = new mongoose.Schema({
  // Tipo utente: privato, associazione, commerciante
  tipo: {
    type: String,
    enum: ["privato", "associazione", "commerciante"],
    required: true
  },

  /* ============================
     PRIVATO
  ============================ */
  nome: { type: String },
  cognome: { type: String },

  /* ============================
     ASSOCIAZIONE
  ============================ */
  nome_associazione: { type: String },
  partita_iva: { type: String },

  /* ============================
     COMMERCIANTE
  ============================ */
  nome_attivita: { type: String },
  categoria_attivita: { type: String },

  /* ============================
     DATI COMUNI
  ============================ */
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    select: false // non viene restituita nelle query
  }
});

/* ============================
   HASH PASSWORD PRIMA DEL SALVATAGGIO
============================ */
UtenteSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

/* ============================
   METODO PER CONFRONTARE PASSWORD
============================ */
UtenteSchema.methods.compara_password = async function (passwordInserita) {
  return bcryptjs.compare(passwordInserita, this.password);
};

export default mongoose.model("Utente", UtenteSchema);
