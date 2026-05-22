<template>
  <div class="home-root">
    <section class="card hero-card" aria-labelledby="hero-title">
      <div class="hero-left">
        <h3 id="hero-title">Cos'è <span class="brand">Antispreco</span>?</h3>

        <p class="hero-desc">
          Antispreco è una piattaforma per condividere prodotti alimentari in scadenza e ridurre gli sprechi.
          Metti in condivisione ciò che non useresti, ritira ciò che ti serve: semplice, sicuro e gratuito.
        </p>

        <nav class="hero-links" aria-label="Azioni principali">
          <router-link class="btn-primary" to="/annunci">Vai agli annunci</router-link>
          <router-link class="btn-outline" to="/nuovo-annuncio">Pubblica un annuncio</router-link>
          <router-link class="btn-ghost" to="/login">Login</router-link>
          <router-link class="btn-ghost" to="/register">Registrati</router-link>
        </nav>

        <p class="hero-note">
          Aiuta la tua comunità: ritira o dona cibo vicino a te. Nessun costo, solo solidarietà.
        </p>
      </div>

      <div class="hero-right" aria-hidden="false">
        <div class="img-grid" role="list">
  <img
    role="listitem"
    src="https://images.pexels.com/photos/6646910/pexels-photo-6646910.jpeg?auto=compress&cs=tinysrgb&w=600"
    alt="Volontari che servono cibo in un centro di distribuzione"
    loading="lazy"
  />
  <img
    role="listitem"
    src="https://images.pexels.com/photos/6995240/pexels-photo-6995240.jpeg?auto=compress&cs=tinysrgb&w=600"
    alt="Scatola per donazioni alimentari con generi di prima necessità"
    loading="lazy"
  />
  <img
    role="listitem"
    src="https://images.pexels.com/photos/6646912/pexels-photo-6646912.jpeg?auto=compress&cs=tinysrgb&w=600"
    alt="Volontari che smistano donazioni alimentari in una mensa"
    loading="lazy"
  />
  <img
    role="listitem"
    src="https://images.pexels.com/photos/6646905/pexels-photo-6646905.jpeg?auto=compress&cs=tinysrgb&w=600"
    alt="Persone che ricevono cibo in una distribuzione comunitaria"
    loading="lazy"
  />
</div>
      </div>
    </section>
  </div>
</template>

<script setup>
// nessuna logica per ora
</script>

<style scoped>
.home-root {
  padding: 36px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

/* Hero card principale */
.hero-card {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 28px;
  align-items: center;
  padding: 28px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(79,70,229,0.06), rgba(47,133,90,0.04));
  border: 1px solid rgba(79,70,229,0.10);
  box-shadow: 0 20px 50px rgba(16,24,40,0.06);
}

/* Colonna sinistra: testo e link */
.hero-left {
  padding-right: 6px;
}

#hero-title {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 800;
  color: #0f1724;
  letter-spacing: -0.4px;
}

.brand {
  background: linear-gradient(90deg, #2f855a, #4f46e5, #ff6b6b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding: 2px 6px;
  border-radius: 6px;
  transform: skewX(-6deg);
  font-size: 30px;
  margin-left: 6px;
}

/* Descrizione */
.hero-desc {
  margin: 10px 0 18px;
  color: #334155;
  line-height: 1.5;
  font-size: 16px;
}

/* Link / CTA */
.hero-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.btn-primary {
  padding: 10px 16px;
  border-radius: 10px;
  background: linear-gradient(90deg, #4f46e5, #2f855a);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 28px rgba(79,70,229,0.12);
}

.btn-outline {
  padding: 10px 16px;
  border-radius: 10px;
  background: transparent;
  color: #0f1724;
  border: 1px solid rgba(15,23,42,0.08);
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-ghost {
  padding: 10px 14px;
  border-radius: 10px;
  background: transparent;
  color: #0f1724;
  border: none;
  font-weight: 700;
  text-decoration: none;
}

/* Nota sotto le CTA */
.hero-note {
  margin-top: 8px;
  color: #475569;
  font-size: 14px;
}

/* Colonna destra: galleria immagini */
.hero-right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  max-width: 420px;
}

.img-grid img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 8px 20px rgba(16,24,40,0.06);
  display: block;
}

/* Responsive: su mobile la hero diventa colonna e le immagini sotto */
@media (max-width: 880px) {
  .hero-card {
    grid-template-columns: 1fr;
  }
  .img-grid img {
    height: 140px;
  }
  .hero-right {
    margin-top: 12px;
  }
}

/* Dark mode overrides (se usi .dark-mode globalmente) */
.app-container.dark-mode .hero-card,
body.dark-mode .hero-card {
  background: linear-gradient(135deg, rgba(12,14,20,0.6), rgba(18,18,20,0.8));
  border: 1px solid rgba(255,255,255,0.03);
  box-shadow: 0 18px 40px rgba(0,0,0,0.6);
}
.app-container.dark-mode .hero-desc,
body-dark .hero-desc,
.app-container.dark-mode .hero-note,
body-dark .hero-note {
  color: rgba(230,238,240,0.9);
}
.app-container.dark-mode .btn-primary,
body-dark .btn-primary {
  background: linear-gradient(90deg, #7c6cff, #34d399);
}
.app-container.dark-mode .btn-outline,
body-dark .btn-outline,
.app-container.dark-mode .btn-ghost,
body-dark .btn-ghost {
  color: rgba(230,238,240,0.95);
  border-color: rgba(255,255,255,0.04);
}
</style>