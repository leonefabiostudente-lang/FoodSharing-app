<template>
  <main class="content-wrapper">
    <h1>Cosa fare a Tropea quando piove</h1>

    <p class="intro">Attività al coperto e alternative per godersi Tropea anche in giornate piovose.</p>

    <h2>Attività al coperto</h2>
    <ul class="compact-list">
      <li><strong>Musei e visite guidate:</strong> scopri storia e cultura locale.</li>
      <li><strong>Caffè e pasticcerie tipiche:</strong> assaggia dolci locali e prodotti artigianali.</li>
      <li><strong>Eventi indoor:</strong> concerti, mostre e conferenze segnalate sulla piattaforma.</li>
    </ul>

    <h2>Consigli pratici</h2>
    <ul class="compact-list">
      <li>Controlla gli eventi in programma per trovare attività al coperto.</li>
      <li>Verifica gli orari di apertura di musei e locali.</li>
      <li>Considera escursioni vicine con ripari o luoghi coperti.</li>
    </ul>

    <router-link class="btn-primary" to="/eventi">Cerca eventi al coperto</router-link>
  </main>
</template>

<script>
export default {
  mounted() {
    document.title = "Cosa fare a Tropea quando piove";
    let meta = document.head.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Idee e suggerimenti su cosa fare a Tropea quando piove: musei, caffè tipici, eventi indoor e consigli pratici.');
  }
}
</script>

<style scoped>
.content-wrapper { max-width: 820px; margin: 1.5rem auto; padding: 1rem; }
.compact-list { padding-left: 1rem; margin-bottom: 1rem; }
.intro { margin-bottom: 1rem; }
.btn-primary { display: inline-block; margin-top: 0.75rem; padding: 0.6rem 1rem; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none; }
</style>
