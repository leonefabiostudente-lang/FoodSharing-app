<script setup>
import { ref } from "vue";
import api from "@/api/axios";
import { resendVerificationEmailUser } from "@/services/authService";

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
const verificaLink = ref("");
const resendInfo = ref("");
const resendError = ref("");
const resendLoading = ref(false);

async function registra() {
  errore.value = "";
  successo.value = "";
  verificaLink.value = "";
  resendInfo.value = "";
  resendError.value = "";

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
    if (res.data?.verificationLink) {
      verificaLink.value = res.data.verificationLink;
    }
  } catch (err) {
    if (err.response?.data?.error) {
      errore.value = err.response.data.error;
    } else {
      errore.value = "Errore di connessione al server";
    }
  }
}

async function reinviaEmailConferma() {
  resendInfo.value = "";
  resendError.value = "";

  if (!email.value) {
    resendError.value = "Inserisci prima l'email da verificare.";
    return;
  }

  resendLoading.value = true;
  try {
    const res = await resendVerificationEmailUser(email.value);
    resendInfo.value = res.data?.message || "Richiesta inviata. Controlla la casella email.";
    if (res.data?.verificationLink) {
      verificaLink.value = res.data.verificationLink;
    }
  } catch (err) {
    resendError.value = err.response?.data?.error || "Impossibile reinviare l'email di conferma.";
  } finally {
    resendLoading.value = false;
  }
}
</script>

<template>
  <div class="register-wrapper">
    <div class="register-card">

      <h2 class="title">{{ $t('auth.signUp') }}</h2>

      <!-- Messaggi -->
      <div v-if="errore" class="alert alert-danger">{{ errore }}</div>
      <div v-if="successo" class="alert alert-success" style="white-space: pre-line;">{{ successo }}</div>
      <div v-if="resendError" class="alert alert-danger">{{ resendError }}</div>
      <div v-if="resendInfo" class="alert alert-info" style="white-space: pre-line;">{{ resendInfo }}</div>
      <div v-if="verificaLink" class="alert alert-info">
        Verification link (development):
        <a :href="verificaLink" target="_blank" rel="noopener">{{ verificaLink }}</a>
      </div>

      <form @submit.prevent="registra" class="register-form">

        <!-- Tipo utente -->
        <div class="form-group">
          <label>User type</label>
          <select v-model="tipo" class="form-input">
            <option value="">Select...</option>
            <option value="privato">Individual</option>
            <option value="associazione">Association</option>
            <option value="commerciante">Business</option>
          </select>
        </div>

        <!-- PRIVATO -->
        <div v-if="tipo === 'privato'">
          <div class="form-group">
            <label>{{ $t('auth.name') }}</label>
            <input v-model="nome" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>Last Name</label>
            <input v-model="cognome" type="text" class="form-input" />
          </div>
        </div>

        <!-- ASSOCIAZIONE -->
        <div v-if="tipo === 'associazione'">
          <div class="form-group">
            <label>Association Name</label>
            <input v-model="nome_associazione" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>VAT Number</label>
            <input v-model="partita_iva" type="text" class="form-input" />
          </div>
        </div>

        <!-- COMMERCIANTE -->
        <div v-if="tipo === 'commerciante'">
          <div class="form-group">
            <label>Business Name</label>
            <input v-model="nome_attivita" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>VAT Number</label>
            <input v-model="partita_iva" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>Business Category</label>
            <input v-model="categoria_attivita" type="text" class="form-input" />
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>{{ $t('auth.email') }}</label>
          <input v-model="email" type="email" class="form-input" />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label>{{ $t('auth.password') }}</label>
          <input v-model="password" type="password" class="form-input" />
        </div>

        <!-- Bottone -->
        <button type="submit" class="submit-btn">
          {{ $t('auth.signUp') }}
        </button>

        <button type="button" class="submit-btn" :disabled="resendLoading" @click="reinviaEmailConferma">
          {{ resendLoading ? 'Invio in corso...' : 'Reinvia email di conferma' }}
        </button>

      </form>

    </div>
  </div>
</template>