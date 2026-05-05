import { createRouter, createWebHistory } from "vue-router";

import ListaAnnunci from "../components/ListaAnnunci.vue";
import FormAnnuncio from "../components/FormAnnuncio.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

const routes = [
  { path: "/", component: ListaAnnunci },
  { path: "/nuovo-annuncio", component: FormAnnuncio },
  { path: "/login", component: Login },
  { path: "/register", component: Register }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
