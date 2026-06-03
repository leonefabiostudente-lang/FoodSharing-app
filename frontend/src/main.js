import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // <--- IMPORTANTE
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

createApp(App)
  .use(router)                  // <--- AGGIUNTO
  .mount('#app')
