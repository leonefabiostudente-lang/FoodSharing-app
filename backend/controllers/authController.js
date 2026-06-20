import Utente from '../models/Utente.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

    // Genera token di verifica
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h

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
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires
    });

    await nuovoUtente.save();

    // Invia email di verifica (se configurata)
    const emailResult = await sendVerificationEmail(email, verificationToken);

    const responsePayload = {
      message: 'Registrazione avvenuta con successo! Controlla la tua email per convalidare l\'indirizzo.'
    };

    if (emailResult?.verificationLink) {
      responsePayload.message = 'Registrazione avvenuta con successo! Usa il link di verifica per completare la registrazione.';
      responsePayload.verificationLink = emailResult.verificationLink;
    }

    res.status(201).json(responsePayload);

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

    if (!utente.isVerified) {
      return res.status(401).json({ error: 'Email non verificata. Controlla la tua casella di posta.' });
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

// Invio email di verifica
async function sendVerificationEmail(email, token) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${frontendUrl}/verify?token=${token}`;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.log('SMTP non configurato. Link verifica:', verificationLink);
    return { verificationLink };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || smtpUser,
    to: email,
    subject: 'Conferma la tua email - Antispreco',
    text: `Segui il link per confermare la tua email: ${verificationLink}`,
    html: `<p>Per confermare la tua email clicca il link seguente:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`
  });

  console.log('Email verifica inviata:', info.messageId);
}

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Token mancante' });
    }

    const utente = await Utente.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!utente) {
      return res.status(400).json({ error: 'Token non valido o scaduto' });
    }

    utente.isVerified = true;
    utente.verificationToken = undefined;
    utente.verificationTokenExpires = undefined;

    await utente.save();

    res.json({ message: 'Email verificata con successo!' });
  } catch (error) {
    console.error('ERRORE verifyEmail:', error);
    res.status(500).json({ error: 'Errore server: ' + error.message });
  }
};