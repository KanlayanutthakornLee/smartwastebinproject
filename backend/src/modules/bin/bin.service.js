import pool from "../../config/db.js";

export const fetchBins = async () => {
  const result = await pool.query("SELECT * FROM bins");
  return result.rows;
};