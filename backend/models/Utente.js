import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const utenteSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Email non valida'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    telefono: String,
    tipo: {
      type: String,
      enum: ['privato', 'negozio', 'associazione'],
      default: 'privato',
    },
    zona: String,
    indirizzo: String,
    foto_profilo: String,
    bio: { type: String, maxlength: 500 },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    numero_annunci: { type: Number, default: 0 },
    creato_il: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hash password prima del salvataggio
utenteSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Metodo per confrontare password
utenteSchema.methods.compara_password = function (passwordInserita) {
  return bcryptjs.compare(passwordInserita, this.password);
};

const Utente = mongoose.model('Utente', utenteSchema);
export default Utente;
