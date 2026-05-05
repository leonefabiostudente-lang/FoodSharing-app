<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const nome = ref("");
const email = ref("");
const password = ref("");
const tipo = ref("privato"); // default

const errore = ref("");

async function registra() {
  errore.value = "";

  const res = await fetch("https://antispreco-app-2.onrender.com/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: nome.value,
      email: email.value,
      password: password.value,
      tipo: tipo.value
    })
  });

  const data = await res.json();

  if (!res.ok) {
    errore.value = data.error || "Errore durante la registrazione";
    return;
  }

  alert("Registrazione completata!");
  router.push("/login");
}
</script>

<template>
  <div class="form-container">
    <h2>Registrazione</h2>

    <p v-if="errore" class="errore">{{ errore }}</p>

    <form @submit.prevent="registra">
      <label>Nome</label>
      <input v-model="nome" type="text" required />

      <label>Email</label>
      <input v-model="email" type="email" required />

      <label>Password</label>
      <input v-model="password" type="password" required />

      <label>Tipo utente</label>
      <select v-model="tipo">
        <option value="privato">Privato</option>
        <option value="negozio">Negozio</option>
        <option value="associazione">Associazione</option>
      </select>

      <button type="submit">Registrati</button>
    </form>
  </div>
</template>

<style>
.form-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 6px;
}
.errore {
  color: red;
  margin-bottom: 10px;
}
</style>
