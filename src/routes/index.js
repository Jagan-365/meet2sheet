import { Router } from "express";
import authRoutes from "./auth-routes/index.js";
import employeeRoutes from "./employee-routes/index.js";

const router = Router();

// ping health check
router.get("/ping", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

router.use("/auth", authRoutes);

router.use("/employee", employeeRoutes);

export default router;
