<template>
  <main class="content-wrapper">
    <h1>Migliori spiagge per famiglie a Tropea</h1>

    <p class="intro">Guida rapida alle spiagge più adatte ai bambini: sabbia morbida, fondale basso e servizi utili.</p>

    <h2>Spiagge consigliate</h2>
    <ul class="compact-list">
      <li><strong>Spiaggia del Centro:</strong> facile accesso, servizi e stabilimenti attrezzati.</li>
      <li><strong>Cala della Sorgente:</strong> fondale basso e acque calme, ideale per bambini.</li>
      <li><strong>Spiaggetta tranquilla:</strong> perfetta per chi cerca pace e sabbia fine.</li>
    </ul>

    <h2>Consigli per le famiglie</h2>
    <ul class="compact-list">
      <li>Porta ombrellone e giochi: alcune aree sono libere e senza noleggio.</li>
      <li>Verifica presenza di servizi igienici e punti ristoro.</li>
      <li>Scegli orari meno affollati per godere della spiaggia in tranquillità.</li>
    </ul>

    <router-link class="btn-primary" to="/eventi">Scopri eventi in spiaggia</router-link>
  </main>
</template>

<script>
export default {
  mounted() {
    document.title = "Migliori spiagge per famiglie a Tropea";
    let meta = document.head.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Scopri le migliori spiagge per famiglie a Tropea: consigli pratici, servizi e quando andare.');
  }
}
</script>

<style scoped>
.content-wrapper { max-width: 820px; margin: 1.5rem auto; padding: 1rem; }
.compact-list { padding-left: 1rem; margin-bottom: 1rem; }
.intro { margin-bottom: 1rem; }
.btn-primary { display: inline-block; margin-top: 0.75rem; padding: 0.6rem 1rem; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none; }
</style>
