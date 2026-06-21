<template>
  <div class="reset-password-wrapper">
    <h2>{{ $t('auth.resetPassword') }}</h2>

    <div v-if="successo" class="alert alert-success">
      {{ successo }}
      <div class="success-action">
        <router-link to="/login">Back to login</router-link>
      </div>
    </div>

    <div v-if="errore" class="alert alert-danger">{{ errore }}</div>

    <div v-if="!successo">
      <div class="form-group">
        <label>{{ $t('auth.password') }}</label>
        <input v-model.trim="password" type="password" />
      </div>

      <button class="submit-btn" @click="inviaReset">{{ $t('auth.resetPassword') }}</button>
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
    errore.value = 'Missing token in URL.';
  }
});

async function inviaReset() {
  errore.value = '';
  successo.value = '';

  if (!token.value) {
    errore.value = 'Missing token.';
    return;
  }

  if (!password.value) {
    errore.value = 'Please enter a new password.';
    return;
  }

  try {
    const res = await resetPasswordUser(token.value, password.value);
    successo.value = res.data?.message || 'Password reset successfully!';
  } catch (err) {
    errore.value = err.response?.data?.error || 'Errore di connessione al server';
  }
}
</script>
