import express from 'express';
import Utente from '../models/Utente.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// REGISTRAZIONE
router.post('/register', async (req, res) => {
  try {
    const { nome, email, password, tipo } = req.body;
    if (!nome || !email || !password) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori!' });
    }
    const utenteEsistente = await Utente.findOne({ email });
    if (utenteEsistente) {
      return res.status(400).json({ error: 'Email già registrata!' });
    }
    const nuovoUtente = new Utente({ nome, email, password, tipo });
    await nuovoUtente.save();
    res.status(201).json({ message: 'Registrazione avvenuta con successo!' });
  } catch (error) {
    res.status(500).json({ error: 'Errore server: ' + error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password obbligatorie!' });
    }
    const utente = await Utente.findOne({ email }).select('+password');
    if (!utente) {
      return res.status(400).json({ error: 'Credenziali non valide!' });
    }
    const isMatch = await utente.compara_password(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenziali non valide!' });
    }
    const token = jwt.sign(
      { id: utente._id, nome: utente.nome, email: utente.email, tipo: utente.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({
      token,
      utente: { id: utente._id, nome: utente.nome, email: utente.email, tipo: utente.tipo }
    });
  } catch (error) {
    res.status(500).json({ error: 'Errore server: ' + error.message });
  }
});

export default router;