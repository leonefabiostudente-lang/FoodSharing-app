<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const errore = ref("");

async function login() {
  errore.value = "";

  const res = await fetch("https://antispreco-app-2.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (!res.ok) {
    errore.value = data.error || "Credenziali non valide";
    return;
  }

  // Salvo il token
  localStorage.setItem("token", data.token);

  alert("Login effettuato!");
  router.push("/"); // torna alla home o dove vuoi
}
</script>

<template>
  <div class="form-container">
    <h2>Login</h2>

    <p v-if="errore" class="errore">{{ errore }}</p>

    <form @submit.prevent="login">
      <label>Email</label>
      <input v-model="email" type="email" required />

      <label>Password</label>
      <input v-model="password" type="password" required />

      <button type="submit">Accedi</button>
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
