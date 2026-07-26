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
        <div class="carousel-track-container" role="region" aria-label="Galleria immagini home">
          <div class="carousel-track">
            <div
              v-for="(image, index) in heroImages"
              :key="`${image.alt}-${index}`"
              class="carousel-slide"
              :class="{ active: index === activeIndex }"
            >
              <img
                v-if="index === activeIndex"
                :src="image.src"
                :alt="image.alt"
                loading="lazy"
                decoding="async"
                class="hero-image"
              />
              <div class="carousel-caption">{{ image.alt }}</div>
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

const heroImages = [
  { src: chiesa, alt: "Chiesa" },
  { src: fuochi, alt: "Fuochi" },
  { src: tramonto, alt: "Tramonto" },
  { src: mare, alt: "Mare" },
];

const isLogged = ref(Boolean(localStorage.getItem("token")));
const activeIndex = ref(0);
let autoplayTimer = null;

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

function nextSlide() {
  activeIndex.value = (activeIndex.value + 1) % heroImages.length;
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = window.setInterval(() => {
    nextSlide();
  }, 6500);
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

onMounted(() => {
  syncAuthState();
  startAutoplay();
  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("auth-change", handleAuthChange);
});

onBeforeUnmount(() => {
  stopAutoplay();
  window.removeEventListener("storage", handleStorageChange);
  window.removeEventListener("auth-change", handleAuthChange);
});
</script>

<style scoped>
.hero-right {
  display: flex;
  justify-content: center;
}

.carousel-track-container {
  position: relative;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 4 / 3;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
}

.carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(0.98);
  transition: opacity 1s ease, transform 1s ease;
}

.carousel-slide.active {
  opacity: 1;
  transform: scale(1.02);
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.hero-image {
  filter: contrast(1.02) saturate(0.95);
  bottom: 14px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.72);
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  backdrop-filter: blur(6px);
}
</style>
