import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // <--- IMPORTANTE
import i18n from './i18n'       // <--- AGGIUNTO
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/minty/bootstrap.min.css';
import './assets/styles/global.css';
import 'bootstrap';

const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

if (gaMeasurementId) {
  const gaScript = document.createElement('script')
  gaScript.async = true
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`
  document.head.appendChild(gaScript)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }

  gtag('js', new Date())
  gtag('config', gaMeasurementId)
}

createApp(App)
  .use(router)                  // <--- AGGIUNTO
  .use(i18n)                    // <--- AGGIUNTO
  .mount('#app')
