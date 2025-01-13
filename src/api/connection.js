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
const port2 = 3002;
import http from "http";
import { getProducts } from "./controllers.js";
import { Server } from "socket.io";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());

const users = {};

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Registrar un usuario con su ID
  socket.on("registerUser", (userId) => {
    users[userId] = socket.id;
    console.log(`Usuario ${userId} registrado con el socket ${socket.id}`);
  });

  // Escuchar el evento de compra finalizada
  socket.on("finalizarCompra", (data) => {
    const { buyerId, cartProducts, totals } = data;

    // Enviar la notificación al usuario con ID 2
    const targetUserId = 5;
    const targetSocketId = users[targetUserId];
    console.log("usuarios: ", users, targetSocketId);

    if (targetSocketId) {
      io.to(targetSocketId).emit("newNotification", {
        message: `Usuario ${buyerId} ha realizado una compra:\n${cartProducts.join(
          ", "
        )}\nTotales:\nBs. ${totals.bolivares.toFixed(2)}, Cop ${
          Math.ceil(totals.pesos / 100) * 100
        }, $ ${totals.dolares.toFixed(2)}`,
      });
    }
  });

  // Limpiar cuando el usuario se desconecta
  socket.on("disconnect", () => {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log("Usuario desconectado:", socket.id);
  });
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("testNotification", (data) => {
    console.log("Notificación recibida del cliente:", data);

    io.emit("newNotification", { message: "Notificación de prueba" });
  });
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});
console.log("getProducts:", getProducts);

app.get("/api/productos", getProducts);

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

app.get("/api/tienda/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [vendedor] = await connection.execute(
      "SELECT * FROM usuarios WHERE id = ? AND u_nivel = 2",
      [id]
    );

    if (vendedor.length === 0) {
      return res
        .status(404)
        .json({ error: "El vendedor no existe o no tiene permisos." });
    }
    const [productos] = await connection.execute(
      "SELECT * FROM productos WHERE user_id = ?",
      [id]
    );

    await connection.end();

    res.status(200).json(productos);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

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
        u_nivel: user.u_nivel,
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
        u_nivel: user.u_nivel,
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
    const connection = await mysql.createConnection(dbConfig);

    // Verificar si el email ya está registrado
    const [existingUser] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Hashear el password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en la tabla usuarios
    const queryUsuario = `
      INSERT INTO usuarios (nombre, email, password, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const fullName = name + " " + lastName;

    // Insertar el usuario en la tabla
    const [result] = await connection.execute(queryUsuario, [
      fullName,
      email,
      hashedPassword,
    ]);

    // Obtener el ID del último usuario registrado
    const userId = result.insertId;

    // Insertar valores predeterminados en la tabla exchangerates
    const queryExchangeRates = `
      INSERT INTO exchangerates (user_id,updated_at)
      VALUES (?, NOW())
    `;
    await connection.execute(queryExchangeRates, [userId]);

    // Insertar valores predeterminados en la tabla user_settings
    const queryUserSettings = `
      INSERT INTO user_settings (user_id)
      VALUES (?)
    `;
    await connection.execute(queryUserSettings, [userId]);

    console.log(
      "Usuario y configuraciones iniciales registrados en la base de datos."
    );

    // Cerrar la conexión
    await connection.end();

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      userId,
    });
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
        u_nivel: user.u_nivel,
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
server.listen(port2, () => {
  console.log(`Servidor WebSocket escuchando en http://localhost:${port2}`);
});
