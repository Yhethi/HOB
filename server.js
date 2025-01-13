import app from "./app.js";
import express from "express";
import { serverConfig } from "./config/serverConfig.js";
const { port, port2 } = serverConfig;
import http from "http";
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

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
server.listen(port2, () => {
  console.log(`Servidor WebSocket escuchando en http://localhost:${port2}`);
});
