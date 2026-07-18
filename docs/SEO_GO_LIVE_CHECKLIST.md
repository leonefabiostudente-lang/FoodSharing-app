# SEO Go-Live Checklist (Vivere Tropea)

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
- Attivare analytics (es. Plausible o GA4).
- Tracciare:
  - visualizzazione pagina evento
  - click contatto organizzatore
  - click pubblica evento

## 10) Verifica finale
- Testare redirect da .com e non-www.
- Testare canonical su home e dettaglio evento.
- Testare indexing entro 48-72 ore dopo invio sitemap.
