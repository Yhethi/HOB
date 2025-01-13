import { createConnection } from "../services/dbService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await createConnection();
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
};

export const userRegister = async (req, res) => {
  const { name, lastName, email, password } = req.body;

  try {
    const connection = await createConnection();

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
};

export const userData = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtén el token del header

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;
    const connection = await createConnection();

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
};

export const validateToken = (req, res) => {
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
};
