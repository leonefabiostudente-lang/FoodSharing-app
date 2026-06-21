<template>
  <div class="login-wrapper">
    <h2>{{ $t('nav.login') }}</h2>

    <div class="form-group">
      <label>{{ $t('auth.email') }}</label>
      <input v-model.trim="email" type="email" />
    </div>

    <div class="form-group">
      <label>{{ $t('auth.password') }}</label>
      <input v-model.trim="password" type="password" />
    </div>

    <button class="login-btn" @click="login">{{ $t('auth.signIn') }}</button>

    <div class="forgot-link">
      <router-link to="/forgot-password">{{ $t('auth.forgotPassword') }}</router-link>
    </div>

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
    window.dispatchEvent(new Event("auth-change"));
    router.push("/annunci");

  } catch (err) {
    if (err.response?.data?.error) {
      errore.value = err.response.data.error;
    } else {
      errore.value = "Connection error";
    }
  }
}
</script>
