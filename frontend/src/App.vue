<template>
  <div class="app-container" :class="{ 'dark-mode': dark }">
    <nav class="navbar">
      <div class="brand-wrap">
        <h1 class="logo">
          <span class="leaf">🍃</span>
          <span class="brand">Food Sharing</span>
        </h1>

        <button class="mobile-toggle" @click="open = !open">
          <span v-if="!open">☰</span>
          <span v-else>✕</span>
        </button>
      </div>

      <div class="nav-links" :class="{ open: open }">
        <router-link to="/" @click="open = false">{{ $t('nav.home') }}</router-link>
        <router-link to="/presentazione" @click="open = false">{{ $t('nav.presentation') }}</router-link>
        <router-link to="/annunci" @click="open = false">{{ $t('nav.announcements') }}</router-link>
        <router-link to="/nuovo-annuncio" @click="open = false">{{ $t('nav.newAnnouncement') }}</router-link>
        <router-link to="/login" @click="open = false">{{ $t('nav.login') }}</router-link>
        <router-link to="/register" @click="open = false">{{ $t('nav.register') }}</router-link>

        <select class="language-select" @change="changeLanguage" :value="currentLanguage">
          <option value="it">🇮🇹 Italiano</option>
          <option value="en">🇬🇧 English</option>
        </select>

        <button class="dark-toggle" @click="toggleDarkMode">
          <span v-if="!dark">🌙</span>
          <span v-else>☀️</span>
        </button>
      </div>
    </nav>

    <main class="content">
      <router-view />
    </main>

    <footer class="footer">
      {{ $t('footer.copyright') }}
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const dark = ref(false);
const open = ref(false);
const currentLanguage = ref(localStorage.getItem('language') || 'it');

function toggleDarkMode() {
  dark.value = !dark.value;
  document.body.classList.toggle('dark-mode', dark.value);
}

function changeLanguage(event) {
  const newLanguage = event.target.value;
  currentLanguage.value = newLanguage;
  locale.value = newLanguage;
  localStorage.setItem('language', newLanguage);
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

 .navbar {
  background-color: #2c3e50;
  color: white;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: none;
}

.logo {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.leaf {
  font-size: 1.8rem;
}

.brand {
  color: #42b983;
}

.nav-links {
  display: flex;
  gap: 0.65rem;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-links a.router-link-active {
  background-color: #42b983;
}

.language-select {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: none;
  background-color: white;
  color: #2c3e50;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.language-select option {
  color: #2c3e50;
}

.dark-mode .language-select {
  background-color: #353a42;
  color: #f5f5f5;
}

.language-select:hover {
  background-color: #f0f0f0;
}

.dark-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.dark-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: 2rem;
  font-size: 0.9rem;
}

/* Dark mode */
:global(.dark-mode) .app-container {
  background-color: #1a1a1a;
}

:global(.dark-mode) .navbar,
:global(.dark-mode) .footer {
  background-color: #0d0d0d;
}

:global(.dark-mode) .content {
  color: #f0f0f0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    padding: 0.8rem 0.9rem;
  }

  .mobile-toggle {
    display: block;
  }

  .brand-wrap {
    width: auto;
  }

  .nav-links {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    padding-top: 0.5rem;
  }

  .nav-links.open {
    max-height: 500px;
  }

  .nav-links a,
  .language-select,
  .dark-toggle {
    width: 100%;
    text-align: center;
  }

  .content {
    padding: 1rem;
  }
}
</style>
