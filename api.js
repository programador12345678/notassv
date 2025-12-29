const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://neondb_owner:npg_px4kLbqlJ6rB@ep-shiny-unit-adiqn7rh-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require",
});

export default async function handler(req, res) {
  const { action, estudiante, materia, columna, valor } = req.query;

  try {
    if (action === 'login') {
      const { user, pass } = req.body;
      const result = await pool.query('SELECT id, rol, name, access FROM usuarios WHERE id = $1 AND password = $2', [user, pass]);
      return res.status(200).json(result.rows[0] || { error: "Credenciales incorrectas" });
    }

    if (action === 'get_notas') {
      const result = await pool.query('SELECT materia, coti, inte, exam FROM notas WHERE estudiante_id = $1 ORDER BY materia ASC', [estudiante]);
      return res.status(200).json(result.rows);
    }

    if (action === 'update_nota') {
      const { estudiante: est, materia: mat, columna: col, valor: val } = req.body;
      const query = `UPDATE notas SET ${col} = $1 WHERE estudiante_id = $2 AND materia = $3`;
      await pool.query(query, [val, est, mat]);
      return res.status(200).json({ status: "ok" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
