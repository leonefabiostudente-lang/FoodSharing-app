<script setup>
import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();
const content = ref('Caricamento...');

onMounted(async () => {
  try {
    const res = await fetch('/presentation.md');
    const text = await res.text();
    content.value = md.render(text);
  } catch (e) {
    content.value = '<p>Errore caricamento presentazione.</p>';
  }
});
</script>

<template>
  <div class="presentation container mt-4">
    <div v-html="content"></div>
  </div>
</template>

<style scoped>
.presentation h1 { font-size: 2rem; margin-top: 1rem; }
.presentation pre { background:#f5f5f5; padding:10px; }
</style>
