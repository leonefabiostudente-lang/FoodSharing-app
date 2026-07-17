<script setup>
import { ref, onMounted, watch, computed } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// importa l'SVG dal folder src/assets (il bundler restituirà l'URL)
import pastiProntiUrl from '@/assets/images/spaghetti.svg';
const annunci = ref([]);
const loading = ref(true);
const errore = ref(null);
const filtroZona = ref("");

let map;
let markers = [];
let userPos = ref(null);

function isAnnuncioScaduto(dataScadenza) {
  if (!dataScadenza) return false;

  const expiry = new Date(dataScadenza);
  if (Number.isNaN(expiry.getTime())) return false;

  // La scadenza vale fino a fine giornata per le date inserite senza orario.
  if (typeof dataScadenza === "string" && dataScadenza.length <= 10) {
    expiry.setHours(23, 59, 59, 999);
  }

  return expiry.getTime() < Date.now();
}

const annunciAttivi = computed(() => annunci.value.filter(a => !isAnnuncioScaduto(a.data_scadenza)));
const annunciScaduti = computed(() => annunci.value.filter(a => isAnnuncioScaduto(a.data_scadenza)));

// 📌 Nuove icone coordinate, moderne e minimali per categoria
const icons = {
  pane: "https://cdn-icons-png.flaticon.com/512/3081/3081918.png",         /* Pane moderno flat */
  dolci: "https://img.icons8.com/fluency/96/cupcake.png",                  /* Cupcake/Dolce coordinato */
  frutta: "https://cdn-icons-png.flaticon.com/512/3194/3194766.png",       /* Mela/Frutta minimal */
  verdura: "https://cdn-icons-png.flaticon.com/512/2324/2324343.png",      /* Carota/Verdura minimal */
  pasti_pronti: pastiProntiUrl,                                          /* Piatto pronto/Cloche */
  bevande: "https://cdn-icons-png.flaticon.com/512/3050/3050130.png",      /* Bottiglia/Bicchiere flat */
  altro: "https://cdn-icons-png.flaticon.com/512/11512/11512411.png"       /* Box spesa generico moderno */
};

// 🔧 Funzione per ottenere l’icona giusta sulla mappa
function getIcon(categoria) {
  return L.icon({
    iconUrl: icons[categoria] || icons.altro,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
}
function getFallbackIcon(categoria) {
  if (!categoria) return icons.altro;
  const catKey = categoria.toLowerCase().trim();
  
  // Debug: controlla cosa sta cercando
  console.log("Cerco icona per categoria:", catKey, "Risultato:", icons[catKey]);
  
  
  return icons[catKey] || icons.altro;
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

    // 1️⃣ ORDINAMENTO BASE: Dal più recente al meno recente (usando l'_id di MongoDB)
    // Questo si applica SEMPRE, sia su mobile che desktop, con o senza posizione attiva.
    data.sort((a, b) => b._id.localeCompare(a._id));

    // Se l'utente ha la geolocalizzazione attiva, calcoliamo le distanze
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

      // 2️⃣ SECONDO ORDINAMENTO: Se c'è la posizione, ordina per distanza.
      // Se due annunci hanno la stessa distanza (o non ce l'hanno), mantengono l'ordine del più recente fatto sopra.
      data.sort((a, b) => {
        const distA = a.distanza ?? 9999;
        const distB = b.distanza ?? 9999;
        
        if (distA !== distB) {
          return distA - distB; // Più vicino in alto
        }
        // Se la distanza è uguale, il più recente va comunque prima
        return b._id.localeCompare(a._id);
      });
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

    // 🎯 Aggiorna marker sulla mappa
    watch(annunciAttivi, () => {
      markers.forEach(m => map.removeLayer(m));
      markers = [];

      annunciAttivi.value.forEach(a => {
        if (a.latitudine && a.longitudine) {
          const marker = L.marker(
      [a.latitudine, a.longitudine],
      { icon: getIcon(a.categoria?.toLowerCase().trim()) } // Aggiunto .toLowerCase().trim()
    ).addTo(map);

          // ⭐ Aggiunta foto anche nel mini popup della mappa se disponibile!
          const popupPhotoHtml = a.foto && a.foto.length > 0 && a.foto[0]
            ? `<img src="${a.foto[0]}" style="width:100%; max-height:80px; object-fit:cover; border-radius:4px; margin-bottom:5px;" /><br>`
            : "";

          marker.bindPopup(`
            <div style="max-width: 160px;">
              ${popupPhotoHtml}
              <b>${a.titolo}</b><br>
              ${a.zona}<br>
              <i>${a.categoria}</i><br>
              ${a.distanza ? a.distanza.toFixed(1) + " km away" : ""}
            </div>
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
    :placeholder="$t('announcements.title')"
    class="search-input"
  />

  <h2>{{ $t('announcements.title') }}</h2>

  <div id="map" style="height: 400px; width: 100%; margin: 20px 0;"></div>

  <div v-if="loading">Loading...</div>
  <div v-if="errore">{{ errore }}</div>

  <div v-if="!loading && annunciAttivi.length === 0 && annunciScaduti.length === 0">
    {{ $t('announcements.noAnnouncements') }}
  </div>

  <h3 v-if="!loading">{{ $t('announcements.activeSection') }}</h3>
  <div v-if="!loading && annunciAttivi.length === 0" class="empty-section">
    {{ $t('announcements.noActive') }}
  </div>

  <div class="annunci-grid" v-if="annunciAttivi.length > 0">
    <div v-for="a in annunciAttivi" :key="`attivo-${a._id}`" class="annuncio-card">
      
      <div class="card-media-wrapper">
        <img 
          v-if="a.foto && a.foto.length > 0 && a.foto[0]" 
          :src="a.foto[0]" 
          alt="Product photo" 
          class="prodotto-real-img"
        />
        <div v-else class="card-icon-fallback">
          <img :src="getFallbackIcon(a.categoria)" alt="category" />
          
        </div>
      </div>

      <h3 class="card-title">{{ a.titolo }}</h3>

      <p class="card-desc">{{ a.descrizione }}</p>

      <span class="badge">{{ a.categoria ? a.categoria.charAt(0).toUpperCase() + a.categoria.slice(1) : 'Other' }}</span>

      <div class="card-info">
        <p><strong>Location:</strong> {{ a.zona }}</p>
        <p><strong>Quantity:</strong> {{ a.quantita }}</p>

        <p v-if="a.distanza">
          <strong>Distance:</strong> {{ a.distanza.toFixed(1) }} km
        </p>

        <p>
          <strong>Available until:</strong>
          {{ new Date(a.data_scadenza).toLocaleDateString() }}
        </p>

        <p>
          <strong>Pickup:</strong>
          {{ a.orario_ritiro_inizio }} - {{ a.orario_ritiro_fine }}
        </p>
      </div>

      <div class="card-footer">
        <div class="utente">👤 {{ a.nome_utente || "Unknown user" }}</div>
        <div class="telefono">📞 {{ a.telefono_utente || "N/A" }}</div>
      </div>

    </div>
  </div>

  <h3 v-if="!loading">{{ $t('announcements.expiredSection') }}</h3>
  <div v-if="!loading && annunciScaduti.length === 0" class="empty-section">
    {{ $t('announcements.noExpired') }}
  </div>

  <div class="annunci-grid" v-if="annunciScaduti.length > 0">
    <div v-for="a in annunciScaduti" :key="`scaduto-${a._id}`" class="annuncio-card annuncio-card--expired">
      
      <div class="card-media-wrapper">
        <img 
          v-if="a.foto && a.foto.length > 0 && a.foto[0]" 
          :src="a.foto[0]" 
          alt="Product photo" 
          class="prodotto-real-img"
        />
        <div v-else class="card-icon-fallback">
          <img :src="getFallbackIcon(a.categoria)" alt="category" />
          
        </div>
      </div>

      <h3 class="card-title">{{ a.titolo }}</h3>

      <p class="card-desc">{{ a.descrizione }}</p>

      <span class="badge">{{ a.categoria ? a.categoria.charAt(0).toUpperCase() + a.categoria.slice(1) : 'Other' }}</span>

      <div class="card-info">
        <p><strong>Location:</strong> {{ a.zona }}</p>
        <p><strong>Quantity:</strong> {{ a.quantita }}</p>

        <p v-if="a.distanza">
          <strong>Distance:</strong> {{ a.distanza.toFixed(1) }} km
        </p>

        <p>
          <strong>Available until:</strong>
          {{ new Date(a.data_scadenza).toLocaleDateString() }}
        </p>

        <p>
          <strong>Pickup:</strong>
          {{ a.orario_ritiro_inizio }} - {{ a.orario_ritiro_fine }}
        </p>
      </div>

      <div class="card-footer">
        <div class="utente">👤 {{ a.nome_utente || "Unknown user" }}</div>
        <div class="telefono">📞 {{ a.telefono_utente || "N/A" }}</div>
      </div>

    </div>
  </div>
</template>
