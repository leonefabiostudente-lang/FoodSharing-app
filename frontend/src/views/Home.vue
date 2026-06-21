<template>
  <div class="home-root">
    
    <section class="card hero-card" aria-labelledby="hero-title">
      <div class="hero-left">
        <h3 id="hero-title">{{ $t('home.title') }}</h3>
        <p class="hero-desc">
          {{ $t('home.description') }}
        </p>

        <nav class="hero-links" aria-label="Azioni principali">
          <router-link class="btn-primary" to="/annunci">{{ $t('nav.announcements') }}</router-link>
          <router-link class="btn-primary" to="/nuovo-annuncio">{{ $t('nav.newAnnouncement') }}</router-link>
          <router-link v-if="!isLogged" class="btn-outline" to="/login">{{ $t('nav.login') }}</router-link>
          <router-link v-if="!isLogged" class="btn-outline" to="/register">{{ $t('nav.register') }}</router-link>
          <span v-else class="hero-auth-state">{{ $t('nav.authenticated') }}</span>
        </nav>

        <p class="hero-note">
          {{ $t('home.subtitle') }}
        </p>
      </div>

      <div class="hero-right">
        <div class="carousel-track-container">
          <div class="carousel-track">
            <div class="carousel-slide"><img src="@/assets/images/pomodorini.webp" alt="Food" /></div>
            <div class="carousel-slide"><img src="@/assets/images/buste_cibo.webp" alt="Food packages" /></div>
            <div class="carousel-slide"><img src="@/assets/images/donazione.webp" alt="Donation" /></div>
            <div class="carousel-slide"><img src="@/assets/images/unione.webp" alt="Community" /></div>
            <div class="carousel-slide"><img src="@/assets/images/pomodorini.webp" alt="Food" /></div>
            <div class="carousel-slide"><img src="@/assets/images/buste_cibo.webp" alt="Food packages" /></div>
            <div class="carousel-slide"><img src="@/assets/images/donazione.webp" alt="Donation" /></div>
            <div class="carousel-slide"><img src="@/assets/images/unione.webp" alt="Community" /></div>
          </div>
        </div>
      </div> 
    </section>

    <section class="home-section steps-section">
      <h2 class="section-title">{{ $t('home.features.title') }} 🍃</h2>
      <div class="steps-grid">
        <div class="step-card card">
          <div class="step-icon">✍️</div>
          <h4>{{ $t('home.features.feature1') }}</h4>
          <p>{{ $t('home.features.feature1Desc') }}</p>
        </div>
        <div class="step-card card">
          <div class="step-icon">💬</div>
          <h4>{{ $t('home.features.feature2') }}</h4>
          <p>{{ $t('home.features.feature2Desc') }}</p>
        </div>
        <div class="step-card card">
          <div class="step-icon">🤝</div>
          <h4>{{ $t('home.features.feature3') }}</h4>
          <p>{{ $t('home.features.feature3Desc') }}</p>
        </div>
      </div>
    </section>

    <section class="home-section stats-section">
      <h2 class="section-title">{{ $t('home.subtitle') }} 🌍</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">1.250+</span>
          <span class="stat-label">Kg di Cibo Salvato</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">450+</span>
          <span class="stat-label">{{ $t('announcements.title') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">85%</span>
          <span class="stat-label">Exchanges Successful</span>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";

const isLogged = ref(Boolean(localStorage.getItem("token")));

function syncAuthState() {
  isLogged.value = Boolean(localStorage.getItem("token"));
}

function handleStorageChange(event) {
  if (event.key === "token") {
    syncAuthState();
  }
}

function handleAuthChange() {
  syncAuthState();
}

onMounted(() => {
  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("auth-change", handleAuthChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("storage", handleStorageChange);
  window.removeEventListener("auth-change", handleAuthChange);
});
</script>