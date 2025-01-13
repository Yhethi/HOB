import { createConnection } from "../services/dbService.js";

export const getProducts = async (req, res) => {
  console.log("req:", req);

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

export const createProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    const connection = await createConnection();
    const [result] = await connection.execute(
      "INSERT INTO productos (nombre, precio, descripcion) VALUES (?, ?, ?)",
      [nombre, precio, descripcion]
    );
    res.status(201).json({ id: result.insertId, nombre, precio, descripcion });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;
    const connection = await createConnection();
    const [result] = await connection.execute(
      "UPDATE productos SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?",
      [nombre, precio, descripcion, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ id, nombre, precio, descripcion });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();
    const [result] = await connection.execute(
      "DELETE FROM productos WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado con éxito" });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
