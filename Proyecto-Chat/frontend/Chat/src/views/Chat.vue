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
        <span class="message-username" v-if="!msg.fromMe">{{ msg.sender_username }}:</span>
        <span class="message-text">{{ msg.content }}</span>
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
  <button @click="logout" class="logout-button">Cerrar sesión</button>
</template>

<script>
export default {
  data() {
    return {
      message: "",
      messages: []  // Se almacenarán los mensajes aquí
    };
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== "") {
        // Suponemos que el `userId` es el id del usuario actual
        const senderId = 1; // Obtén el ID del usuario de la sesión
        const receiverId = 2; // ID del usuario al que se está enviando el mensaje
        const content = this.message;

        // Enviar el mensaje al servidor
        this.$socket.emit('chatMessage', { senderId, receiverId, content });

        // Agregar el mensaje a la lista de mensajes enviados (solo para ti)
        this.messages.push({ content: this.message, fromMe: true });

        // Limpiar el campo de entrada
        this.message = "";
      }
    },
    logout() {
      alert("Sesión cerrada");
      this.$router.push("/login"); // Redirigir al login (ajusta esto según tu ruta)
    }
  },
  created() {
    // Recibir los mensajes del servidor
    this.$socket.on('chatMessage', (msg) => {
      if (msg.sender_id !== 1) {  // Si el mensaje no es del mismo usuario
        this.messages.push({ 
          sender_username: msg.sender_username, 
          content: msg.content, 
          fromMe: false 
        });
      }
    });

    // Si quieres guardar los mensajes localmente en el navegador
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    }
  },
  watch: {
    // Guardar los mensajes cada vez que haya un cambio en ellos
    messages(newMessages) {
      localStorage.setItem('chatMessages', JSON.stringify(newMessages));
    }
  }
};
</script>

<style scoped>
/* Contenedor principal del chat */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}

/* Contenedor de los mensajes */
.messages-container {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Estilos para los mensajes */
.message {
  padding: 12px;
  border-radius: 8px;
  max-width: 80%;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  transition: background-color 0.3s ease;
}

/* Mensajes enviados (derecha) */
.sent {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
  border-radius: 20px 20px 0 20px;
  max-width: 70%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* Mensajes recibidos (izquierda) */
.received {
  background-color: #e1e1e1;
  color: black;
  align-self: flex-start;
  border-radius: 0 20px 20px 20px;
  max-width: 70%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* Nombre de usuario de los mensajes */
.message-username {
  font-weight: bold;
  margin-right: 5px;
  color: #555;
}

/* Contenedor del campo de entrada y el botón */
.input-container {
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  gap: 10px;
}

/* Estilo para el input */
.message-input {
  flex-grow: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
}

/* Estilo para el botón de enviar */
.send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #0056b3;
}

/* Botón de cierre de sesión */
.logout-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 10px 20px;
  background-color: #e63946;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.logout-button:hover {
  background-color: #d62828;
}
</style>
