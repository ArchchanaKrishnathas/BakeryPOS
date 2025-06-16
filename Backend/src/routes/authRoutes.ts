import express from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (admin, staff, or customer)
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login and return JWT token
 * @access  Public
 */
router.post("/login", loginUser);

export default router;
