<template>
  <section class="evento-wrapper">
    <p class="back-link">
      <router-link to="/eventi">← Torna agli eventi</router-link>
    </p>

    <div v-if="loading" class="status">Caricamento evento...</div>
    <div v-else-if="errore" class="status error">{{ errore }}</div>

    <article v-else class="evento-card">
      <img
        v-if="evento.foto && evento.foto.length > 0 && evento.foto[0]"
        :src="evento.foto[0]"
        :alt="`Locandina ${evento.titolo}`"
        class="cover"
      />

      <h1>{{ evento.titolo }}</h1>
      <p class="meta">{{ categoriaLabel(evento.categoria) }} · {{ formatDate(evento.data_scadenza) }}</p>

      <p class="descrizione">{{ evento.descrizione }}</p>

      <div class="grid">
        <p><strong>Luogo:</strong> {{ evento.zona }}</p>
        <p><strong>Orario:</strong> {{ evento.orario_ritiro_inizio }} - {{ evento.orario_ritiro_fine }}</p>
        <p><strong>Dettagli:</strong> {{ evento.quantita }}</p>
        <p><strong>Contatto:</strong> {{ evento.telefono_utente || 'N/D' }}</p>
        <p><strong>Pubblicato da:</strong> {{ evento.nome_utente || 'Utente' }}</p>
      </div>
    </article>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { fetchEventoById, slugify } from "@/services/eventService";

const route = useRoute();
const loading = ref(true);
const errore = ref("");
const evento = ref(null);

function formatDate(value) {
  if (!value) return "N/D";
  return new Date(value).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
}

function categoriaLabel(cat) {
  const labels = {
    musica: "Musica e concerti",
    sagra: "Sagre e tradizioni",
    cultura: "Arte e cultura",
    sport: "Sport e outdoor",
    famiglia: "Famiglie e bambini",
    notte: "Nightlife",
    altro: "Altro"
  };
  return labels[cat] || "Altro";
}

function upsertMeta(name, content, attr = "name") {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}='${name}']`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(url) {
  let link = document.head.querySelector("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function renderEventSchema(item, canonicalUrl) {
  const schemaId = "event-schema-jsonld";
  let script = document.getElementById(schemaId);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = schemaId;
    document.head.appendChild(script);
  }

  const startDate = item.data_scadenza ? `${item.data_scadenza.slice(0, 10)}T${item.orario_ritiro_inizio || "18:00"}:00` : undefined;
  const endDate = item.data_scadenza ? `${item.data_scadenza.slice(0, 10)}T${item.orario_ritiro_fine || "22:00"}:00` : undefined;

  const payload = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: item.titolo,
    description: item.descrizione,
    startDate,
    endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: item.foto && item.foto.length > 0 ? item.foto : undefined,
    location: {
      "@type": "Place",
      name: item.zona,
      address: {
        "@type": "PostalAddress",
        addressLocality: item.zona,
        addressCountry: "IT"
      }
    },
    organizer: {
      "@type": "Organization",
      name: item.nome_utente || "Vivere Tropea Eventi"
    },
    url: canonicalUrl
  };

  script.textContent = JSON.stringify(payload);
}

function applySeo(item) {
  const siteUrl = "https://www.viveretropea.it";
  const path = `/eventi/${item._id}/${slugify(item.titolo)}`;
  const canonicalUrl = `${siteUrl}${path}`;
  const title = `${item.titolo} | Eventi a Tropea`;
  const description = `${item.descrizione}`.slice(0, 150);

  document.title = title;
  upsertMeta("description", description);
  upsertMeta("og:title", title, "property");
  upsertMeta("og:description", description, "property");
  upsertMeta("og:type", "event", "property");
  upsertMeta("og:url", canonicalUrl, "property");
  upsertMeta("twitter:title", title);
  upsertMeta("twitter:description", description);
  upsertCanonical(canonicalUrl);

  renderEventSchema(item, canonicalUrl);
}

onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await fetchEventoById(id);
    evento.value = res.data;
    applySeo(res.data);
  } catch (err) {
    errore.value = err.response?.data?.error || "Evento non trovato";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.evento-wrapper {
  max-width: 860px;
  margin: 0 auto;
}

.back-link {
  margin-bottom: 16px;
}

.evento-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
}

.cover {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 14px;
}

.meta {
  color: #4b5563;
  margin-bottom: 14px;
}

.descrizione {
  line-height: 1.55;
}

.grid {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

.status {
  padding: 12px;
}

.status.error {
  color: #b91c1c;
}
</style>
