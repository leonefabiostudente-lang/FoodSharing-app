import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'   // <--- IMPORTANTE

createApp(App)
  .use(router)                  // <--- AGGIUNTO
  .mount('#app')
