import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { user, pass } = req.body;
    // Sustituye con tu URL real de Connection String de Neon
    const sql = neon('postgresql://usuario:password@ep-tu-base-datos.us-east-2.aws.neon.tech/notas');

    try {
        // Buscamos el usuario en tu tabla de Neon
        const result = await sql`
            SELECT id, rol, access, name, password 
            FROM usuarios 
            WHERE id = ${user} LIMIT 1
        `;

        if (result.length > 0 && result[0].password === pass) {
            // Si la clave coincide, enviamos el JSON que querías
            const usuario = result[0];
            res.status(200).json({
                id: usuario.id,
                rol: usuario.rol,
                access: usuario.access,
                name: usuario.name
            });
        } else {
            res.status(401).json({ error: "Credenciales inválidas" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
