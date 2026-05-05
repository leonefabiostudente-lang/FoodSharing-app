<script setup>
import { ref } from "vue";

// Recupero token
const token = localStorage.getItem("token");

// Campi del form
const titolo = ref("");
const descrizione = ref("");
const categoria = ref("");
const quantita = ref("");
const zona = ref("");
const data_scadenza = ref("");
const orario_ritiro_inizio = ref("");
const orario_ritiro_fine = ref("");

async function inviaAnnuncio() {
  if (!token) {
    alert("Devi essere loggato per pubblicare un annuncio.");
    return;
  }

  const nuovoAnnuncio = {
    titolo: titolo.value,
    descrizione: descrizione.value,
    categoria: categoria.value,
    quantita: quantita.value,
    zona: zona.value,
    data_scadenza: data_scadenza.value,
    orario_ritiro_inizio: orario_ritiro_inizio.value,
    orario_ritiro_fine: orario_ritiro_fine.value
  };

  const res = await fetch("https://antispreco-app-2.onrender.com/api/annunci", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(nuovoAnnuncio)
  });

  const data = await res.json();
  console.log("Dati inviati:", nuovoAnnuncio);
  console.log("Risposta backend:", data);

  if (res.ok) {
    alert("Annuncio pubblicato!");
    titolo.value = "";
    descrizione.value = "";
    categoria.value = "";
    quantita.value = "";
    zona.value = "";
    data_scadenza.value = "";
    orario_ritiro_inizio.value = "";
    orario_ritiro_fine.value = "";
  } else {
    alert("Errore durante la pubblicazione: " + (data.error || "Errore sconosciuto"));
  }
}
</script>

<template>
  <div class="form-container">
    <h2>Pubblica un nuovo annuncio</h2>

    <!-- BLOCCO SE NON LOGGATO -->
    <div v-if="!token">
      <p>Devi essere registrato per pubblicare un annuncio.</p>
      <router-link to="/login">Vai al login</router-link>
    </div>

    <!-- FORM SOLO SE LOGGATO -->
    <form v-else @submit.prevent="inviaAnnuncio">

      <label>Categoria</label>
      <select v-model="categoria" required>
        <option value="">Seleziona categoria</option>
        <option value="pane">Pane</option>
        <option value="dolci">Dolci</option>
        <option value="frutta">Frutta</option>
        <option value="verdura">Verdura</option>
        <option value="pasti_pronti">Pasti pronti</option>
        <option value="bevande">Bevande</option>
        <option value="altro">Altro</option>
      </select>

      <label>Titolo</label>
      <input v-model="titolo" type="text" required />

      <label>Descrizione</label>
      <textarea v-model="descrizione" required></textarea>

      <label>Quantità</label>
      <input v-model="quantita" type="text" required />

      <label>Zona</label>
      <input v-model="zona" type="text" required />

      <label>Data di scadenza</label>
      <input v-model="data_scadenza" type="date" required />

      <label>Orario ritiro (inizio)</label>
      <input v-model="orario_ritiro_inizio" type="time" required />

      <label>Orario ritiro (fine)</label>
      <input v-model="orario_ritiro_fine" type="time" required />

      <button type="submit">Pubblica annuncio</button>
    </form>
  </div>
</template>

<style>
.form-container {
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 6px;
  background: #f9f9f9;
}

form label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}

form input,
form textarea,
form select {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  margin-top: 15px;
  padding: 10px 20px;
  background: #2d7d46;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
