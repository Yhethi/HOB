import express from "express";
import mysql from "mysql2/promise";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "./config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;
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
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "El id del usuario es obligatorio" });
    }

    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(
      "SELECT productos.*, inventario.cantidad FROM productos LEFT JOIN inventario ON productos.id = inventario.producto_id WHERE productos.usuario_id = ?",
      [userId]
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

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, error: "Usuario o contraseña incorrectos" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Usuario o contraseña incorrectos" });
    }

    // Generar el token con los datos del usuario
    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre }, // Datos incluidos en el token
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, nombre: user.nombre }, // Retornar también el usuario al cliente
    });

    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Datos recibidos:", { name, email, password });

    const connection = await mysql.createConnection(dbConfig);
    console.log("Conexión a la base de datos establecida.");

    // Verificar si el correo ya existe
    const [existingUser] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    console.log("Consulta de usuario existente ejecutada:", existingUser);

    if (existingUser.length > 0) {
      console.log("El correo ya está registrado.");
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Contraseña encriptada:", hashedPassword);

    // Insertar el nuevo usuario
    const query = `
      INSERT INTO usuarios (nombre, email, password, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    await connection.execute(query, [name, email, hashedPassword]);
    console.log("Usuario registrado en la base de datos.");

    await connection.end();
    res
      .status(201)
      .json({ success: true, message: "Usuario registrado exitosamente" });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

app.post("/api/validate-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Decodificar el token
    return res.status(200).json({ success: true, user: decoded }); // Retornar los datos del usuario decodificado
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Token inválido o expirado" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
