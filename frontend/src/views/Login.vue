<template>
  <div class="login-wrapper">
    <h2>Accedi</h2>

    <div class="form-group">
      <label>Email</label>
      <input v-model.trim="email" type="email" />
    </div>

    <div class="form-group">
      <label>Password</label>
      <input v-model.trim="password" type="password" />
    </div>

    <button class="login-btn" @click="login">Accedi</button>

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
    router.push("/annunci");

  } catch (err) {
    if (err.response?.data?.error) {
      errore.value = err.response.data.error;
    } else {
      errore.value = "Errore di connessione al server";
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  max-width: 420px;
  margin: 80px auto;
  padding: 32px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

h2 {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-weight: 600;
  font-size: 14px;
}

input {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 15px;
  transition: border 0.2s ease;
}

input:focus {
  border-color: #4f46e5;
  outline: none;
}

.login-btn {
  margin-top: 10px;
  padding: 12px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.login-btn:hover {
  background: #4338ca;
}

.error-box {
  margin-top: 10px;
  padding: 12px;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 10px;
  font-weight: 600;
  text-align: center;
}
</style>