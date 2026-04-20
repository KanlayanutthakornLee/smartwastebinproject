import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];
    if (!user)
      return res.status(401).json({ message: "ไม่พบผู้ใช้งาน" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { id: user.id, role: user.role, location_id: user.location_id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        location_id: user.location_id,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const registerUser = async (req, res) => {
  const { username, password, role, location_id } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (username, password_hash, role, location_id) VALUES ($1,$2,$3,$4) RETURNING id, username, role",
      [username, hash, role, location_id || null]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};