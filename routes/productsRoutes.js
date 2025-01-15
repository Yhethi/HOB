import express from "express";
import {
  getProducts,
  getProductsById,
} from "../controllers/productsController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductsById);
// router.post("/", createProduct);
// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);

export default router;
