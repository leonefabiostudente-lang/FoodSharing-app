<template>
  <div class="page-wrapper">
    <ListaAnnunci />
  </div>
</template>
<script setup>
import ListaAnnunci from '../components/ListaAnnunci.vue';

import { onMounted } from 'vue';

function upsertMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}='${name}']`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

onMounted(() => {
  document.title = 'Eventi a Tropea — Cosa fare oggi';
  upsertMeta('description', 'Elenco aggiornato di eventi a Tropea: concerti, sagre e attività locali. Filtra per zona e trova eventi vicino a te.');
});
</script>