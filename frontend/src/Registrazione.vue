<template>
  <div>
    <h2 class="page-title">Registrazione</h2>

    <form class="form-box" @submit.prevent="register">
      <input type="text" v-model="nome" placeholder="Nome" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />

      <button>Registrati</button>
    </form>
  </div>
</template>
