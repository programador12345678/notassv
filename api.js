const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  const { action, estudiante } = req.query;
  
  // LOG DE DIAGNÓSTICO
  console.log(`Acción recibida: ${action}`);

  try {
    // LOGIN
    if (action === 'login' && req.method === 'POST') {
      const { user, pass } = req.body;
      console.log(`Intentando login para: ${user}`);

      const result = await pool.query(
        'SELECT id, rol, name, access FROM usuarios WHERE id = $1 AND password = $2', 
        [user, pass]
      );
      
      if (result.rows.length > 0) {
        console.log("Login exitoso");
        return res.status(200).json(result.rows[0]);
      } else {
        console.log("Credenciales no encontradas en la DB");
        return res.status(401).json({ error: "Usuario o clave incorrecta" });
      }
    }

    // OBTENER NOTAS
    if (action === 'get_notas') {
      const result = await pool.query(
        'SELECT materia, coti, inte, exam FROM notas WHERE estudiante_id = $1 ORDER BY materia ASC', 
        [estudiante]
      );
      return res.status(200).json(result.rows);
    }

    // ACTUALIZAR NOTA
    if (action === 'update_nota' && req.method === 'POST') {
      const { estudiante: est, materia: mat, columna: col, valor: val } = req.body;
      const validColumns = ['coti', 'inte', 'exam'];
      if (!validColumns.includes(col)) return res.status(400).json({error: "Columna no válida"});

      await pool.query(`UPDATE notas SET ${col} = $1 WHERE estudiante_id = $2 AND materia = $3`, [val, est, mat]);
      return res.status(200).json({ status: "ok" });
    }

    return res.status(400).json({ error: "Acción no válida" });

  } catch (error) {
    console.error("ERROR EN LA DB:", error.message);
    return res.status(500).json({ error: "Error de conexión con la base de datos" });
  }
}
