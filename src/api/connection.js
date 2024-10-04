import express from "express";
import mysql from "mysql2/promise";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "./config.js";

const app = express();

const dbConfig = {
  host: DB_HOST,
  user: DB_USER,
  port: DB_PORT,
  password: DB_PASSWORD,
  database: DB_DATABASE,
};

const port = 3001;

// Middleware para parsear JSON
app.use(express.json());

app.get("/api/productos", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(
      "SELECT productos.*, inventario.cantidad FROM productos LEFT JOIN inventario ON productos.id = inventario.producto_id"
    );
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
      "INSERT INTO productos (codigo_barras, nombre, descripcion, imagen_url) VALUES (?, ?, ?, ?)",
      [
        codigo_barras,
        nombre,
        descripcion,
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      ]
    );
    await connection.end();
    res
      .status(201)
      .json({ id: result.insertId, codigo_barras, nombre, descripcion });
  } catch (err) {
    console.error("Error al insertar producto:", err);
    res.status(500).json({ error: "Error al insertar producto" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
