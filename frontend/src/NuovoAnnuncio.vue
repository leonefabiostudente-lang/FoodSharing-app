<template>
  <div>
    <h2 class="page-title">Pubblica un nuovo annuncio</h2>

    <form class="form-box" @submit.prevent="creaAnnuncio">
      <input type="text" v-model="titolo" placeholder="Titolo" required />

      <textarea v-model="descrizione" placeholder="Descrizione" rows="4" required></textarea>

      <select v-model="categoria" required>
        <option disabled value="">Seleziona categoria</option>
        <option>Frutta</option>
        <option>Verdura</option>
        <option>Pane</option>
        <option>Altro</option>
      </select>

      <button>Pubblica</button>
    </form>
  </div>
</template>
