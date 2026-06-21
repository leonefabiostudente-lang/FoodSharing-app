---
# FoodSharing App — Presentazione progetto
## Maturità
### Autore: Fabio Leone
---
## Agenda
- Obiettivo del progetto
- Architettura e stack
- Flussi principali (registrazione, verifica, login)
- Dettagli tecnici e file chiave
- Deploy e problemi risolti
- Sicurezza e miglioramenti futuri
- Demo e comandi utili
---
## Obiettivo
- Applicazione web per condividere annunci (donazione/recupero cibo)
- Full‑stack: UI reattiva per utenti e sistema backend per autenticazione e gestione annunci
---
## Architettura generale
- Frontend: Vue 3 + Vite + Vue Router
- Backend: Node.js (ESM) + Express + Mongoose
- DB: MongoDB Atlas
- Email transactional: SendGrid (variabili d'ambiente)
- Deployment: Frontend su Vercel, Backend su Render
---
## Tecnologie principali
- `Vue 3`, `Vite` — SPA, routing client-side
- `Express` — API REST
- `Mongoose` — ODM per MongoDB
- `bcryptjs` — hashing password
- `jsonwebtoken` — autenticazione via token
- `@sendgrid/mail` — invio email di verifica
---
## Flusso: registrazione e verifica
1. Frontend invia POST `/api/register` con dati utente
2. Backend crea `Utente` con `verificationToken` e `verificationTokenExpires`
3. Backend invia email con link: `FRONTEND_URL/verify?token=...`
4. Frontend cattura token e chiama GET `/api/verify/:token`
5. Backend valida token e aggiorna `isVerified: true`
---
## File chiave (esempi)
- `backend/server.js` — bootstrap, connessione DB, CORS
- `backend/controllers/authController.js` — register, login, sendVerificationEmail
- `backend/.env` — variabili d'ambiente (DB, JWT, SENDGRID...)
- `frontend/src/views/Verify.vue` — pagina che chiama l'API di verifica
- `frontend/vercel.json` — rewrite per SPA su Vercel
---
## Problemi risolti durante lo sviluppo
- Invio email in produzione: timeout SMTP su Render → integrazione con SendGrid API
- Route SPA su Vercel: 404 su `/verify` → aggiunto `vercel.json` con rewrite a `index.html`
- `.env` accidentalmente committato → indicazioni per rimuoverlo e usare variabili d'ambiente
---
## Sicurezza e best practices usate
- Password hashed con `bcryptjs`
- Segreti memorizzati in variabili d'ambiente (non in repo)
- Validazione minima input lato server (consigliata estensione con `Joi`/`zod`)
- Proteggere endpoint sensibili con rate limiting
---
## Miglioramenti futuri (priorità)
- Validazione e sanitizzazione input completa
- Refresh token e revoca JWT
- Storage immagini con S3/Cloudinary
- Monitoraggio e alerting (Sentry)
- Migrazione a provider email alternativo o fallback robusto
---
## Miglioramenti opzionali
- Ricerca avanzata e full‑text (Elastic/AppSearch)
- Microservizi per scalabilità
- Internazionalizzazione e accessibilità (WCAG)
---
## Comandi utili per demo locale
```bash
# Backend
cd backend
npm install
$env:SENDGRID_API_KEY="<key>"; $env:SENDGRID_FROM="you@example.com"; npm run dev

# Frontend
cd frontend
npm install
npm run dev
```
---
## Suggerimento per l'orale (script breve)
- 0:30 — Introduzione progetto e scopo
- 1:00 — Architettura e stack (mostra diagramma/slide)
- 1:30 — Flusso registrazione/verifica (mostra file e demo)
- 2:30 — Problemi incontrati e soluzioni (SendGrid, Vercel rewrite)
- 3:00 — Miglioramenti futuri e conclusione
---
## Link ai file principali (workspace)
- backend/server.js
- backend/controllers/authController.js
- frontend/src/views/Verify.vue
- frontend/vercel.json
---
## Note finali
- Se vuoi, converto queste slide in PDF (ti do i comandi) o genero un set di slide reveal.js pronto per la pubblicazione.
