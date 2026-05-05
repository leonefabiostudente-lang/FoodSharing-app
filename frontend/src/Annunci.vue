<template>
  <div>
    <h2 class="page-title">Annunci disponibili</h2>

    <div class="annunci-grid">
      <div v-for="a in annunci" :key="a._id" class="card annuncio-card">
        <h3>{{ a.titolo }}</h3>
        <p>{{ a.descrizione }}</p>

        <span class="categoria-tag">{{ a.categoria }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const annunci = ref([]);

onMounted(async () => {
  const res = await axios.get("https://antispreco-app-2.onrender.com/api/annunci");
  annunci.value = res.data;
});
</script>

<style>
.annunci-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.annuncio-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.annuncio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.categoria-tag {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  margin-top: 10px;
}
</style>

