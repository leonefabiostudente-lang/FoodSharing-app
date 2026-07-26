<template>
  <div class="home-root">
    
    <section class="card hero-card" aria-labelledby="hero-title">
      <div class="hero-left">
        <div class="hero-glow-card">
          <h3 id="hero-title">{{ $t('home.title') }}</h3>
          <p class="hero-desc">
            {{ $t('home.description') }}
          </p>
        </div>

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

const baseCarouselSlides = [
  { src: chiesa, alt: "Chiesa" },
  { src: mare, alt: "Mare" },
  { src: tramonto, alt: "Tramonto" },
  { src: fuochi, alt: "Fuochi" },
];

const carouselSlides = [...baseCarouselSlides, ...baseCarouselSlides];

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

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hero-glow-card {
  position: relative;
  padding: 1.15rem 1.25rem;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,248,232,0.9));
  box-shadow: 0 0 0 1px rgba(255,255,255,0.6), 0 0 20px rgba(255, 196, 87, 0.25), 0 0 40px rgba(255, 155, 77, 0.12);
  overflow: hidden;
}

.hero-glow-card::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(120deg, rgba(255,255,255,0.0), rgba(255,196,87,0.35), rgba(255,255,255,0.0));
  transform: translateX(-100%);
  animation: shimmer 4s linear infinite;
  pointer-events: none;
}

.carousel-track-container {
  width: min(100%, 820px);
  overflow: hidden;
  border-radius: 24px;
  padding: 0.8rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,246,224,0.9));
  box-shadow: 0 0 0 1px rgba(255,255,255,0.65), 0 0 22px rgba(255,190,86,0.24), 0 0 50px rgba(255,150,70,0.16);
  position: relative;
}

.carousel-track-container::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 26px;
  background: linear-gradient(120deg, rgba(255,255,255,0.0), rgba(255,196,87,0.35), rgba(255,255,255,0.0));
  transform: translateX(-100%);
  animation: shimmer 5s linear infinite;
  pointer-events: none;
}

.carousel-track {
  --slide-width: 320px;
  --gap: 18px;
  --set-width: calc((var(--slide-width) * 4) + (var(--gap) * 3) + 330px);
  display: flex;
  gap: var(--gap);
  width: max-content;
  animation: scrollCarousel 32s linear infinite;
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
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
