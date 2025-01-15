import app from "./app.js";
import express from "express";
import { serverConfig } from "./config/serverConfig.js";
const { port, port2 } = serverConfig;


app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
