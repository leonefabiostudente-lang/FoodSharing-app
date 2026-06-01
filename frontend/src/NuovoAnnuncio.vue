<template>
  <div>
    <h2 class="page-title">Pubblica un nuovo annuncio</h2>

    <form class="form-box" @submit.prevent="creaAnnuncio">
      <input
        type="text"
        v-model="titolo"
        placeholder="Titolo"
        required
      />

      <textarea
        v-model="descrizione"
        placeholder="Descrizione"
        rows="4"
        required
      ></textarea>

      <select v-model="categoria" required>
        <option disabled value="">Seleziona categoria</option>
        <option>Frutta</option>
        <option>Verdura</option>
        <option>Pane</option>
        <option>Dolci</option>
        <option>Altro</option>
      </select>

      <!-- ⭐ CAMPO TELEFONO -->
      <input
        type="tel"
        v-model="telefono"
        placeholder="Numero di telefono"
        required
      />

      <button>Pubblica</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const titolo = ref("");
const descrizione = ref("");
const categoria = ref("");
const telefono = ref(""); // ⭐ nuovo campo

const router = useRouter();

async function creaAnnuncio() {
  try {
    await axios.post(
      "https://antispreco-app-2.onrender.com/api/annunci",
      {
        titolo: titolo.value,
        descrizione: descrizione.value,
        categoria: categoria.value,
        telefono_utente: telefono.value // ⭐ NOME CORRETTO PER IL BACKEND
      }
    );

    alert("Annuncio pubblicato!");
    router.push("/annunci");
  } catch (err) {
    alert("Errore nella creazione dell'annuncio");
  }
}
</script>

<style scoped>
/* Lo stile principale è già in App.vue */
</style>
