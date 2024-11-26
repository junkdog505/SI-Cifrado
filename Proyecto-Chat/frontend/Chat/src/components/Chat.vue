<template>
  <div class="chat-container">
    <div class="messages-container">
      <!-- Mensajes del chat -->
      <div 
        v-for="(msg, index) in messages" 
        :key="index"
        :class="{'sent': msg.fromMe, 'received': !msg.fromMe}"
        class="message"
      >
        <span class="message-text">{{ msg.text }}</span>
      </div>
    </div>
    
    <div class="input-container">
      <input 
        v-model="message" 
        @keyup.enter="sendMessage" 
        type="text" 
        placeholder="Escribe un mensaje..." 
        class="message-input"
      />
      <button @click="sendMessage" class="send-button">Enviar</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
      messages: []
    };
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== "") {
        this.$socket.emit('chatMessage', this.message);
        this.messages.push({ text: this.message, fromMe: true });
        this.message = "";  // Limpiar el campo de entrada
      }
    }
  },
  created() {
    // Recibir los mensajes del servidor
    this.$socket.on('chatMessage', (msg) => {
      this.messages.push({ text: msg, fromMe: false });
    });
  }
};
</script>

<style scoped>
/* Estilos generales */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border: 2px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Contenedor de los mensajes */
.messages-container {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Espacio entre los mensajes */
}

/* Estilos para los mensajes */
.message {
  padding: 10px;
  border-radius: 5px;
  max-width: 75%;
  display: inline-block;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

/* Mensajes enviados (derecha) */
.sent {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
}

/* Mensajes recibidos (izquierda) */
.received {
  background-color: #e1e1e1;
  color: black;
  align-self: flex-start;
}

/* Entrada de texto */
.input-container {
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}

.message-input {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}

.send-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0056b3;
}
</style>
