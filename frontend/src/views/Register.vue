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

<style scoped>
/* Contenitore generale */
.register-wrapper {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

/* Card centrale */
.register-card {
  width: 100%;
  max-width: 760px;
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  color: #0f172a; /* testo scuro e leggibile */
}

/* Titolo */
.title {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 20px;
  color: #0f172a;
}

/* Form */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Gruppi */
.form-group {
  display: flex;
  flex-direction: column;
}

/* Label */
label {
  font-weight: 700;
  margin-bottom: 6px;
  color: #0f172a;
}

/* Input e Select */
.form-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #94a3b8;
  background: #ffffff;
  font-size: 1.1rem;
  color: #0f172a; /* testo scuro */
}

/* Placeholder leggibile */
.form-input::placeholder {
  color: #475569; /* più scuro */
  opacity: 1;
}

/* Select fix */
.form-input option {
  color: #0f172a;
  background: #ffffff;
}

/* Bottone */
.submit-btn {
  padding: 14px;
  background: linear-gradient(90deg, #4f46e5, #2f855a);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
}

/* DARK MODE FIX */
.app-container.dark-mode .register-card {
  background: #0f172a;
  color: #e2e8f0;
}

.app-container.dark-mode .form-input {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

.app-container.dark-mode .form-input::placeholder {
  color: #cbd5e1;
}

.app-container.dark-mode label {
  color: #f1f5f9;
}

</style>