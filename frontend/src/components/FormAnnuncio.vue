<template>
  <div class="form-container">
    <h2 class="page-title">{{ $t('newAnnouncement.title') }}</h2>

    <div v-if="!token" class="auth-alert">
      <p>Devi essere registrato per pubblicare un evento.</p>
      <router-link to="/login" class="login-link">Vai al login</router-link>
    </div>

    <form v-else class="form-box" @submit.prevent="inviaAnnuncio">
      
      <select v-model="categoria" required>
        <option disabled value="">{{ $t('newAnnouncement.category') }}</option>
        <option value="musica">Musica e concerti</option>
        <option value="sagra">Sagre e tradizioni</option>
        <option value="cultura">Arte e cultura</option>
        <option value="sport">Sport e outdoor</option>
        <option value="famiglia">Famiglie e bambini</option>
        <option value="notte">Nightlife</option>
        <option value="altro">Altro</option>
      </select>

      <input v-model="titolo" type="text" :placeholder="$t('newAnnouncement.food')" required />

      <textarea v-model="descrizione" :placeholder="$t('newAnnouncement.description')" rows="4" required></textarea>

      <input v-model="quantita" type="text" :placeholder="$t('newAnnouncement.quantity')" required />

      <input v-model="telefono" type="tel" placeholder="Contatto organizzatore" required />

      <div class="autocomplete-container">
        <input 
          v-model="zona" 
          type="text" 
          @input="cercaZona" 
          :placeholder="$t('newAnnouncement.location')" 
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
        <label>{{ $t('newAnnouncement.expiry') }}:</label>
        <input v-model="data_scadenza" type="date" required />
      </div>

      <div class="datetime-group">
        <label>Orario evento:</label>
        <div class="time-range">
          <input v-model="orario_ritiro_inizio" type="time" required />
          <span>a</span>
          <input v-model="orario_ritiro_fine" type="time" required />
        </div>
      </div>

      <div class="datetime-group">
        <label>Locandina evento (Opzionale):</label>
        <input 
          type="file" 
          accept="image/*" 
          @change="gestisciCaricamentoFoto" 
        />
        
        <div v-if="anteprimaFoto" class="foto-anteprima-container">
          <div class="card-media-wrapper">
            <img 
              :src="anteprimaFoto" 
              alt="Anteprima locandina" 
              class="prodotto-real-img" 
            />
          </div>
          <button 
            type="button" 
            @click="rimuoviFoto" 
            class="btn-rimuovi-foto"
          >
            Rimuovi immagine
          </button>
        </div>
      </div>

      <button type="submit">{{ $t('newAnnouncement.create') }}</button>
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

// ⭐ Reattivi dedicati alla gestione della foto Base64
const fotoBase64 = ref("");
const anteprimaFoto = ref("");

// Coordinate
const lat = ref("");
const lng = ref("");

// Autocompletamento OpenStreetMap
const suggerimenti = ref([]);
let debounceTimer = null;

// ⭐ Funzione per leggere il file e convertirlo in stringa Base64
function gestisciCaricamentoFoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Limite di sicurezza preventivo sul frontend (es: 4MB) per preservare le performance del DB
  if (file.size > 4 * 1024 * 1024) {
    alert("L'immagine è troppo pesante! Seleziona una foto inferiore a 4MB.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    fotoBase64.value = reader.result;    // Stringa Base64 ufficiale per il Backend
    anteprimaFoto.value = reader.result; // Stringa per l'anteprima a schermo
  };
  reader.readAsDataURL(file);
}

// ⭐ Funzione per rimuovere la foto selezionata
function rimuoviFoto() {
  fotoBase64.value = "";
  anteprimaFoto.value = "";
}

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
// Aggiungi questa funzione helper per normalizzare la visualizzazione
function getCategoriaClass(cat) {
  if (!cat) return 'altro';
  return cat.toLowerCase().trim();
}

async function inviaAnnuncio() {
  if (!token) {
    alert("Devi essere loggato per pubblicare un evento.");
    return;
  }

  // Controllo fondamentale: l'utente deve selezionare un suggerimento
  if (!lat.value || !lng.value) {
    alert("Seleziona una zona dai suggerimenti per ottenere la posizione esatta.");
    return;
  }
console.log("Valore di categoria selezionato:", categoria.value);
  console.log("Tipo di dato:", typeof categoria.value);
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
    orario_ritiro_fine: orario_ritiro_fine.value,
    // ⭐ Inviamo il Base64 al backend (verrà catturato e normalizzato in array nel controller)
    foto: fotoBase64.value 
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
      alert("Evento pubblicato con successo!");
      router.push("/eventi");
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