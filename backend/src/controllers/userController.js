import pool from "../config/db.js";

export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.username, u.role, u.location_id, l.name AS location_name
       FROM users u
       LEFT JOIN locations l ON l.id = u.location_id
       WHERE u.role = 'emp'
       ORDER BY u.id`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const assignLocation = async (req, res) => {
  const { location_id } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE users SET location_id = $1 WHERE id = $2 RETURNING id, username, location_id",
      [location_id, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};