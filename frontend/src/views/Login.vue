<template>
  <div class="login-wrapper">
    <h2>{{ $t('nav.login') }}</h2>

    <div v-if="verificaSuccesso" class="success-box">
      {{ verificaSuccesso }}
    </div>

    <div v-if="verificaErrore" class="error-box">
      {{ verificaErrore }}
    </div>

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
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { loginUser } from "../services/authService";

const email = ref("");
const password = ref("");
const errore = ref("");
const verificaSuccesso = ref("");
const verificaErrore = ref("");

const router = useRouter();
const route = useRoute();

function aggiornaMessaggioVerifica() {
  verificaSuccesso.value = "";
  verificaErrore.value = "";

  const verified = route.query.verified;
  const reason = route.query.reason;

  if (verified === "1") {
    verificaSuccesso.value = "Email verificata con successo. Ora puoi accedere.";
    return;
  }

  if (verified === "0") {
    if (reason === "missing_token") {
      verificaErrore.value = "Link di verifica non valido: token mancante.";
      return;
    }

    if (reason === "invalid_or_expired") {
      verificaErrore.value = "Token di verifica non valido o scaduto. Richiedi un nuovo link.";
      return;
    }

    verificaErrore.value = "Verifica email non riuscita.";
  }
}

onMounted(() => {
  aggiornaMessaggioVerifica();
});

watch(
  () => route.query,
  () => {
    aggiornaMessaggioVerifica();
  }
);

async function login() {
  errore.value = "";

  try {
    const res = await loginUser(email.value, password.value);
    localStorage.setItem("token", res.data.token);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/eventi");

  } catch (err) {
    if (err.response?.data?.error) {
      errore.value = err.response.data.error;
    } else {
      errore.value = "Connection error";
    }
  }
}
</script>
