<template>
  <div class="app-container">
    <nav class="navbar">
      <button class="dark-toggle" @click="toggleDarkMode">
  🌙
</button>

      <h1 class="logo">
  <span class="leaf">🍃</span> Antispreco
</h1>


      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Registrati</router-link>
        <router-link to="/nuovo-annuncio">Nuovo annuncio</router-link>
      </div>
    </nav>

    <main class="content">
      <router-view />
    </main>

    <footer class="footer">
      © 2024 Antispreco – Progetto scolastico
    </footer>
  </div>
</template>
<script setup>
import { ref } from "vue";

const dark = ref(false);

function toggleDarkMode() {
  dark.value = !dark.value;
  document.body.classList.toggle("dark-mode");
}
</script>



<style>
/* PALETTE COLORI */
:root {
  --primary: #2ecc71;
  --primary-dark: #27ae60;
  --bg: #f5f5f5;
  --text: #333;
}

/* STRUTTURA GENERALE */
body {
  background: var(--bg);
  color: var(--text);
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* NAVBAR */
.navbar {
  background: var(--primary);
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}


.nav-links a {
  color: white;
  margin-left: 15px;
  text-decoration: none;
  font-weight: bold;
}

.nav-links a:hover {
  text-decoration: underline;
}

/* CONTENUTO */
.content {
  flex: 1;
  padding: 20px;
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 15px;
  background: #eee;
  color: #555;
  margin-top: 20px;
  font-size: 14px;
}
/* CARD GENERICA */
.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

/* TITOLI PAGINA */
.page-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--primary-dark);
}

/* FORM GENERICO */
.form-box {
  max-width: 400px;
  margin: auto;
}

.form-box input,
.form-box textarea,
.form-box select {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.form-box button {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
}

.form-box button:hover {
  background: var(--primary-dark);
}
.logo {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
}

.leaf {
  font-size: 26px;
}
.dark-toggle {
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
  margin-left: 15px;
}

body.dark-mode {
  background: #1e1e1e;
  color: #eee;
}

body.dark-mode .navbar {
  background: #111;
}

body.dark-mode .card {
  background: #2a2a2a;
  color: #eee;
}

body.dark-mode .footer {
  background: #111;
  color: #aaa;
}


</style>



