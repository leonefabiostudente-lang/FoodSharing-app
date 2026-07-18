# SEO Go-Live Checklist (Vivere Tropea)

## Stato attuale (aggiornato)
- [x] Redirect host configurati in frontend/vercel.json (da validare live su dominio).
- [x] robots.txt e sitemap.xml pubblici presenti.
- [x] Canonical home e canonical dinamico pagine evento implementati.
- [x] JSON-LD WebSite (home) e JSON-LD Event (dettaglio evento) implementati.
- [x] Tracking GA4 base implementato: page view SPA + eventi custom.
- [x] Sitemap con URL evento reali generabile via script npm.
- [ ] Verifica Search Console Domain property (DNS) e invio sitemap.
- [ ] Verifica Bing Webmaster Tools.
- [ ] Verifica finale redirect/canonical/indexing in produzione.

## 1) Dominio canonico
- Impostare dominio canonico: https://www.viveretropea.it
- Reindirizzare con 301:
  - http://viveretropea.it -> https://www.viveretropea.it
  - https://viveretropea.it -> https://www.viveretropea.it
  - http://www.viveretropea.com -> https://www.viveretropea.it
  - https://www.viveretropea.com -> https://www.viveretropea.it
  - http://viveretropea.com -> https://www.viveretropea.it
  - https://viveretropea.com -> https://www.viveretropea.it

## 2) Vercel project settings
- Aggiungere tutti i domini al progetto Vercel.
- Impostare https://www.viveretropea.it come Primary Domain.
- Verificare che i redirect host in vercel.json siano attivi.

## 3) File SEO pubblici
- Verificare raggiungibilita:
  - /robots.txt
  - /sitemap.xml
- Verificare canonical nella home e nelle pagine evento.

## 4) Google Search Console
- Aggiungere proprieta Domain: viveretropea.it
- Verifica DNS TXT nel provider dominio.
- Inviare sitemap: https://www.viveretropea.it/sitemap.xml
- Richiedere indicizzazione per:
  - /
  - /eventi
  - 3-5 pagine evento reali
- Monitorare Copertura, Core Web Vitals, Miglioramenti.

## 5) Bing Webmaster Tools
- Aggiungere proprieta dominio.
- Importare sitemap.
- Usare URL Inspection su home e pagine evento principali.

## 6) Dati strutturati
- Verificare con Rich Results Test:
  - JSON-LD WebSite in home
  - JSON-LD Event in dettaglio evento
- Correggere eventuali warning su date, location, organizer.

## 7) Performance
- Lighthouse mobile >= 80 per Performance e SEO.
- Ottimizzare immagini (WebP/AVIF quando possibile).
- Evitare JS non necessario nelle viste principali.

## 8) Contenuti per ranking locale
- Titoli eventi con localita (Tropea, Capo Vaticano, Pizzo, Vibo).
- Descrizioni uniche e complete, no duplicati.
- Pubblicazione costante di eventi aggiornati.
- Backlink locali (portali turistici, associazioni, comuni).

## 9) Tracking base
- [x] Attivare analytics (es. Plausible o GA4).
- [x] Tracciare:
  - visualizzazione pagina evento
  - click contatto organizzatore
  - click pubblica evento

### Note implementative tracking
- Inizializzazione GA4 e helper eventi: frontend/src/services/analytics.js
- Page view su cambio route SPA: frontend/src/main.js
- Click contatto organizzatore: frontend/src/components/ListaAnnunci.vue, frontend/src/views/EventoDettaglioView.vue
- Click pubblica evento: frontend/src/components/FormAnnuncio.vue

### Note implementative sitemap
- Script generazione sitemap con URL evento reali: frontend/scripts/generate-sitemap.mjs
- Comando: npm run sitemap:generate

## 10) Verifica finale
- Testare redirect da .com e non-www.
- Testare canonical su home e dettaglio evento.
- Testare indexing entro 48-72 ore dopo invio sitemap.
