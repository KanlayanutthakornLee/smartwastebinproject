import pool from "../config/db.js";

export const getLocations = async (req, res) => {
  try {
    let query, params;

    if (req.user.role === "admin") {
      query = `
        SELECT l.id AS location_id, l.name AS location_name,
               b.id AS bin_id, b.bin_number, b.label,
               r.status, r.note, r.recorded_at,
               u.username AS recorded_by
        FROM locations l
        JOIN bins b ON b.location_id = l.id
        LEFT JOIN LATERAL (
          SELECT * FROM bin_records
          WHERE bin_id = b.id
          ORDER BY recorded_at DESC LIMIT 1
        ) r ON true
        LEFT JOIN users u ON u.id = r.recorded_by
        ORDER BY l.id, b.bin_number
      `;
      params = [];
    } else {
      query = `
        SELECT l.id AS location_id, l.name AS location_name,
               b.id AS bin_id, b.bin_number, b.label,
               r.status, r.note, r.recorded_at,
               u.username AS recorded_by
        FROM locations l
        JOIN bins b ON b.location_id = l.id
        LEFT JOIN LATERAL (
          SELECT * FROM bin_records
          WHERE bin_id = b.id
          ORDER BY recorded_at DESC LIMIT 1
        ) r ON true
        LEFT JOIN users u ON u.id = r.recorded_by
        WHERE l.id = $1
        ORDER BY b.bin_number
      `;
      params = [req.user.location_id];
    }

    const { rows } = await pool.query(query, params);

    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.location_id]) {
        grouped[row.location_id] = {
          id: row.location_id,
          name: row.location_name,
          bins: [],
        };
      }
      grouped[row.location_id].bins.push({
        id: row.bin_id,
        bin_number: row.bin_number,
        label: row.label,
        status: row.status,
        note: row.note,
        recorded_at: row.recorded_at,
        recorded_by: row.recorded_by,
      });
    }
    res.json(Object.values(grouped));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getBinHistory = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.*, u.username AS recorded_by,
              b.label, b.bin_number, l.name AS location_name
       FROM bin_records r
       JOIN users u ON u.id = r.recorded_by
       JOIN bins b ON b.id = r.bin_id
       JOIN locations l ON l.id = b.location_id
       WHERE r.bin_id = $1
       ORDER BY r.recorded_at DESC
       LIMIT 10`,
      [req.params.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const recordBin = async (req, res) => {
  const { status, note } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO bin_records (bin_id, recorded_by, status, note) VALUES ($1,$2,$3,$4) RETURNING *",
      [req.params.id, req.user.id, status, note || null]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};