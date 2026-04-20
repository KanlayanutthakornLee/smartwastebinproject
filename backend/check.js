import pool from "./src/config/db.js";

const r = await pool.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
);
console.log("Tables:", r.rows.map(x => x.table_name));
process.exit(0);