import { createConnection } from "../services/dbService.js";

export const getProducts = async (req, res) => {
  // console.log("req:", req);

  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "El id del usuario es obligatorio" });
    }

    const connection = await createConnection();
    const [results] = await connection.execute(
      "SELECT productos.*, inventario.cantidad FROM productos LEFT JOIN inventario ON productos.id = inventario.producto_id WHERE productos.user_id = ?",
      [userId]
    );
    res.json(results);
    await connection.end();
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).send("Error al obtener productos");
  }
};

export const getProductsById = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await createConnection();
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
};