import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { getLocations, getBinHistory, recordBin } from "../controllers/binController.js";
import { getUsers, assignLocation } from "../controllers/userController.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Auth
router.post("/auth/login", loginUser);
router.post("/auth/register", verifyToken, requireAdmin, registerUser);

// Bins
router.get("/bins/locations", verifyToken, getLocations);
router.get("/bins/:id", verifyToken, getBinHistory);
router.post("/bins/:id/record", verifyToken, recordBin);

// Users (admin only)
router.get("/users", verifyToken, requireAdmin, getUsers);
router.patch("/users/:id/location", verifyToken, requireAdmin, assignLocation);

export default router;