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
    successo.value = res.data?.message || "Registrazione completata!";
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
  <div class="register-wrapper">
    <div class="register-card">

      <h2 class="title">Registrazione</h2>

      <!-- Messaggi -->
      <div v-if="errore" class="alert alert-danger">{{ errore }}</div>
      <div v-if="successo" class="alert alert-success">{{ successo }}</div>

      <form @submit.prevent="registra" class="register-form">

        <!-- Tipo utente -->
        <div class="form-group">
          <label>Tipo utente</label>
          <select v-model="tipo" class="form-input">
            <option value="">Seleziona...</option>
            <option value="privato">Privato</option>
            <option value="associazione">Associazione</option>
            <option value="commerciante">Commerciante</option>
          </select>
        </div>

        <!-- PRIVATO -->
        <div v-if="tipo === 'privato'">
          <div class="form-group">
            <label>Nome</label>
            <input v-model="nome" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>Cognome</label>
            <input v-model="cognome" type="text" class="form-input" />
          </div>
        </div>

        <!-- ASSOCIAZIONE -->
        <div v-if="tipo === 'associazione'">
          <div class="form-group">
            <label>Nome associazione</label>
            <input v-model="nome_associazione" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>Partita IVA</label>
            <input v-model="partita_iva" type="text" class="form-input" />
          </div>
        </div>

        <!-- COMMERCIANTE -->
        <div v-if="tipo === 'commerciante'">
          <div class="form-group">
            <label>Nome attività</label>
            <input v-model="nome_attivita" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>Partita IVA</label>
            <input v-model="partita_iva" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>Categoria attività</label>
            <input v-model="categoria_attivita" type="text" class="form-input" />
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" class="form-input" />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" class="form-input" />
        </div>

        <!-- Bottone -->
        <button type="submit" class="submit-btn">
          Registrati
        </button>

      </form>

    </div>
  </div>
</template>