import Utente from '../models/Utente.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

/* ============================
   REGISTRAZIONE
============================ */
export const register = async (req, res) => {
  try {
    const {
      tipo,
      nome,
      cognome,
      nome_associazione,
      nome_attivita,
      partita_iva,
      categoria_attivita,
      email,
      password
    } = req.body;

    // Controlli base
    if (!tipo || !email || !password) {
      return res.status(400).json({
        error: 'Tipo utente, email e password sono obbligatori!'
      });
    }

    // Controlli specifici
    if (tipo === "privato" && (!nome || !cognome)) {
      return res.status(400).json({
        error: "Nome e cognome obbligatori per i privati!"
      });
    }

    if (tipo === "associazione" && (!nome_associazione || !partita_iva)) {
      return res.status(400).json({
        error: "Nome associazione e partita IVA obbligatori!"
      });
    }

    if (tipo === "commerciante" && (!nome_attivita || !partita_iva)) {
      return res.status(400).json({
        error: "Nome attività e partita IVA obbligatori!"
      });
    }

    // Controllo email duplicata
    const utenteEsistente = await Utente.findOne({ email });
    if (utenteEsistente) {
      return res.status(400).json({
        error: 'Email già registrata!'
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Creazione utente
    const nuovoUtente = new Utente({
      tipo,
      nome,
      cognome,
      nome_associazione,
      nome_attivita,
      partita_iva,
      categoria_attivita,
      email,
      password: hashedPassword
    });

    await nuovoUtente.save();

    res.status(201).json({
      message: 'Registrazione avvenuta con successo!'
    });

  } catch (error) {
    console.error("ERRORE REGISTER:", error);
    res.status(500).json({
      error: 'Errore server: ' + error.message
    });
  }
};

/* ============================
   LOGIN
============================ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e password obbligatorie!'
      });
    }

    // Trova utente (inclusa password)
    const utente = await Utente.findOne({ email }).select('+password');

    if (!utente) {
      return res.status(400).json({
        error: 'Credenziali non valide!'
      });
    }

    // Confronto password
    const isMatch = await bcryptjs.compare(password, utente.password);

    if (!isMatch) {
      return res.status(400).json({
        error: 'Credenziali non valide!'
      });
    }

    // Token JWT
    const token = jwt.sign(
      {
        id: utente._id,
        tipo: utente.tipo,
        email: utente.email,
        nome: utente.nome || utente.nome_associazione || utente.nome_attivita
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      utente: {
        id: utente._id,
        tipo: utente.tipo,
        email: utente.email,
        nome: utente.nome || utente.nome_associazione || utente.nome_attivita
      }
    });

  } catch (error) {
    console.error("ERRORE LOGIN:", error);
    res.status(500).json({
      error: 'Errore server: ' + error.message
    });
  }
};