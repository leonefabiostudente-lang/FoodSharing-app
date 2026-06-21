<template>
  <div class="login-wrapper">
    <h2>Accedi</h2>

    <div class="form-group">
      <label>Email</label>
      <input v-model.trim="email" type="email" />
    </div>

    <div class="form-group">
      <label>Password</label>
      <input v-model.trim="password" type="password" />
    </div>

    <button class="login-btn" @click="login">Accedi</button>

    <div v-if="errore" class="error-box">
      {{ errore }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "../services/authService";

const email = ref("");
const password = ref("");
const errore = ref("");

const router = useRouter();

async function login() {
  errore.value = "";

  try {
    const res = await loginUser(email.value, password.value);
    localStorage.setItem("token", res.data.token);
    router.push("/annunci");

  } catch (err) {
    if (err.response?.data?.error) {
      errore.value = err.response.data.error;
    } else {
      errore.value = "Errore di connessione al server";
    }
  }
}
</script>
