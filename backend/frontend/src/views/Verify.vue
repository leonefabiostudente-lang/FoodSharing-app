<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { verifyEmail } from '../services/authService';

const route = useRoute();
const message = ref('Verifying...');
const error = ref('');

onMounted(async () => {
  const token = route.query.token;
  if (!token) {
    error.value = 'Missing token in request.';
    message.value = '';
    return;
  }

  try {
    const res = await verifyEmail(token);
    message.value = res.data?.message || 'Email verified successfully!';
  } catch (err) {
    error.value = err.response?.data?.error || 'Error during verification.';
    message.value = '';
  }
});
</script>

<template>
  <div class="verify-wrapper">
    <div class="verify-card">
      <h2>{{ $t('auth.verifyEmail') }}</h2>
      <div v-if="message" class="alert alert-success">{{ message }}</div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
    </div>
  </div>
</template>
