import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Verify from "../views/Verify.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
// Importi le viste (pagine) e non i singoli componenti strutturali
import AnnunciView from "../views/AnnunciView.vue";
import NuovoAnnuncioView from "../views/NuovoAnnuncioView.vue";
import PresentationView from "../views/PresentationView.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/annunci", component: AnnunciView },
  { path: "/nuovo-annuncio", component: NuovoAnnuncioView },
  { path: "/presentazione", component: PresentationView },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/verify", component: Verify },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password", component: ResetPassword },
  { path: "/:pathMatch(.*)*", redirect: "/" }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const authPages = ["/login", "/register"];

  if (token && authPages.includes(to.path)) {
    return "/annunci";
  }

  return true;
});

export default router;