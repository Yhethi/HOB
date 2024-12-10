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

app.get("/api/customRate", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res
        .status(400)
        .json({ error: "El id del usuario es obligatorio" });
    }

    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(
      "SELECT * FROM exchangerates WHERE user_id = ?",
      [userId]
    );

    res.json(results[0]);
    await connection.end();
  } catch (e) {
    console.log(e);
    res.status(500).send("Error al obtener el los custom rates");
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

    const [resultsSettings] = await connection.execute(
      "SELECT * FROM user_settings WHERE user_id = ?",
      [user.id]
    );
    const userSettings = resultsSettings[0];

    const [resultsCustomRate] = await connection.execute(
      "SELECT usd,usd_to_bolivares,usd_to_pesos FROM exchangerates WHERE user_id = ?",
      [user.id]
    );

    const customRates = resultsCustomRate[0] || null;

    // Generar el token con los datos del usuario
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        userSettings,
        customRates,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        userSettings,
        customRates,
      },
    });

    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, lastName, email, password } = req.body;

  try {
    console.log("Datos recibidos:", { name, lastName, email, password });

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
    const fullName = name + " " + lastName;
    await connection.execute(query, [fullName, email, hashedPassword]);
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

app.patch("/api/updateCustomRate", async (req, res) => {
  const { user_id, usd_to_bolivares, usd_to_pesos, usd } = req.body;
  console.log("req.body:", req.body);

  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
    UPDATE exchangerates
    SET 
      usd_to_bolivares = ?, 
      usd_to_pesos = ?, 
      usd = ?, 
      updated_at = NOW()
    WHERE user_id = ?
  `;
    await connection.execute(query, [
      usd_to_bolivares,
      usd_to_pesos,
      usd,
      user_id,
    ]);
    await connection.end();
    res.status(201).json({
      success: true,
      message: "Tus tasas se han actualizado correctamente.",
    });
  } catch (e) {
    console.log(e);
  }
});

app.patch("/api/updateCustomRateCheckBox", async (req, res) => {
  const { isCustomRate, user_id } = req.body;
  const value = isCustomRate ? 1 : 0;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
    UPDATE user_settings
    SET 
      is_custom_rate = ?
    WHERE user_id = ?
  `;
    console.log(value, user_id);

    await connection.execute(query, [value, user_id]);
    await connection.end();
    res.status(201).json({
      success: true,
      message: "Tu opcion a cambiado a: " + value,
    });
  } catch (e) {
    console.log(e);
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

app.get("/api/userData", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtén el token del header

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;
    const connection = await mysql.createConnection(dbConfig);

    const [userRows] = await connection.execute(
      `SELECT id, email, nombre FROM usuarios WHERE id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });
    }

    const [customRatesRows] = await connection.execute(
      `SELECT usd_to_bolivares, usd_to_pesos, usd FROM exchangerates WHERE user_id = ?`,
      [userId]
    );

    const [resultsSettings] = await connection.execute(
      "SELECT * FROM user_settings WHERE user_id = ?",
      [userId]
    );

    const userSettings = resultsSettings[0];
    const customRates = customRatesRows[0] || {};
    const user = userRows[0];

    await connection.end();

    const newToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        customRates,
        userSettings,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token: newToken,
      user: {
        ...user,
        customRates,
        userSettings,
      },
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener datos del usuario." });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
