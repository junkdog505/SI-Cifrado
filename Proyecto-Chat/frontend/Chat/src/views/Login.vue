<!-- src/views/Login.vue -->

<template>
    <div class="login">
      <h1>Iniciar sesión</h1>
      <form @submit.prevent="loginUser">
        <div>
          <label for="username">Nombre de usuario: </label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div>
          <label for="password">Contraseña: </label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
      <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      async loginUser() {
        try {
          const response = await axios.post('http://localhost:3000/login', {
            username: this.username,
            password: this.password
          });
          localStorage.setItem('token', response.data.token); // Guardar el token en localStorage
          this.$router.push('/chat');
        } catch (error) {
          console.error(error);
          alert('Credenciales incorrectas');
        }
      }
    }
  };
  </script>