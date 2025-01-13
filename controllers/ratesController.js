import { createConnection } from "../services/dbService.js";

export const customRates = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res
        .status(400)
        .json({ error: "El id del usuario es obligatorio" });
    }

    const connection = await createConnection();
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
};

export const updateCustomRate = async (req, res) => {
  const { user_id, usd_to_bolivares, usd_to_pesos, usd } = req.body;
  try {
    const connection = await createConnection();
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
};

export const updateCustomRateCheckBox = async (req, res) => {
  const { isCustomRate, user_id } = req.body;
  const value = isCustomRate ? 1 : 0;
  try {
    const connection = await createConnection();
    const query = `
    UPDATE user_settings
    SET 
      is_custom_rate = ?
    WHERE user_id = ?
  `;

    await connection.execute(query, [value, user_id]);
    await connection.end();
    res.status(201).json({
      success: true,
      message: "Tu opcion a cambiado a: " + value,
    });
  } catch (e) {
    console.log(e);
  }
};
