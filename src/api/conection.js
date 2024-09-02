import express from "express";
import mysql from "mysql2/promise";

const app = express();
const port = 3001; // Puedes cambiar el puerto si es necesario

// Configura los detalles de tu conexión
const dbConfig = {
  host: "localhost", // Cambia esto si tu base de datos está en otro host
  user: "root", // Reemplaza con tu usuario de la base de datos
  password: "root", // Reemplaza con tu contraseña de la base de datos
  database: "prodScan", // Reemplaza con el nombre de tu base de datos
};
// Middleware para parsear JSON
app.use(express.json());

app.get("/api/productos", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute("SELECT * FROM productos");
    res.json(results);
    await connection.end();
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).send("Error al obtener productos");
  }
});

// Ruta para insertar un nuevo producto
app.post("/api/productos", async (req, res) => {
  const { codigo_barras, nombre, descripcion } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO productos (codigo_barras, nombre, descripcion) VALUES (?, ?, ?)",
      [codigo_barras, nombre, descripcion]
    );
    await connection.end();
    res.status(201).json({ id: result.insertId, codigo_barras, nombre, descripcion });
  } catch (err) {
    console.error("Error al insertar producto:", err);
    res.status(500).json({ error: "Error al insertar producto" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
