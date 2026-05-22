<template>
  <div class="app-container" :class="{ 'dark-mode': dark }">
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="brand-wrap">
        <h1 class="logo" aria-label="Antispreco">
          <span class="leaf" aria-hidden="true">🍃</span>
          <span class="brand">Antispreco</span>
        </h1>
        <button class="mobile-toggle" @click="open = !open" :aria-expanded="open" aria-label="Apri menu">
          <span v-if="!open">☰</span>
          <span v-else>✕</span>
        </button>
      </div>

      <div class="nav-links" :class="{ open: open }">
        <router-link to="/" @click.native="open = false">Home</router-link>
        <router-link to="/annunci" @click.native="open = false">Annunci</router-link>
        <router-link to="/nuovo-annuncio" @click.native="open = false">Nuovo annuncio</router-link>
        <router-link to="/login" @click.native="open = false">Login</router-link>
        <router-link to="/register" @click.native="open = false">Registrati</router-link>

        <button
          class="dark-toggle"
          @click="toggleDarkMode"
          :aria-pressed="dark"
          aria-label="Toggle dark mode"
        >
          <span v-if="!dark">🌙</span>
          <span v-else>☀️</span>
        </button>
      </div>
    </nav>

    <main class="content">
      <router-view />
    </main>

    <footer class="footer">
      © 2026 Antispreco – Progetto scolastico
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const dark = ref(false);
const open = ref(false);

function toggleDarkMode() {
  dark.value = !dark.value;
  document.body.classList.toggle('dark-mode', dark.value);
}
</script>

<style>
:root{
  --bg: #fbfcfd;
  --card: #ffffff;
  --muted: #6b6b6b;
  --accent-1: #2f855a;
  --accent-2: #ff6b6b;
  --accent-3: #4f46e5;
  --radius: 12px;
  --shadow: 0 8px 24px rgba(20,20,20,0.06);
  --nav-height: 72px;
}

/* Base + texture */
body {
  margin: 0;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
  background: linear-gradient(180deg, #fbfcfd 0%, #f6f8fa 100%);
  color: #111827;
  -webkit-font-smoothing:antialiased;
  background-image:
    radial-gradient(circle at 10% 10%, rgba(79,70,229,0.03) 0px, transparent 40px),
    radial-gradient(circle at 90% 90%, rgba(245,158,11,0.02) 0px, transparent 60px);
}

/* Dark mode */
.app-container.dark-mode,
body.dark-mode {
  background: linear-gradient(180deg, #071022 0%, #0b1020 100%);
  color: #e6eef0;
}

/* Layout */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 22px;
  background: linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5));
  backdrop-filter: blur(6px);
  box-shadow: var(--shadow);
  border-bottom: 1px solid rgba(0,0,0,0.04);
  position: sticky;
  top: 0;
  z-index: 20;
}

.app-container.dark-mode .navbar {
  background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-bottom: 1px solid rgba(255,255,255,0.03);
}

/* Brand area */
.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Logo: larger and dynamic */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  line-height: 1;
}

/* leaf */
.leaf {
  font-size: 26px;
  padding: 6px;
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(79,70,229,0.08), rgba(47,133,90,0.06));
}

/* Brand text: big, dynamic gradient, slight tilt for dynamism */
.brand {
  font-size: 28px;               /* aumentato */
  font-weight: 800;
  letter-spacing: -0.6px;
  display: inline-block;
  transform: skewX(-6deg);
  padding: 6px 10px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--accent-3), var(--accent-1), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: hueShift 6s linear infinite;
  text-shadow: 0 6px 18px rgba(79,70,229,0.06);
}

/* Slightly larger on wide screens */
@media (min-width: 1100px) {
  .brand { font-size: 34px; }
}

/* Mobile toggle (hamburger) */
.mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  font-size: 20px;
  padding: 6px;
  cursor: pointer;
}

/* Nav links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform .18s ease, opacity .18s ease;
}

.nav-links a {
  color: #111827;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  position: relative;
  transition: color .18s ease, transform .12s ease;
}

.nav-links a::after {
  content: "";
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 6px;
  height: 3px;
  border-radius: 6px;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform .22s cubic-bezier(.2,.9,.2,1), opacity .18s ease;
  opacity: 0;
  background: linear-gradient(90deg, var(--accent-1), var(--accent-3));
}

.nav-links a:hover {
  transform: translateY(-3px);
  color: #0f1724;
}

.nav-links a:hover::after {
  transform: scaleX(1);
  opacity: 1;
}

/* Active link */
.router-link-active,
.nav-links a.router-link-active {
  color: var(--accent-1);
}

/* Dark mode link colors */
.app-container.dark-mode .nav-links a {
  color: #e6eef0;
  opacity: 0.95;
}
.app-container.dark-mode .nav-links a::after {
  background: linear-gradient(90deg, #34d399, #a78bfa);
}

/* Dark toggle */
.dark-toggle {
  background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3));
  border: 1px solid rgba(0,0,0,0.06);
  padding: 6px 8px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Content and footer */
.content {
  flex: 1;
  padding: 36px 20px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  text-align: center;
  padding: 18px;
  color: var(--muted);
  font-size: 13px;
  border-top: 1px solid rgba(0,0,0,0.04);
  background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4));
}

/* Animation for brand gradient */
@keyframes hueShift {
  0% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(30deg); }
  100% { filter: hue-rotate(0deg); }
}

/* Responsive: collapse menu */
@media (max-width: 820px) {
  .nav-links {
    position: absolute;
    top: var(--nav-height);
    right: 12px;
    background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.95));
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 12px 30px rgba(20,20,20,0.08);
    flex-direction: column;
    gap: 8px;
    transform-origin: top right;
    transform: scale(0.98);
    opacity: 0;
    pointer-events: none;
  }

  .nav-links.open {
    transform: scale(1);
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-toggle { display: inline-flex; }
}
</style>