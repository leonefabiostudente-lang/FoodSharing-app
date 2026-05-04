<script setup>
import { ref } from "vue";

const titolo = ref("");
const descrizione = ref("");
const categoria = ref("");
const quantita = ref("");
const zona = ref("");
const data_scadenza = ref("");
const orario_ritiro_inizio = ref("");
const orario_ritiro_fine = ref("");
const nome_utente = ref("");
const telefono_utente = ref("");

async function inviaAnnuncio() {
  const nuovoAnnuncio = {
    titolo: titolo.value,
    descrizione: descrizione.value,
    categoria: categoria.value,
    quantita: quantita.value,
    zona: zona.value,
    data_scadenza: data_scadenza.value,
    orario_ritiro_inizio: orario_ritiro_inizio.value,
    orario_ritiro_fine: orario_ritiro_fine.value,
    nome_utente: nome_utente.value,
    telefono_utente: telefono_utente.value
  };

 const res = await fetch("https://antispreco-app-2.onrender.com/api/annunci", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuovoAnnuncio)
  });

  if (res.ok) {
    alert("Annuncio pubblicato!");
    // reset campi
    titolo.value = "";
    descrizione.value = "";
    categoria.value = "";
    quantita.value = "";
    zona.value = "";
    data_scadenza.value = "";
    orario_ritiro_inizio.value = "";
    orario_ritiro_fine.value = "";
    nome_utente.value = "";
    telefono_utente.value = "";
  } else {
    alert("Errore durante la pubblicazione");
  }
}
</script>

<template>
  <div class="form-container">
    <h2>Pubblica un nuovo annuncio</h2>

    <form @submit.prevent="inviaAnnuncio">
      <label>Titolo</label>
      <input v-model="titolo" required />

      <label>Descrizione</label>
      <textarea v-model="descrizione" required></textarea>

      <label>Categoria</label>
      <input v-model="categoria" required />

      <label>Quantità</label>
      <input v-model="quantita" type="number" required />

      <label>Zona</label>
      <input v-model="zona" required />

      <label>Data di scadenza</label>
      <input v-model="data_scadenza" type="date" required />

      <label>Orario ritiro (inizio)</label>
      <input v-model="orario_ritiro_inizio" type="time" required />

      <label>Orario ritiro (fine)</label>
      <input v-model="orario_ritiro_fine" type="time" required />

      <label>Nome utente</label>
      <input v-model="nome_utente" required />

      <label>Telefono</label>
      <input v-model="telefono_utente" />

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
form textarea {
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
