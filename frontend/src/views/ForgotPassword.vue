<template>
  <div class="forgot-password-wrapper">
    <h2>{{ $t('auth.forgotPassword') }}</h2>

    <div v-if="successo" class="alert alert-success">{{ successo }}</div>
    <div v-if="errore" class="alert alert-danger">{{ errore }}</div>

    <div class="form-group">
      <label>{{ $t('auth.email') }}</label>
      <input v-model.trim="email" type="email" />
    </div>

    <button class="submit-btn" @click="inviaEmail">Send reset link</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { forgotPasswordUser } from '../services/authService';

const email = ref('');
const errore = ref('');
const successo = ref('');

async function inviaEmail() {
  errore.value = '';
  successo.value = '';

  if (!email.value) {
    errore.value = 'Please enter your email.';
    return;
  }

  try {
    const res = await forgotPasswordUser(email.value);
    successo.value = res.data?.message || 'If the email is registered, you will receive a link to reset your password.';
  } catch (err) {
    errore.value = err.response?.data?.error || 'Connection error';
  }
}
</script>
