<script setup>
import { ref, onMounted, watch } from "vue";

const annunci = ref([]);
const loading = ref(true);
const errore = ref(null);
const filtroZona = ref("");

// Funzione che chiama il backend con filtro
async function caricaAnnunci() {
  loading.value = true;

  try {
    const url = filtroZona.value
      ? `https://antispreco-app-2.onrender.com/api/annunci?zona=${encodeURIComponent(filtroZona.value)}`
      : `https://antispreco-app-2.onrender.com/api/annunci`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Errore nel caricamento degli annunci");

    annunci.value = await res.json();
  } catch (err) {
    errore.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(caricaAnnunci);

// Ricarica gli annunci quando cambia il filtro
watch(filtroZona, () => {
  caricaAnnunci();
});
</script>


<template>
  <input 
  v-model="filtroZona"
  type="text"
  placeholder="Cerca per zona (es. Sarnico, Predore...)"
  class="search-input"
/>

  <div>
    <h2>Annunci disponibili</h2>

    <!-- Stato di caricamento -->
    <div v-if="loading">Caricamento in corso...</div>

    <!-- Errore -->
    <div v-if="errore">{{ errore }}</div>

    <!-- Nessun annuncio -->
    <div v-if="!loading && annunci.length === 0">
      Nessun annuncio presente.
    </div>

    <!-- Lista annunci -->
    <div v-for="a in annunci" :key="a._id" class="annuncio">
      <h3>{{ a.titolo }}</h3>
      <p>{{ a.descrizione }}</p>

      <p><strong>Categoria:</strong> {{ a.categoria }}</p>
      <p><strong>Quantità:</strong> {{ a.quantita }}</p>
      <p><strong>Zona:</strong> {{ a.zona }}</p>

      <p>
        <strong>Disponibile fino al:</strong>
        {{ new Date(a.data_scadenza).toLocaleDateString() }}
      </p>

      <p>
        <strong>Ritiro:</strong>
        {{ a.orario_ritiro_inizio }} - {{ a.orario_ritiro_fine }}
      </p>

      <p>
        <strong>Pubblicato da:</strong>
        {{ a.nome_utente || "Utente sconosciuto" }}
      </p>

      <p>
        <strong>Telefono:</strong>
        {{ a.telefono_utente || "Non disponibile" }}
      </p>

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
.search-input {
  width: 100%;
  padding: 10px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

</style>

