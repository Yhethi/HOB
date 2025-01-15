import express from "express";
import productsRoutes from "./productsRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.use("/productos", productsRoutes);
router.use("/auth", authRoutes);

export default router;
