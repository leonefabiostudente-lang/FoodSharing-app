<script setup>
import { ref } from "vue";
import api from "@/api/axios";

const tipo = ref("");
const nome = ref("");
const cognome = ref("");
const nome_associazione = ref("");
const nome_attivita = ref("");
const partita_iva = ref("");
const categoria_attivita = ref("");
const email = ref("");
const password = ref("");
const errore = ref("");
const successo = ref("");

async function registra() {
  errore.value = "";
  successo.value = "";

  let payload = {
    tipo: tipo.value,
    email: email.value,
    password: password.value
  };

  if (tipo.value === "privato") {
    payload.nome = nome.value;
    payload.cognome = cognome.value;
  }

  if (tipo.value === "associazione") {
    payload.nome_associazione = nome_associazione.value;
    payload.partita_iva = partita_iva.value;
  }

  if (tipo.value === "commerciante") {
    payload.nome_attivita = nome_attivita.value;
    payload.categoria_attivita = categoria_attivita.value;
    payload.partita_iva = partita_iva.value;
  }

  try {
    const res = await api.post("/register", payload);
    successo.value = "Registrazione completata!";
  } catch (err) {
    if (err.response?.data?.error) {
      errore.value = err.response.data.error;
    } else {
      errore.value = "Errore di connessione al server";
    }
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">

        <h2 class="mb-4 text-center">Registrazione</h2>

        <!-- Messaggi -->
        <div v-if="errore" class="alert alert-danger">{{ errore }}</div>
        <div v-if="successo" class="alert alert-success">{{ successo }}</div>

        <form @submit.prevent="registra" class="p-4 shadow rounded bg-white">

          <!-- Tipo utente -->
          <div class="mb-4">
            <label class="form-label fw-bold">Tipo utente</label>
            <select v-model="tipo" class="form-select form-select-lg">
              <option value="">Seleziona...</option>
              <option value="privato">Privato</option>
              <option value="associazione">Associazione</option>
              <option value="commerciante">Commerciante</option>
            </select>
          </div>

          <!-- PRIVATO -->
          <div v-if="tipo === 'privato'">
            <div class="mb-3">
              <label class="form-label fw-bold">Nome</label>
              <input v-model="nome" type="text" class="form-control form-control-lg">
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Cognome</label>
              <input v-model="cognome" type="text" class="form-control form-control-lg">
            </div>
          </div>

          <!-- ASSOCIAZIONE -->
          <div v-if="tipo === 'associazione'">
            <div class="mb-3">
              <label class="form-label fw-bold">Nome associazione</label>
              <input v-model="nome_associazione" type="text" class="form-control form-control-lg">
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Partita IVA</label>
              <input v-model="partita_iva" type="text" class="form-control form-control-lg">
            </div>
          </div>

          <!-- COMMERCIANTE -->
          <div v-if="tipo === 'commerciante'">
            <div class="mb-3">
              <label class="form-label fw-bold">Nome attività</label>
              <input v-model="nome_attivita" type="text" class="form-control form-control-lg">
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Partita IVA</label>
              <input v-model="partita_iva" type="text" class="form-control form-control-lg">
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Categoria attività</label>
              <input v-model="categoria_attivita" type="text" class="form-control form-control-lg">
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label class="form-label fw-bold">Email</label>
            <input v-model="email" type="email" class="form-control form-control-lg">
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="form-label fw-bold">Password</label>
            <input v-model="password" type="password" class="form-control form-control-lg">
          </div>

          <!-- Bottone -->
          <button type="submit" class="btn btn-primary btn-lg w-100">
            Registrati
          </button>

        </form>

      </div>
    </div>
  </div>
</template>
