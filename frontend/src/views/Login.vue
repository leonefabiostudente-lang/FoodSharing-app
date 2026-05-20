<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">

        <h2 class="text-center mb-4">Accedi</h2>

        <div class="card shadow-sm p-4">

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model.trim="email" type="email" class="form-control">
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input v-model.trim="password" type="password" class="form-control">
          </div>

          <button @click="login" class="btn btn-primary w-100">
            Accedi
          </button>

          <div v-if="errore" class="alert alert-danger mt-3">
            {{ errore }}
          </div>

        </div>

      </div>
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

    console.log("RISPOSTA LOGIN:", res.data); // 🔍 debug

    localStorage.setItem("token", res.data.token);

    router.push("/annunci");

  } catch (err) {
    console.error("ERRORE COMPLETO:", err);

    if (err.response?.data?.error) {
      errore.value = err.response.data.error;
    } else {
      errore.value = "Errore di connessione al server";
    }
  }
}
</script>

<style scoped>
</style>