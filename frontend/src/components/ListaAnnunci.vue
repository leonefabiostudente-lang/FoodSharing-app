<script setup>
import { ref, onMounted } from "vue";

const annunci = ref([]);

async function caricaAnnunci() {
  const res = await fetch("https://antispreco-app-2.onrender.com/api/annunci");
  annunci.value = await res.json();
}

onMounted(() => {
  caricaAnnunci();
});
</script>

<template>
  <div>
    <h2>Annunci disponibili</h2>

    <div v-if="annunci.length === 0">
      Nessun annuncio presente.
    </div>

    <div v-for="a in annunci" :key="a._id" class="annuncio">
      <h3>{{ a.titolo }}</h3>
      <p>{{ a.descrizione }}</p>
      <p><strong>Categoria:</strong> {{ a.categoria }}</p>
      <p><strong>Quantità:</strong> {{ a.quantita }}</p>
      <p><strong>Zona:</strong> {{ a.zona }}</p>
      <p><strong>Disponibile fino al:</strong> {{ new Date(a.data_scadenza).toLocaleDateString() }}</p>
      <p><strong>Ritiro:</strong> {{ a.orario_ritiro_inizio }} - {{ a.orario_ritiro_fine }}</p>
      <p><strong>Contatto:</strong> {{ a.nome_utente }} ({{ a.telefono_utente || "N/D" }})</p>
      <hr>
    </div>
  </div>
</template>

<style>
.annuncio {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
}
</style>
