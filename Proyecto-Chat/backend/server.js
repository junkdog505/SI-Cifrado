const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);  
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});


app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});


io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('chatMessage', (msg) => {
    console.log('Mensaje recibido:', msg);
    io.emit('chatMessage', msg);  
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
