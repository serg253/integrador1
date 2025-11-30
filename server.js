const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Avance-web')));

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'Curso_Integrador1',
  user: 'root',
  password: '1234',
  database: 'mi_proyecto'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a MySQL exitosa');
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Obtener destinos desde la BD
app.get('/api/destinos', (req, res) => {
  db.query('SELECT * FROM destinos', (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener destinos');
      return;
    }
    res.json(results);
  });
});

// Guardar mensajes formulario de contacto
app.post('/api/contacto', (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const sql = "INSERT INTO contacto (nombre, email, mensaje) VALUES (?, ?, ?)";
  db.query(sql, [nombre, email, mensaje], (err, result) => {
    if (err) {
      console.error("Error al guardar el mensaje:", err);
      return res.status(500).json({ error: "Error al guardar el mensaje" });
    }

    res.json({ message: "Mensaje enviado correctamente" });
  });
});

// Guardar datos formulario de reserva
app.post("/enviar-reserva", (req, res) => {
  const { destino, nombre, email, telefono, fecha, personas, comentarios } = req.body;

  const sql = `INSERT INTO formulario_reserva 
    (destino, nombre, email, telefono, fecha, personas, comentarios) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
  db.query(sql, 
    [destino, nombre, email, telefono, fecha, personas, comentarios], 
    (err, resultado) => {
      if (err) {
        console.error("Error al guardar reserva:", err);
        return res.status(500).json({ mensaje: "Error al guardar la reserva" });
      }
      res.json({ mensaje: "Reserva enviada correctamente" });
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
