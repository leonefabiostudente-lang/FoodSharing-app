import mongoose from 'mongoose';

const annunciSchema = new mongoose.Schema(
  {
    titolo: {
      type: String,
      required: [true, 'Il titolo è obbligatorio'],
      maxlength: 100,
    },
    descrizione: {
      type: String,
      required: [true, 'La descrizione è obbligatoria'],
      maxlength: 1000,
    },
    categoria: {
      type: String,
      enum: ['pane', 'dolci', 'frutta', 'verdura', 'pasti_pronti', 'bevande', 'altro'],
      default: 'altro',
    },
    quantita: {
      type: String,
      required: true,
      example: '5 pezzi, 2 kg, 1 pacco',
    },
    data_scadenza: {
      type: Date,
      required: [true, 'La data di scadenza è obbligatoria'],
    },
    orario_ritiro_inizio: {
      type: String,
      required: true,
      example: '18:00',
    },
    orario_ritiro_fine: {
      type: String,
      required: true,
      example: '20:00',
    },
    zona: {
      type: String,
      required: [true, 'La zona è obbligatoria'],
      example: 'Bergamo Centro, Via Roma 10',
    },
    latitudine: {
      type: Number,
      default: null,
    },
    longitudine: {
      type: Number,
      default: null,
    },
    foto: {
      type: [String], // Array di URL immagini
      default: [],
    },
    utente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utente',
      required: true,
    },
    nome_utente: {
      type: String,
      required: true,
    },
    telefono_utente: {
      type: String,
      default: null,
    },
    allergie_info: {
      type: String,
      default: null,
      example: 'Contiene glutine',
    },
    diete: {
      type: [String],
      enum: ['vegetariano', 'vegano', 'halal', 'kosher', 'senza_glutine', 'nessuno'],
      default: ['nessuno'],
    },
    stato: {
      type: String,
      enum: ['disponibile', 'ritirato', 'scaduto', 'cancellato'],
      default: 'disponibile',
    },
    numero_ritiri: {
      type: Number,
      default: 0,
    },
    creato_il: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indice per ricerca per zona
annunciSchema.index({ zona: 'text', titolo: 'text', descrizione: 'text' });

// Indice per geolocalizzazione
annunciSchema.index({ latitudine: '2dsphere', longitudine: '2dsphere' });

const annunci = mongoose.model('annunci', annunciSchema);
export default annunci;
