import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import socketIO from 'socket.io-client';

const app = createApp(App)

// Conectar a Socket.io en el servidor backend
const socket = socketIO('http://localhost:3000');

// Hacer disponible el socket en toda la aplicación
app.config.globalProperties.$socket = socket;

app.use(createPinia())
app.use(router)

app.mount('#app')
