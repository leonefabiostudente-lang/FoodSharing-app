import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // <--- IMPORTANTE
import i18n from './i18n'       // <--- AGGIUNTO
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/minty/bootstrap.min.css';
import './assets/styles/global.css';
import 'bootstrap';

createApp(App)
  .use(router)                  // <--- AGGIUNTO
  .use(i18n)                    // <--- AGGIUNTO
  .mount('#app')
