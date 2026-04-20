import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

import pkg from "pg";
import bcrypt from "bcryptjs";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const reset = async () => {
  console.log("🗑️  Dropping old tables (if exist)...");

  await pool.query(`
    DROP TABLE IF EXISTS
      collection_history, bin_status, waste_types,
      bin_records, bins, locations, users, roles
    CASCADE;
  `);

  console.log("✅ Old tables dropped.");
  console.log("🏗️  Creating new schema...");

  await pool.query(`
    CREATE TABLE users (
      id            SERIAL PRIMARY KEY,
      username      VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255)        NOT NULL,
      role          VARCHAR(10)         NOT NULL CHECK (role IN ('admin', 'emp')),
      location_id   INT,
      created_at    TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE locations (
      id   SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );
  `);

  await pool.query(`
    ALTER TABLE users
      ADD CONSTRAINT fk_users_location
      FOREIGN KEY (location_id) REFERENCES locations(id)
      ON DELETE SET NULL;
  `);

  await pool.query(`
    CREATE TABLE bins (
      id          SERIAL PRIMARY KEY,
      location_id INT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
      bin_number  INT NOT NULL CHECK (bin_number BETWEEN 1 AND 3),
      label       VARCHAR(100),
      UNIQUE (location_id, bin_number)
    );
  `);

  await pool.query(`
    CREATE TABLE bin_records (
      id          SERIAL PRIMARY KEY,
      bin_id      INT NOT NULL REFERENCES bins(id)  ON DELETE CASCADE,
      recorded_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status      VARCHAR(20) NOT NULL CHECK (status IN ('empty', 'half', 'full')),
      note        TEXT,
      recorded_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("✅ New schema created.");

  console.log("🌱 Seeding locations...");
  await pool.query(`
    INSERT INTO locations (name) VALUES
      ('Location A'),('Location B'),('Location C'),
      ('Location D'),('Location E'),('Location F');
  `);

  console.log("🌱 Seeding bins (3 ถังต่อ location)...");
  await pool.query(`
    INSERT INTO bins (location_id, bin_number, label)
    SELECT l.id, b.num, 'ถัง ' || b.num
    FROM locations l
    CROSS JOIN (VALUES (1),(2),(3)) AS b(num);
  `);

  console.log("🌱 Seeding admin user...");
  // hash สร้าง ณ runtime จาก bcryptjs — ถูกต้องแน่นอน
  const adminHash = await bcrypt.hash("admin1234", 10);
  await pool.query(
    `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, 'admin')`,
    ["admin", adminHash]
  );

  console.log("✅ Seed complete.");
  console.log("");
  console.log("📋 Summary:");
  console.log("   Tables    : users, locations, bins, bin_records");
  console.log("   Locations : A-F (6 แห่ง, แต่ละแห่งมี 3 ถัง)");
  console.log("   Admin     : username=admin  password=admin1234");
  console.log("🎉 Reset done! พร้อมใช้งานแล้ว");

  await pool.end();
  process.exit(0);
};

reset().catch((e) => {
  console.error("❌ Reset failed:", e.message);
  process.exit(1);
});