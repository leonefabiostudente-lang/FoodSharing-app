<template>
  <div class="home-root">
    
    <section class="card hero-card" aria-labelledby="hero-title">
      <div class="hero-left">
        <h3 id="hero-title">{{ $t('home.title') }}</h3>
        <p class="hero-desc">
          {{ $t('home.description') }}
        </p>

        <nav class="hero-links" aria-label="Azioni principali">
          <router-link class="btn-primary" to="/eventi">{{ $t('nav.announcements') }}</router-link>
          <router-link class="btn-primary" to="/nuovo-evento">{{ $t('nav.newAnnouncement') }}</router-link>
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
            <div v-for="(slide, index) in carouselSlides" :key="`${slide.alt}-${index}`" class="carousel-slide">
              <img :src="slide.src" :alt="slide.alt" />
            </div>
          </div>
        </div>
      </div> 
    </section>

    <section class="home-section steps-section">
      <h2 class="section-title">{{ $t('home.features.title') }}</h2>
      <div class="steps-grid">
        <div class="step-card card">
          <div class="step-icon">📅</div>
          <h4>{{ $t('home.features.feature1') }}</h4>
          <p>{{ $t('home.features.feature1Desc') }}</p>
        </div>
        <div class="step-card card">
          <div class="step-icon">📍</div>
          <h4>{{ $t('home.features.feature2') }}</h4>
          <p>{{ $t('home.features.feature2Desc') }}</p>
        </div>
        <div class="step-card card">
          <div class="step-icon">🎭</div>
          <h4>{{ $t('home.features.feature3') }}</h4>
          <p>{{ $t('home.features.feature3Desc') }}</p>
        </div>
      </div>
    </section>

    <section class="home-section stats-section">
      <h2 class="section-title">{{ $t('home.subtitle') }}</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">320+</span>
          <span class="stat-label">Eventi pubblicati</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">42</span>
          <span class="stat-label">Comuni coinvolti</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">12k</span>
          <span class="stat-label">Visite mensili</span>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import chiesa from "@/assets/images/chiesa.webp";
import fuochi from "@/assets/images/fuochi.webp";
import tramonto from "@/assets/images/tramonto.webp";
import mare from "@/assets/images/mare.webp";

const carouselSlides = [
  { src: chiesa, alt: "Chiesa" },
  { src: mare, alt: "Mare" },
  { src: tramonto, alt: "Tramonto" },
  { src: fuochi, alt: "Fuochi" },
].flatMap((slide) => [slide, slide]);

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

<style scoped>
.home-root {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-track-container {
  width: min(100%, 520px);
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
}

.carousel-track {
  --slide-width: 320px;
  --gap: 18px;
  --set-width: calc((var(--slide-width) * 4) + (var(--gap) * 3));
  display: flex;
  gap: var(--gap);
  width: max-content;
  animation: scrollCarousel 24s linear infinite;
  will-change: transform;
}

.carousel-slide {
  flex: 0 0 var(--slide-width);
  height: 240px;
  border-radius: 20px;
  overflow: hidden;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@keyframes scrollCarousel {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-1 * var(--set-width)));
  }
}

@media (max-width: 768px) {
  .carousel-track {
    --slide-width: 280px;
    --gap: 14px;
  }

  .carousel-slide {
    height: 220px;
  }
}
</style>
