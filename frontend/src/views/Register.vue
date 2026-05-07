<script setup>
import { ref } from "vue";

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

  const payload = {
    tipo: tipo.value,
    nome: nome.value,
    cognome: cognome.value,
    nome_associazione: nome_associazione.value,
    nome_attivita: nome_attivita.value,
    partita_iva: partita_iva.value,
    categoria_attivita: categoria_attivita.value,
    email: email.value,
    password: password.value
  };

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      errore.value = data.error || "Errore sconosciuto";
      return;
    }

    successo.value = "Registrazione completata!";
  } catch (err) {
    errore.value = "Errore di connessione al server";
  }
}
</script>

<template>
  <div class="register-container">
    <h2>Registrazione</h2>

    <div v-if="errore" class="errore">{{ errore }}</div>
    <div v-if="successo" class="successo">{{ successo }}</div>

    <!-- Tipo utente -->
    <label>Tipo utente</label>
    <select v-model="tipo" required>
      <option value="">Seleziona...</option>
      <option value="privato">Privato</option>
      <option value="associazione">Associazione</option>
      <option value="commerciante">Commerciante</option>
    </select>

    <!-- PRIVATO -->
    <div v-if="tipo === 'privato'">
      <label>Nome</label>
      <input v-model="nome" type="text" required>

      <label>Cognome</label>
      <input v-model="cognome" type="text" required>
    </div>

    <!-- ASSOCIAZIONE -->
    <div v-if="tipo === 'associazione'">
      <label>Nome Associazione</label>
      <input v-model="nome_associazione" type="text" required>

      <label>Partita IVA</label>
      <input v-model="partita_iva" type="text" required>
    </div>

    <!-- COMMERCIANTE -->
    <div v-if="tipo === 'commerciante'">
      <label>Nome Attività</label>
      <input v-model="nome_attivita" type="text" required>

      <label>Partita IVA</label>
      <input v-model="partita_iva" type="text" required>

      <label>Categoria Attività</label>
      <input v-model="categoria_attivita" type="text">
    </div>

    <!-- Email -->
    <label>Email</label>
    <input v-model="email" type="email" required>

    <!-- Password -->
    <label>Password</label>
    <input v-model="password" type="password" required>

    <button @click="registra">Registrati</button>
  </div>
</template>

<style>
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

input, select {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
}

button {
  width: 100%;
  padding: 10px;
  background: #1b5e20;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
}

.errore {
  color: red;
  margin-bottom: 10px;
}

.successo {
  color: green;
  margin-bottom: 10px;
}
</style>
