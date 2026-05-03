import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const utenteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Il nome è obbligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email è obbligatoria'],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Email non valida'],
    },
    password: {
      type: String,
      required: [true, 'La password è obbligatoria'],
      minlength: 6,
      select: false, // Non ritorna la password per default
    },
    telefono: {
      type: String,
      default: null,
    },
    tipo: {
      type: String,
      enum: ['privato', 'negozio', 'associazione'],
      default: 'privato',
    },
    zona: {
      type: String,
      default: null,
    },
    indirizzo: {
      type: String,
      default: null,
    },
    foto_profilo: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
      maxlength: 500,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    numero_annunci: {
      type: Number,
      default: 0,
    },
    creato_il: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Aggiunge createdAt e updatedAt
  }
);

// Hash della password prima di salvare
utenteSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Metodo per confrontare password
utenteSchema.methods.compara_password = async function (passwordInserita) {
  return await bcryptjs.compare(passwordInserita, this.password);
};

const Utente = mongoose.model('Utente', utenteSchema);
export default Utente;