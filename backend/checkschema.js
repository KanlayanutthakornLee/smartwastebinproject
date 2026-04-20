import pool from "./src/config/db.js";

const tables = ['roles','users','locations','bins','waste_types','bin_status','collection_history'];

for (const table of tables) {
  const r = await pool.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position`,
    [table]
  );
  console.log(`\n=== ${table} ===`);
  r.rows.forEach(c => console.log(` ${c.column_name} (${c.data_type})`));
}

process.exit(0);