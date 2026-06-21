<template>
  <div class="reset-password-wrapper">
    <h2>Reimposta password</h2>

    <div v-if="successo" class="alert alert-success">
      {{ successo }}
      <div class="success-action">
        <router-link to="/login">Torna al login</router-link>
      </div>
    </div>

    <div v-if="errore" class="alert alert-danger">{{ errore }}</div>

    <div v-if="!successo">
      <div class="form-group">
        <label>Nuova password</label>
        <input v-model.trim="password" type="password" />
      </div>

      <button class="submit-btn" @click="inviaReset">Reimposta password</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { resetPasswordUser } from '../services/authService';

const route = useRoute();
const password = ref('');
const errore = ref('');
const successo = ref('');
const token = ref('');

onMounted(() => {
  token.value = route.query.token || '';
  if (!token.value) {
    errore.value = 'Token mancante nella URL.';
  }
});

async function inviaReset() {
  errore.value = '';
  successo.value = '';

  if (!token.value) {
    errore.value = 'Token mancante.';
    return;
  }

  if (!password.value) {
    errore.value = 'Inserisci la nuova password.';
    return;
  }

  try {
    const res = await resetPasswordUser(token.value, password.value);
    successo.value = res.data?.message || 'Password reimpostata con successo!';
  } catch (err) {
    errore.value = err.response?.data?.error || 'Errore di connessione al server';
  }
}
</script>
