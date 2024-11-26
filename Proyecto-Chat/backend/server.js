const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Importar la conexión a la base de datos
const db = require('./db'); // Asegúrate de que la ruta sea correcta

const app = express();
const server = http.createServer(app);  
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',  
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(cors());

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

// Ruta de registro de usuario
app.post('/register', async (req, res) => {
  const { name, username, password } = req.body;

  // Verificar si el nombre de usuario ya existe
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al consultar la base de datos' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el usuario en la base de datos
    db.query('INSERT INTO users (name, username, password) VALUES (?, ?, ?)', [name, username, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al registrar el usuario' });
      }
      res.status(201).json({ message: 'Usuario registrado con éxito' });
    });
  });
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Buscar el usuario en la base de datos
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al consultar la base de datos' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear un token JWT
    const token = jwt.sign({ userId: user.id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  });
});

// Ruta para obtener los mensajes entre usuarios
app.get('/messages', (req, res) => {
  const { userId, receiverId } = req.query;

  db.query(
    'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC',
    [userId, receiverId, receiverId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al obtener los mensajes' });
      }
      res.json(results);
    }
  );
});

// Ruta para enviar un mensaje
app.post('/send-message', (req, res) => {
  const { senderId, receiverId, content } = req.body;

  db.query(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
    [senderId, receiverId, content],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al enviar el mensaje' });
      }
      const newMessage = { sender_id: senderId, receiver_id: receiverId, content, id: results.insertId };
      io.emit('chatMessage', newMessage);  // Emitir mensaje a los clientes conectados
      res.status(201).json(newMessage);
    }
  );
});

// WebSocket para manejar la conexión y transmisión de mensajes en tiempo real
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  // Manejar mensajes de chat recibidos
  socket.on('chatMessage', (msg) => {
    console.log('Mensaje recibido:', msg);
    io.emit('chatMessage', msg);  // Emitir el mensaje a todos los clientes conectados
  });

  // Manejar desconexiones
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Configuración del servidor en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
