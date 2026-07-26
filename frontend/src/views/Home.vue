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
        <div class="carousel-shell" role="region" aria-label="Galleria immagini home">
          <div class="carousel-track">
            <div
              v-for="(image, index) in heroImages"
              :key="`${image.alt}-${index}`"
              class="carousel-slide"
              :class="{ active: index === activeIndex }"
            >
              <img :src="image.src" :alt="image.alt" loading="lazy" />
              <div class="carousel-caption">{{ image.alt }}</div>
            </div>
          </div>

          <div class="carousel-dots" aria-label="Seleziona immagine">
            <button
              v-for="(image, index) in heroImages"
              :key="`${image.alt}-dot`"
              type="button"
              class="dot"
              :class="{ active: index === activeIndex }"
              @click="activeIndex = index"
              :aria-label="`Vai alla slide ${index + 1}`"
            />
          </div>

          <button type="button" class="carousel-control prev" @click="prevSlide" aria-label="Immagine precedente">
            ‹
          </button>
          <button type="button" class="carousel-control next" @click="nextSlide" aria-label="Immagine successiva">
            ›
          </button>
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

function prevSlide() {
  activeIndex.value = (activeIndex.value - 1 + heroImages.length) % heroImages.length;
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = window.setInterval(() => {
    nextSlide();
  }, 4500);
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
.home-root {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 2rem;
}

.hero-card {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 2rem;
  align-items: center;
  padding: 2rem;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #fff8ef 0%, #ffffff 100%);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08);
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hero-desc,
.hero-note {
  color: #5a5a5a;
  line-height: 1.7;
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.btn-primary,
.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #ff7a1a, #ff5b2e);
  color: white;
  box-shadow: 0 8px 20px rgba(255, 90, 46, 0.22);
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-outline {
  border: 1px solid #d7d7d7;
  color: #333;
  background: white;
}

.btn-outline:hover {
  background: #f7f7f7;
}

.hero-right {
  display: flex;
  justify-content: center;
}

.carousel-shell {
  position: relative;
  width: 100%;
  max-width: 540px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.16);
  background: #fff;
}

.carousel-track {
  position: relative;
  aspect-ratio: 4 / 3;
}

.carousel-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(0.96);
  transition: all 0.7s ease;
}

.carousel-slide.active {
  opacity: 1;
  transform: scale(1);
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-caption {
  position: absolute;
  left: 14px;
  bottom: 14px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.62);
  color: white;
  font-size: 0.95rem;
  backdrop-filter: blur(6px);
}

.carousel-dots {
  position: absolute;
  bottom: 14px;
  right: 14px;
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 0;
}

.dot.active {
  background: white;
  transform: scale(1.2);
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1.4rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.carousel-control.prev {
  left: 12px;
}

.carousel-control.next {
  right: 12px;
}

@media (max-width: 900px) {
  .hero-card {
    grid-template-columns: 1fr;
  }

  .hero-right {
    order: -1;
  }
}
</style>
