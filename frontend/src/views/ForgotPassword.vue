<template>
  <div class="forgot-password-wrapper">
    <h2>Password dimenticata</h2>

    <div v-if="successo" class="alert alert-success">{{ successo }}</div>
    <div v-if="errore" class="alert alert-danger">{{ errore }}</div>

    <div class="form-group">
      <label>Email</label>
      <input v-model.trim="email" type="email" />
    </div>

    <button class="submit-btn" @click="inviaEmail">Invia link di reset</button>
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
    errore.value = 'Inserisci la tua email.';
    return;
  }

  try {
    const res = await forgotPasswordUser(email.value);
    successo.value = res.data?.message || 'Se l\'email è registrata, riceverai un link per reimpostare la password.';
  } catch (err) {
    errore.value = err.response?.data?.error || 'Errore di connessione al server';
  }
}
</script>
