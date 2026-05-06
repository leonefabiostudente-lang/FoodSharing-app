<template>
  <div>
    <h2 class="page-title">Login</h2>

    <form class="form-box" @submit.prevent="login">
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        required
      />

      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />

      <button>Accedi</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

async function login() {
  try {
    const res = await axios.post(
      "https://antispreco-app-2.onrender.com/api/login",
      {
        email: email.value,
        password: password.value,
      }
    );

    localStorage.setItem("token", res.data.token);

    router.push("/annunci");
  } catch (err) {
    alert("Credenziali non valide");
  }
}
</script>

<style scoped>
/* Lo stile principale è già in App.vue */
/* Qui aggiungo solo eventuali personalizzazioni */

</style>

