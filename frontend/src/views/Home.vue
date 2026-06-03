<template>
  <div class="home-root">
    <section class="card hero-card" aria-labelledby="hero-title">
      <div class="hero-left">
        <h3 id="hero-title">Cos'è <span class="brand-text">Antispreco</span>?</h3>
        <p class="hero-desc">
          Antispreco è una piattaforma per condividere prodotti alimentari in scadenza e ridurre gli sprechi.
          Metti in condivisione ciò che non useresti, ritira ciò che ti serve: semplice, sicuro e gratuito.
        </p>

        <nav class="hero-links" aria-label="Azioni principali">
          <router-link class="btn-primary" to="/annunci">Vai agli annunci</router-link>
          <router-link class="btn-primary" to="/nuovo-annuncio">Pubblica un annuncio</router-link>
          <router-link v-if="!isLogged" class="btn-outline" to="/login">Login</router-link>
          <router-link v-if="!isLogged" class="btn-outline" to="/register">Registrati</router-link>
        </nav>

        <p class="hero-note">
          Aiuta la tua comunità: ritira o dona cibo vicino a te. Nessun costo, solo solidarietà.
        </p>
      </div>

     <div class="hero-right">
  <div class="carousel-track-container">
    <div class="carousel-track">
      <div class="carousel-slide"><img src="@/assets/images/pomodorini.webp" alt="Pomodorini" /></div>
      <div class="carousel-slide"><img src="@/assets/images/buste_cibo.webp" alt="Buste cibo" /></div>
      <div class="carousel-slide"><img src="@/assets/images/donazione.webp" alt="Donazione" /></div>
      <div class="carousel-slide"><img src="@/assets/images/unione.webp" alt="Unione" /></div>
      <div class="carousel-slide"><img src="@/assets/images/pomodorini.webp" alt="Pomodorini" /></div>
      <div class="carousel-slide"><img src="@/assets/images/buste_cibo.webp" alt="Buste cibo" /></div>
      <div class="carousel-slide"><img src="@/assets/images/donazione.webp" alt="Donazione" /></div>
      <div class="carousel-slide"><img src="@/assets/images/unione.webp" alt="Unione" /></div>
    </div>
  </div>
</div> 
    </section>

    <section class="home-section steps-section">
      <h2 class="section-title">Come funziona? In soli 3 passi 🍃</h2>
      <div class="steps-grid">
        <div class="step-card card">
          <div class="step-icon">✍️</div>
          <h4>1. Pubblica</h4>
          <p>Scatta una foto al cibo in eccesso o in scadenza che non riuscirai a consumare e inserisci un annuncio.</p>
        </div>
        <div class="step-card card">
          <div class="step-icon">💬</div>
          <h4>2. Accordati</h4>
          <p>Gli utenti vicini a te visualizzeranno l'annuncio sulla mappa e ti contatteranno per il ritiro gratuito.</p>
        </div>
        <div class="step-card card">
          <div class="step-icon">🤝</div>
          <h4>3. Salva il cibo</h4>
          <p>Incontratevi in sicurezza per lo scambio. Zero sprechi, più solidarietà e una comunità più unita.</p>
        </div>
      </div>
    </section>

    <section class="home-section stats-section card">
      <h2 class="section-title">Il nostro impatto collettivo 🌍</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">1.250+</span>
          <span class="stat-label">Kg di Cibo Salvato</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">450+</span>
          <span class="stat-label">Annunci Pubblicati</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">85%</span>
          <span class="stat-label">Scambi Riusciti</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
const isLogged = ref(!!localStorage.getItem("token"));
</script>