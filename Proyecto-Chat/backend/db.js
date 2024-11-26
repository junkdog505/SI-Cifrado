const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost", 
  user: "root",       
  database: "chatdb"     
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: ", err);
  } else {
    console.log("Conectado a la base de datos MySQL");
  }
});

module.exports = connection;
