import express from "express";
import {
  userData,
  userLogin,
  userRegister,
  validateToken,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/userData", userData);
router.post("/validateToken", validateToken);

export default router;
