<template>
  <div class="form-container">
    <h2 class="page-title">Pubblica un nuovo annuncio!</h2>

    <!-- BLOCCO SE NON LOGGATO -->
    <div v-if="!token" class="auth-alert">
      <p>Devi essere registrato per pubblicare un annuncio.</p>
      <router-link to="/login" class="login-link">Vai al login</router-link>
    </div>

    <!-- FORM FORMATTATO COME NUOVOANNUNCIO -->
    <form v-else class="form-box" @submit.prevent="inviaAnnuncio">
      
      <select v-model="categoria" required>
        <option disabled value="">Seleziona categoria</option>
        <option value="pane">Pane</option>
        <option value="dolci">Dolci</option>
        <option value="frutta">Frutta</option>
        <option value="verdura">Verdura</option>
        <option value="pasti_pronti">Pasti pronti</option>
        <option value="bevande">Bevande</option>
        <option value="altro">Altro</option>
      </select>

      <input v-model="titolo" type="text" placeholder="Titolo" required />

      <textarea v-model="descrizione" placeholder="Descrizione" rows="4" required></textarea>

      <input v-model="quantita" type="text" placeholder="Quantità (es: 1 teglia, 2 kg)" required />

      <!-- CAMPO TELEFONO -->
      <input v-model="telefono" type="tel" placeholder="Numero di telefono" required />

      <!-- ZONA CON AUTOCOMPLETAMENTO -->
      <div class="autocomplete-container">
        <input 
          v-model="zona" 
          type="text" 
          @input="cercaZona" 
          placeholder="Zona (Città, Via o Provincia)" 
          autocomplete="off" 
          required 
        />
        
        <ul v-if="suggerimenti.length > 0" class="autocomplete-dropdown">
          <li 
            v-for="(item, index) in suggerimenti" 
            :key="index" 
            @click="selezionaSuggerimento(item)"
          >
            {{ item.display_name }}
          </li>
        </ul>
      </div>

      <div class="datetime-group">
        <label>Data di scadenza prodotto:</label>
        <input v-model="data_scadenza" type="date" required />
      </div>

      <div class="datetime-group">
        <label>Orario ritiro disponibilità:</label>
        <div class="time-range">
          <input v-model="orario_ritiro_inizio" type="time" required />
          <span>fino a</span>
          <input v-model="orario_ritiro_fine" type="time" required />
        </div>
      </div>

      <button type="submit">Pubblica</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const token = localStorage.getItem("token");
const router = useRouter();

// Campi del form reattivi
const titolo = ref("");
const descrizione = ref("");
const categoria = ref("");
const quantita = ref("");
const telefono = ref(""); 
const zona = ref("");
const data_scadenza = ref("");
const orario_ritiro_inizio = ref("");
const orario_ritiro_fine = ref("");

// Coordinate (UNA SOLA dichiarazione!)
const lat = ref("");
const lng = ref("");

// Autocompletamento OpenStreetMap
const suggerimenti = ref([]);
let debounceTimer = null;

function cercaZona() {
  clearTimeout(debounceTimer);
  if (zona.value.trim().length < 3) {
    suggerimenti.value = [];
    return;
  }

  debounceTimer = setTimeout(async () => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(zona.value)}&countrycodes=it&limit=5`;

      const res = await fetch(url, {
        headers: { 'User-Agent': 'antispreco-app-frontend (contatto-sviluppo@esempio.com)' }
      });

      if (res.ok) {
        suggerimenti.value = await res.json();
      }
    } catch (error) {
      console.error("Errore autocompletamento:", error);
    }
  }, 400);
}

function selezionaSuggerimento(item) {
  zona.value = item.display_name;
  lat.value = item.lat;
  lng.value = item.lon;
  suggerimenti.value = [];
}

async function inviaAnnuncio() {
  if (!token) {
    alert("Devi essere loggato per pubblicare un annuncio.");
    return;
  }

  // Controllo fondamentale: l'utente deve selezionare un suggerimento
  if (!lat.value || !lng.value) {
    alert("Seleziona una zona dai suggerimenti per ottenere la posizione esatta.");
    return;
  }

  const nuovoAnnuncio = {
    titolo: titolo.value,
    descrizione: descrizione.value,
    categoria: categoria.value,
    quantita: quantita.value,
    telefono_utente: telefono.value,
    zona: zona.value,
    lat: lat.value,
    lng: lng.value,
    data_scadenza: data_scadenza.value,
    orario_ritiro_inizio: orario_ritiro_inizio.value,
    orario_ritiro_fine: orario_ritiro_fine.value
  };

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/annunci/`,
      nuovoAnnuncio,
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    if (res.status === 201 || res.status === 200) {
      alert("Annuncio pubblicato con successo!");
      router.push("/annunci");
    }
  } catch (err) {
    console.error("Errore invio:", err.response?.data);
    const messaggio = err.response?.data?.dettagli 
      ? `${err.response.data.error}: ${err.response.data.dettagli}` 
      : (err.response?.data?.error || "Errore di connessione al server");
    alert("Impossibile pubblicare: " + messaggio);
  }
}
</script>


<style scoped>
.form-container {
  max-width: 500px;
  margin: 30px auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-box {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-box input,
.form-box textarea,
.form-box select {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
}

.datetime-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}

.datetime-group label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-range input {
  flex: 1;
}

button {
  padding: 12px;
  background: #2d7d46;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #236136;
}

.autocomplete-container {
  position: relative;
  width: 100%;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 180px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 0 0 6px 6px;
}

.autocomplete-dropdown li {
  padding: 12px;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  color: #333;
}

.autocomplete-dropdown li:hover {
  background-color: #f1f1f1;
}

.auth-alert {
  text-align: center;
  padding: 20px;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 6px;
  color: #856404;
}

.login-link {
  font-weight: bold;
  color: #2d7d46;
  text-decoration: underline;
}
</style>