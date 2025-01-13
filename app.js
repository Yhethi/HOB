import express from "express";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();

app.use(express.json()); // Middleware para JSON
app.use(cors()); // Permitir CORS (opcional)

// Registrar todas las rutas
app.use("/api", routes);

// Middleware para manejar errores genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
