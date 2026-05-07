import express from 'express';
import Utente from '../models/Utente.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

/* ============================
   REGISTRAZIONE
============================ */
router.post('/register', async (req, res) => {
  try {
    const {
      tipo,                // privato | associazione | commerciante
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

    // Controlli specifici per tipo utente
    if (tipo === "privato" && (!nome || !cognome)) {
      return res.status(400).json({ error: "Nome e cognome obbligatori per i privati!" });
    }

    if (tipo === "associazione" && (!nome_associazione || !partita_iva)) {
      return res.status(400).json({ error: "Nome associazione e partita IVA obbligatori!" });
    }

    if (tipo === "commerciante" && (!nome_attivita || !partita_iva)) {
      return res.status(400).json({ error: "Nome attività e partita IVA obbligatori!" });
    }

    // Controllo email duplicata
    const utenteEsistente = await Utente.findOne({ email });
    if (utenteEsistente) {
      return res.status(400).json({ error: 'Email già registrata!' });
    }

    // Hash password
    const hash = await bcryptjs.hash(password, 10);

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
      password: hash
    });

    await nuovoUtente.save();

    res.status(201).json({ message: 'Registrazione avvenuta con successo!' });

  } catch (error) {
    res.status(500).json({ error: 'Errore server: ' + error.message });
  }
});

/* ============================
   LOGIN
============================ */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password obbligatorie!' });
    }

    // Recupero utente con password
    const utente = await Utente.findOne({ email }).select('+password');
    if (!utente) {
      return res.status(400).json({ error: 'Credenziali non valide!' });
    }

    // Confronto password
    const isMatch = await bcryptjs.compare(password, utente.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenziali non valide!' });
    }

    // Generazione token
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
    res.status(500).json({ error: 'Errore server: ' + error.message });
  }
});

export default router;
