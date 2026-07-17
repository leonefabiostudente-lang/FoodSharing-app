import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // 1️⃣ Recupera il token dall'header Authorization
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Accesso negato! Token mancante.' });
  }

  // 2️⃣ Estrae il token rimuovendo il prefisso "Bearer " se presente
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    // 3️⃣ Verifica il token con la chiave segreta salvata nel file .env
    const verificato = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4️⃣ Salva i dati dell'utente (id, nome, tipo) nella richiesta Express
    req.utente = verificato;
    
    // Prosegue verso la rotta successiva (es. la creazione dell'annuncio)
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token non valido o scaduto!' });
  }
};

export default auth;

