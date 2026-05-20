import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import ListaAnnunci from "../components/ListaAnnunci.vue";
import FormAnnuncio from "../components/FormAnnuncio.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

const routes = [
  { path: "/", component: Home },                 // ora la Home è la root
  { path: "/annunci", component: ListaAnnunci },
  { path: "/nuovo-annuncio", component: FormAnnuncio },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/:pathMatch(.*)*", redirect: "/" }     // fallback opzionale
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
