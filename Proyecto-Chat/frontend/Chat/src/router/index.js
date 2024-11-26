// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Chat from '../views/Chat.vue';

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: { requiresAuth: true }  // Ruta protegida, requiere autenticación
  },
  {
    path: '/',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Protección de rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  // Si la ruta requiere autenticación y no hay un token en localStorage
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    // Redirigir al login si no está autenticado
    next({ name: 'Login' });
  } else {
    // Continuar a la siguiente ruta
    next();
  }
});

export default router;
