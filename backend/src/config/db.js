import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🔥 fix path สำหรับ ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 ชี้ path ไป backend/.env ตรง ๆ
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DB_URL;

console.log("DEBUG DB_URL =", connectionString);

if (!connectionString) {
  throw new Error("❌ DB_URL is missing!");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("✅ Connected to Neon DB"))
  .catch(err => console.error("❌ DB Error:", err));

export default pool;