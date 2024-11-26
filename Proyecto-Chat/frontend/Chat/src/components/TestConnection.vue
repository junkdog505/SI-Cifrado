<template>
    <div>
        <h1>Prueba de conexión</h1>
        <button @click="testConnection">Probar Backend</button>
        <p>{{ message }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            message: '',
        };
    },
    methods: {
        async testConnection() {
            try {
                const response = await axios.get('/');
                this.message = response.data;
            } catch (error) {
                this.message = 'Error al conectar con el backend';
            }
        },
    },
};
</script>
