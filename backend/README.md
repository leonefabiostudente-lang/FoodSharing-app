# Antispreco - Backend (setup rapido)

Questo file spiega come configurare e avviare il backend, con focus sulla convalida email.

## Passaggi rapidi

1. Copia l'esempio `.env.example` in `.env` e inserisci le tue credenziali:

```env
# SMTP (usato per inviare email di verifica)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="Antispreco <no-reply@antispreco.example.com>"

# URL frontend (link di verifica)
FRONTEND_URL=http://localhost:5173

# Secret per JWT
JWT_SECRET=una_secret_strong
```

2. Installa le dipendenze (incluso `nodemailer`):

```bash
cd backend
npm install
```

3. Avvia il server in sviluppo:

```bash
npm run dev
```

## Test della verifica email

- Se SMTP è configurato correttamente, le email di verifica saranno inviate all'indirizzo specificato dal nuovo utente.
- Se SMTP non è configurato, l'app stamperà in console il link di verifica (utile per sviluppo): cerca "Link verifica" o controlla i log del server.
- Il link punta a `FRONTEND_URL/verify?token=...` e il frontend chiamerà la rotta backend `/api/verify/:token`.

## Nota

- Assicurati di avere `FRONTEND_URL` corretto (es. URL locale o produzione).
- Mantieni `JWT_SECRET` segreto e sicuro.
