<template>
  <main class="content-wrapper">
    <h1>Dove parcheggiare a Tropea vicino al centro</h1>

    <p class="intro">Suggerimenti pratici per trovare parcheggio comodo e sicuro a pochi passi dal centro storico di Tropea.</p>

    <h2>Opzioni di parcheggio</h2>
    <ul class="compact-list">
      <li><strong>Parcheggio Lungomare:</strong> comodo per chi arriva in auto, a 5-10 minuti a piedi dal centro.</li>
      <li><strong>Parcheggio Piazza:</strong> ideale per visite brevi e per accedere alle vie principali.</li>
      <li><strong>Parcheggi pubblici</strong> e aree di sosta a pagamento durante l'alta stagione.</li>
    </ul>

    <h2>Consigli pratici</h2>
    <ul class="compact-list">
      <li>Arriva nelle ore mattutine per trovare posto più facilmente.</li>
      <li>Verifica segnaletica e orari a pagamento: molte aree hanno limiti estivi.</li>
      <li>Considera il parcheggio scambiato con navetta per i giorni di festa.</li>
    </ul>

    <h2>Vuoi sapere gli eventi vicini?</h2>
    <p>Controlla gli eventi in programma per evitare giornate di traffico elevato.</p>
    <router-link class="btn-primary" to="/eventi">Guarda gli eventi a Tropea</router-link>
  </main>
</template>

<script>
export default {
  mounted() {
    document.title = "Dove parcheggiare a Tropea vicino al centro";
    let meta = document.head.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Scopri dove parcheggiare a Tropea vicino al centro: opzioni, consigli pratici e link agli eventi locali.');
  }
}
</script>

<style scoped>
.content-wrapper { max-width: 820px; margin: 1.5rem auto; padding: 1rem; }
.compact-list { padding-left: 1rem; margin-bottom: 1rem; }
.intro { margin-bottom: 1rem; }
.btn-primary { display: inline-block; margin-top: 0.75rem; padding: 0.6rem 1rem; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none; }
</style>
