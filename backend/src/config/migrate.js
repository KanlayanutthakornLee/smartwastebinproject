import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import pool from "./db.js";

const migrate = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(10) CHECK (role IN ('admin', 'emp')) NOT NULL,
      location_id INT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS locations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bins (
      id SERIAL PRIMARY KEY,
      location_id INT REFERENCES locations(id),
      bin_number INT CHECK (bin_number BETWEEN 1 AND 3),
      label VARCHAR(100)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bin_records (
      id SERIAL PRIMARY KEY,
      bin_id INT REFERENCES bins(id),
      recorded_by INT REFERENCES users(id),
      status VARCHAR(20) CHECK (status IN ('empty', 'half', 'full')) NOT NULL,
      note TEXT,
      recorded_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    INSERT INTO locations (name) VALUES
      ('Location A'),('Location B'),('Location C'),
      ('Location D'),('Location E'),('Location F')
    ON CONFLICT DO NOTHING;
  `);

  await pool.query(`
    INSERT INTO bins (location_id, bin_number, label)
    SELECT l.id, b.num, 'ถัง ' || b.num
    FROM locations l, (VALUES (1),(2),(3)) AS b(num)
    ON CONFLICT DO NOTHING;
  `);

  console.log("✅ Migration done");
  process.exit(0);
};

migrate().catch((e) => { console.error(e); process.exit(1); });