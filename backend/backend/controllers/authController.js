import Utente from '../models/Utente.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
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
      responsePayload.verificationLink = emailResult.verificationLink;
    }

    if (emailResult?.verificationApiLink) {
      responsePayload.verificationApiLink = emailResult.verificationApiLink;
    }

    if (emailResult?.deliveryStatus === 'sent') {
      responsePayload.message = 'Registrazione avvenuta con successo! Ti abbiamo inviato un\'email di conferma.';
    } else if (emailResult?.deliveryStatus === 'not_configured') {
      responsePayload.message = 'Registrazione avvenuta con successo! Invio email non configurato: usa il link di verifica per completare la registrazione.';
    } else if (emailResult?.deliveryStatus === 'failed') {
      responsePayload.message = 'Registrazione avvenuta con successo, ma l\'invio email non è riuscito. Usa il link di verifica per completare la registrazione.';
    }

    if (emailResult?.deliveryStatus) {
      responsePayload.deliveryStatus = emailResult.deliveryStatus;
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email obbligatoria!' });
    }

    const utente = await Utente.findOne({ email });

    if (!utente) {
      return res.status(200).json({
        message: 'Se l\'email è registrata, riceverai un link per reimpostare la password.'
      });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1h

    utente.resetPasswordToken = resetPasswordToken;
    utente.resetPasswordExpires = resetPasswordExpires;

    await utente.save();

    const emailResult = await sendPasswordResetEmail(email, resetPasswordToken);

    const responsePayload = {
      message: 'Se l\'email è registrata, riceverai un link per reimpostare la password.'
    };

    if (emailResult?.resetLink) {
      responsePayload.resetLink = emailResult.resetLink;
    }

    if (emailResult?.deliveryStatus) {
      responsePayload.deliveryStatus = emailResult.deliveryStatus;
    }

    res.json(responsePayload);
  } catch (error) {
    console.error('ERRORE forgotPassword:', error);
    res.status(500).json({ error: 'Errore server: ' + error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token e password sono obbligatori!' });
    }

    const utente = await Utente.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password');

    if (!utente) {
      return res.status(400).json({ error: 'Token non valido o scaduto' });
    }

    const salt = await bcryptjs.genSalt(10);
    utente.password = await bcryptjs.hash(password, salt);
    utente.resetPasswordToken = undefined;
    utente.resetPasswordExpires = undefined;

    await utente.save();

    res.json({ message: 'Password reimpostata con successo!' });
  } catch (error) {
    console.error('ERRORE resetPassword:', error);
    res.status(500).json({ error: 'Errore server: ' + error.message });
  }
};

const sendgridConfigured = Boolean(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM);
if (sendgridConfigured) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const smtpConfigured = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.SMTP_FROM
);

let smtpTransporter;
if (smtpConfigured) {
  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendViaSendGrid({ to, subject, text, html }) {
  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM,
    subject,
    text,
    html
  });
}

async function sendViaSmtp({ to, subject, text, html }) {
  await smtpTransporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html
  });
}

async function sendEmailWithFallback({ to, subject, text, html }) {
  if (sendgridConfigured) {
    try {
      await sendViaSendGrid({ to, subject, text, html });
      console.log('Email inviata via SendGrid');
      return { deliveryStatus: 'sent', provider: 'sendgrid' };
    } catch (err) {
      console.error('Errore invio email (SendGrid):', err?.response?.body || err);
    }
  }

  if (smtpConfigured) {
    try {
      await sendViaSmtp({ to, subject, text, html });
      console.log('Email inviata via SMTP');
      return { deliveryStatus: 'sent', provider: 'smtp' };
    } catch (err) {
      console.error('Errore invio email (SMTP):', err);
      return { deliveryStatus: 'failed', provider: 'smtp' };
    }
  }

  if (!sendgridConfigured && !smtpConfigured) {
    console.warn('Nessun provider email configurato (SendGrid/SMTP).');
    return { deliveryStatus: 'not_configured' };
  }

  return { deliveryStatus: 'failed' };
}

async function sendVerificationEmail(email, token) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${frontendUrl}/verify?token=${token}`;
  const backendPublicUrl = process.env.BACKEND_PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || '';
  const verificationApiLink = backendPublicUrl ? `${backendPublicUrl}/api/verify/${token}?redirect=1` : null;

  const textBody = verificationApiLink
    ? `Segui il link principale per confermare la tua email: ${verificationLink}\n\nSe il link non funziona, usa questo link alternativo: ${verificationApiLink}`
    : `Segui il link per confermare la tua email: ${verificationLink}`;

  const htmlBody = verificationApiLink
    ? `<p>Per confermare la tua email clicca il link seguente:</p><p><a href="${verificationLink}">${verificationLink}</a></p><p>Se il link non funziona, usa questo link alternativo:</p><p><a href="${verificationApiLink}">${verificationApiLink}</a></p>`
    : `<p>Per confermare la tua email clicca il link seguente:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`;

  const msg = {
    to: email,
    subject: 'Conferma la tua email - Antispreco',
    text: textBody,
    html: htmlBody
  };

  const emailDelivery = await sendEmailWithFallback(msg);
  if (emailDelivery.deliveryStatus !== 'sent') {
    console.log('Link verifica (fallback):', verificationLink);
  }

  return { verificationLink, verificationApiLink, ...emailDelivery };
}

async function sendPasswordResetEmail(email, token) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  const msg = {
    to: email,
    subject: 'Reset password - Antispreco',
    text: `Segui il link per reimpostare la password: ${resetLink}`,
    html: `<p>Per reimpostare la password clicca il link seguente:</p><p><a href="${resetLink}">${resetLink}</a></p>`
  };

  const emailDelivery = await sendEmailWithFallback(msg);
  if (emailDelivery.deliveryStatus !== 'sent') {
    console.log('Link reset password (fallback):', resetLink);
  }

  return { resetLink, ...emailDelivery };
}

export const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token || req.query.token;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectRequested = req.query.redirect === '1';
    const acceptsHtml = (req.headers.accept || '').includes('text/html');
    const shouldRedirect = redirectRequested || acceptsHtml;

    if (!token) {
      if (shouldRedirect) {
        return res.redirect(`${frontendUrl}/login?verified=0&reason=missing_token`);
      }
      return res.status(400).json({ error: 'Token mancante' });
    }

    const utente = await Utente.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!utente) {
      if (shouldRedirect) {
        return res.redirect(`${frontendUrl}/login?verified=0&reason=invalid_or_expired`);
      }
      return res.status(400).json({ error: 'Token non valido o scaduto' });
    }

    utente.isVerified = true;
    utente.verificationToken = undefined;
    utente.verificationTokenExpires = undefined;

    await utente.save();

    if (shouldRedirect) {
      return res.redirect(`${frontendUrl}/login?verified=1`);
    }

    res.json({ message: 'Email verificata con successo!' });
  } catch (error) {
    console.error('ERRORE verifyEmail:', error);
    res.status(500).json({ error: 'Errore server: ' + error.message });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email obbligatoria!' });
    }

    const utente = await Utente.findOne({ email });

    // Evita user enumeration: risposta neutra anche se email non esiste.
    if (!utente) {
      return res.status(200).json({
        message: 'Se l\'account esiste e non è verificato, riceverai una nuova email di conferma.'
      });
    }

    if (utente.isVerified) {
      return res.status(200).json({
        message: 'Questo account è già verificato.'
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    utente.verificationToken = verificationToken;
    utente.verificationTokenExpires = verificationTokenExpires;
    await utente.save();

    const emailResult = await sendVerificationEmail(email, verificationToken);

    const responsePayload = {
      message: 'Se l\'account esiste e non è verificato, riceverai una nuova email di conferma.'
    };

    if (emailResult?.verificationLink) {
      responsePayload.verificationLink = emailResult.verificationLink;
    }

    if (emailResult?.verificationApiLink) {
      responsePayload.verificationApiLink = emailResult.verificationApiLink;
    }

    if (emailResult?.deliveryStatus) {
      responsePayload.deliveryStatus = emailResult.deliveryStatus;
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error('ERRORE resendVerificationEmail:', error);
    return res.status(500).json({ error: 'Errore server: ' + error.message });
  }
};