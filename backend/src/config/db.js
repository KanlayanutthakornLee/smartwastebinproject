import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

console.log("DEBUG DATABASE_URL =", connectionString ? "✅ found" : "❌ missing");

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is missing!");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log("✅ Connected to Neon DB"))
  .catch(err => console.error("❌ DB Error:", err));

export default pool;