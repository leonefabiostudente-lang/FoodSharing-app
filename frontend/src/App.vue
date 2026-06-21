<template>
  <div class="app-container" :class="{ 'dark-mode': dark }">
    <nav class="navbar">
      <div class="brand-wrap">
        <h1 class="logo">
          <span class="leaf">🍃</span>
          <span class="brand">Food Sharing</span>
        </h1>

        <button class="mobile-toggle" @click="open = !open" aria-label="Toggle menu">
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

        <div class="language-switcher" aria-label="Language selector">
          <button class="language-btn" :class="{ active: currentLanguage === 'it' }" @click="changeLanguage('it')" type="button">
            🇮🇹 IT
          </button>
          <button class="language-btn" :class="{ active: currentLanguage === 'en' }" @click="changeLanguage('en')" type="button">
            🇬🇧 EN
          </button>
        </div>

        <button class="dark-toggle" @click="toggleDarkMode" type="button">
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

function changeLanguage(newLanguage) {
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
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  position: sticky;
  top: 0;
  z-index: 1000;
  flex-wrap: nowrap;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: none;
  white-space: nowrap;
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
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  flex-wrap: wrap;
  min-width: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  font-weight: 600;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-links a.router-link-active {
  background-color: #42b983;
  color: #082414;
}

.language-switcher {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.language-btn {
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: white;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
}

.language-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

.language-btn.active {
  background: #42b983;
  color: #072a18;
  border-color: #42b983;
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
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.65rem;
  cursor: pointer;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  transition: background-color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}

.mobile-toggle:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.mobile-toggle:focus-visible,
.dark-toggle:focus-visible,
.language-btn:focus-visible,
.nav-links a:focus-visible {
  outline: 2px solid #42b983;
  outline-offset: 2px;
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

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    align-items: stretch;
    padding: 0.8rem 0.9rem 0.6rem;
  }

  .mobile-toggle {
    display: inline-flex;
  }

  .brand-wrap {
    width: 100%;
    justify-content: space-between;
  }

  .nav-links {
    display: none;
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.75rem;
    flex-basis: 100%;
    justify-content: flex-start;
    align-items: stretch;
    background: #2c3e50;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links a,
  .language-switcher,
  .dark-toggle {
    width: 100%;
    text-align: center;
  }

  .nav-links a {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.04);
  }

  .nav-links a:hover,
  .nav-links a.router-link-active {
    background-color: rgba(66, 185, 131, 0.2);
    color: #ffffff;
  }

  .dark-toggle {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.06);
  }

  .language-switcher {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .language-btn {
    flex: 1;
    max-width: 140px;
  }

  .content {
    padding: 1rem;
  }
}

@media (max-width: 1024px) {
  .nav-links {
    gap: 0.45rem;
  }

  .nav-links a {
    padding: 0.45rem 0.7rem;
    font-size: 0.95rem;
  }
}
</style>
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
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  position: sticky;
  top: 0;
  z-index: 1000;
  flex-wrap: nowrap;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: none;
  white-space: nowrap;
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
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  flex-wrap: wrap;
  min-width: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  font-weight: 600;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-links a.router-link-active {
  background-color: #42b983;
  color: #082414;
}

.language-switcher {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.language-btn {
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: white;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
}

.language-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

.language-btn.active {
  background: #42b983;
  color: #072a18;
  border-color: #42b983;
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
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.65rem;
  cursor: pointer;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  transition: background-color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}

.mobile-toggle:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.mobile-toggle:focus-visible,
.dark-toggle:focus-visible,
.language-btn:focus-visible,
.nav-links a:focus-visible {
  outline: 2px solid #42b983;
  outline-offset: 2px;
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
    align-items: stretch;
    padding: 0.8rem 0.9rem 0.6rem;
  }

  .mobile-toggle {
    display: inline-flex;
  }

  .brand-wrap {
    width: 100%;
    justify-content: space-between;
  }

  .nav-links {
    display: none;
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.75rem;
    flex-basis: 100%;
    justify-content: flex-start;
    align-items: stretch;
    background: #2c3e50;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links a,
  .language-switcher,
  .dark-toggle {
    width: 100%;
    text-align: center;
  }

  .nav-links a {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.04);
  }

  .nav-links a:hover,
  .nav-links a.router-link-active {
    background-color: rgba(66, 185, 131, 0.2);
    color: #ffffff;
  }

  .dark-toggle {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.06);
  }

  .language-switcher {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .language-btn {
    flex: 1;
    max-width: 140px;
  }

  .content {
    padding: 1rem;
  }
}

@media (max-width: 1024px) {
  .nav-links {
    gap: 0.45rem;
  }

  .nav-links a {
    padding: 0.45rem 0.7rem;
    font-size: 0.95rem;
  }
}
</style>
