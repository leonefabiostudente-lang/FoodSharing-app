<template>
  <div class="presentation-container">
    <h1>{{ $t('presentation.title') }}</h1>
    <p class="presentation-subtitle">{{ $t('presentation.subtitle') }}</p>
    
    <div class="presentation-wrapper">
      <iframe 
        loading="lazy" 
        src="https://www.canva.com/design/DAHNOE48jig/kegAsqRFhRbP_6PP19UkPw/view?embed" 
        allowfullscreen="allowfullscreen" 
        allow="fullscreen"
        class="canva-iframe">
      </iframe>
    </div>

    <div class="presentation-link">
      <a 
        href="https://www.canva.com/design/DAHNOE48jig/kegAsqRFhRbP_6PP19UkPw/view?utm_content=DAHNOE48jig&utm_campaign=designshare&utm_medium=embeds&utm_source=link" 
        target="_blank" 
        rel="noopener"
        class="external-link">
        {{ $t('presentation.openFull') }}
      </a>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.presentation-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
}

.presentation-container h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.presentation-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.presentation-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 56.2500%;
  padding-bottom: 0;
  box-shadow: 0 2px 8px 0 rgba(63, 69, 81, 0.16);
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-radius: 8px;
  will-change: transform;
}

.canva-iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: none;
  padding: 0;
  margin: 0;
}

.presentation-link {
  margin-top: 1.5rem;
}

.external-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.external-link:hover {
  background-color: #45a049;
}

/* Dark mode support */
:global(.dark-mode) .presentation-container h1 {
  color: #f0f0f0;
}

:global(.dark-mode) .presentation-subtitle {
  color: #b0b0b0;
}

@media (max-width: 768px) {
  .presentation-container {
    padding: 1rem;
    margin: 1rem auto;
  }

  .presentation-container h1 {
    font-size: 1.5rem;
  }

  .presentation-subtitle {
    font-size: 1rem;
  }
}
</style>
