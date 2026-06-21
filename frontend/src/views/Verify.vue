<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { verifyEmail } from '../services/authService';

const route = useRoute();
const message = ref('Verifico...');
const error = ref('');

onMounted(async () => {
  const token = route.query.token;
  if (!token) {
    error.value = 'Token mancante nella richiesta.';
    message.value = '';
    return;
  }

  try {
    const res = await verifyEmail(token);
    message.value = res.data?.message || 'Verifica completata con successo!';
  } catch (err) {
    error.value = err.response?.data?.error || 'Errore durante la verifica.';
    message.value = '';
  }
});
</script>

<template>
  <div class="verify-wrapper">
    <div class="verify-card">
      <h2>Verifica Email</h2>
      <div v-if="message" class="alert alert-success">{{ message }}</div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
    </div>
  </div>
</template>
