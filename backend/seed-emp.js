/**
 * seed-emp.js
 * วางที่ backend/seed-emp.js แล้วรัน: node seed-emp.js
 * สร้าง emp users พร้อม assign location ให้แต่ละคน
 */
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

const empUsers = [
  { username: "emp_a", password: "emp1234", locationName: "Location A" },
  { username: "emp_b", password: "emp1234", locationName: "Location B" },
  { username: "emp_c", password: "emp1234", locationName: "Location C" },
  { username: "emp_d", password: "emp1234", locationName: "Location D" },
  { username: "emp_e", password: "emp1234", locationName: "Location E" },
  { username: "emp_f", password: "emp1234", locationName: "Location F" },
];

const seed = async () => {
  console.log("🌱 Seeding emp users...\n");

  // ดึง locations ทั้งหมด
  const { rows: locations } = await pool.query("SELECT id, name FROM locations");
  const locMap = Object.fromEntries(locations.map(l => [l.name, l.id]));

  for (const emp of empUsers) {
    const locationId = locMap[emp.locationName];
    if (!locationId) {
      console.warn(`⚠️  ไม่พบ location: ${emp.locationName}`);
      continue;
    }

    // check ซ้ำ
    const existing = await pool.query("SELECT id FROM users WHERE username = $1", [emp.username]);
    if (existing.rows.length > 0) {
      console.log(`⏭️  ${emp.username} มีอยู่แล้ว — ข้าม`);
      continue;
    }

    const hash = await bcrypt.hash(emp.password, 10);
    await pool.query(
      "INSERT INTO users (username, password_hash, role, location_id) VALUES ($1,$2,'emp',$3)",
      [emp.username, hash, locationId]
    );
    console.log(`✅ สร้าง ${emp.username} → ${emp.locationName}`);
  }

  console.log("\n📋 สรุป accounts:");
  console.log("────────────────────────────────");
  console.log("  Admin  : admin      / admin1234");
  empUsers.forEach(e =>
    console.log(`  Emp    : ${e.username.padEnd(8)} / ${e.password}  → ${e.locationName}`)
  );
  console.log("────────────────────────────────");

  await pool.end();
  process.exit(0);
};

seed().catch(e => { console.error("❌", e.message); process.exit(1); });