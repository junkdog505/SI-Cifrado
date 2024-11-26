<!-- src/views/Register.vue -->

<template>
    <div class="register">
      <h1>Registro</h1>
      <form @submit.prevent="registerUser">
        <div>
          <label for="name">Nombre Completo: </label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div>
          <label for="username">Nombre de usuario: </label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div>
          <label for="password">Contraseña: </label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Registrar</button>
      </form>
      <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        name: '',
        username: '',
        password: ''
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await axios.post('http://localhost:3000/register', {
            name: this.name,
            username: this.username,
            password: this.password
          });
          alert('Registro exitoso');
          this.$router.push('/login');
        } catch (error) {
          console.error(error);
          alert('Hubo un error al registrar');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos para el registro */
  </style>
  