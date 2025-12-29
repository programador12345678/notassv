import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    // Solo aceptamos peticiones POST
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const { user, pass } = req.body;

    // Aquí usamos la variable de entorno que Neon y Vercel configuran automáticamente
    const sql = neon(process.env.DATABASE_URL);

    try {
        // Buscamos el usuario en Neon
        const result = await sql`
            SELECT id, rol, access, name, password 
            FROM usuarios 
            WHERE id = ${user} 
            LIMIT 1
        `;

        const usuario = result[0];

        if (usuario && usuario.password === pass) {
            // Si coincide, devolvemos los datos (sin la contraseña)
            res.status(200).json({
                id: usuario.id,
                rol: usuario.rol,
                access: usuario.access,
                name: usuario.name
            });
        } else {
            res.status(401).json({ error: 'Usuario o clave incorrectos' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error de base de datos' });
    }
}
