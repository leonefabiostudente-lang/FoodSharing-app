<script setup>
import { ref, onMounted, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const annunci = ref([]);
const loading = ref(true);
const errore = ref(null);
const filtroZona = ref("");

let map;
let markers = [];
let userPos = ref(null);

// 📌 Icone per categoria
const icons = {
  pane: "https://cdn-icons-png.flaticon.com/512/1046/1046769.png",
  dolci: "https://cdn-icons-png.flaticon.com/512/2203/2203189.png",
  frutta: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
  verdura: "https://cdn-icons-png.flaticon.com/512/766/766149.png",
  pasti_pronti: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  bevande: "https://cdn-icons-png.flaticon.com/512/1046/1046786.png",
  altro: "https://cdn-icons-png.flaticon.com/512/565/565547.png"
};

// 🔧 Funzione per ottenere l’icona giusta
function getIcon(categoria) {
  return L.icon({
    iconUrl: icons[categoria] || icons.altro,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
}

// 📏 Calcolo distanza (Haversine)
function distanzaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 📍 Posizione utente
function getUserLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    pos => {
      userPos.value = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      };

      // Marker utente
      L.marker([userPos.value.lat, userPos.value.lon], {
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
          iconSize: [32, 32]
        })
      })
        .addTo(map)
        .bindPopup("Tu sei qui");
    },
    err => console.warn("Geolocalizzazione negata")
  );
}

// 🔍 Carica annunci
async function caricaAnnunci() {
  loading.value = true;

  try {
    const url = filtroZona.value
      ? `https://antispreco-app-2.onrender.com/api/annunci?zona=${encodeURIComponent(filtroZona.value)}`
      : `https://antispreco-app-2.onrender.com/api/annunci`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Errore nel caricamento degli annunci");

    let data = await res.json();

    // ➕ Calcola distanza
    if (userPos.value) {
      data = data.map(a => {
        if (a.latitudine && a.longitudine) {
          a.distanza = distanzaKm(
            userPos.value.lat,
            userPos.value.lon,
            a.latitudine,
            a.longitudine
          );
        } else {
          a.distanza = null;
        }
        return a;
      });

      // Ordina per distanza
      data.sort((a, b) => (a.distanza ?? 9999) - (b.distanza ?? 9999));
    }

    annunci.value = data;

  } catch (err) {
    errore.value = err.message;
  } finally {
    loading.value = false;
  }
}

// 🗺️ Inizializza mappa
onMounted(() => {
  map = L.map("map").setView([45.6983, 9.6773], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  getUserLocation();
  caricaAnnunci();
});

// 🎯 Aggiorna marker
watch(annunci, () => {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  annunci.value.forEach(a => {
    if (a.latitudine && a.longitudine) {
      const marker = L.marker(
        [a.latitudine, a.longitudine],
        { icon: getIcon(a.categoria) }
      ).addTo(map);

      marker.bindPopup(`
        <b>${a.titolo}</b><br>
        ${a.zona}<br>
        <i>${a.categoria}</i><br>
        ${a.distanza ? a.distanza.toFixed(1) + " km da te" : ""}
      `);

      markers.push(marker);
    }
  });
});

// 🔄 Ricarica quando cambia il filtro
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

  <h2>Annunci disponibili</h2>

  <div id="map" style="height: 400px; width: 100%; margin: 20px 0;"></div>

  <div v-if="loading">Caricamento in corso...</div>
  <div v-if="errore">{{ errore }}</div>

  <div v-if="!loading && annunci.length === 0">
    Nessun annuncio presente.
  </div>

  <div class="annunci-grid">
    <div v-for="a in annunci" :key="a._id" class="annuncio-card">
      <h3>{{ a.titolo }}</h3>
      <p>{{ a.descrizione }}</p>

      <p><strong>Categoria:</strong> {{ a.categoria }}</p>
      <p><strong>Quantità:</strong> {{ a.quantita }}</p>
      <p><strong>Zona:</strong> {{ a.zona }}</p>

      <p v-if="a.distanza">
        <strong>Distanza:</strong> {{ a.distanza.toFixed(1) }} km
      </p>

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
    </div>
  </div>
</template>

<style>
#map {
  border-radius: 12px;
  overflow: hidden;
}
</style>