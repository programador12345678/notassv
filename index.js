export default function handler(req, res) {
  const { user, pass } = req.body;

  if (user === "admin.notas" && pass === "Admin2026.") {
    // AQUÍ VA TU CÓDIGO: Es lo que el servidor responde al navegador
    res.status(200).json({
      "id": "admin.notas",
      "rol": "admin",
      "access": "both",
      "name": "Administrador"
    });
  } else {
    res.status(401).json({ error: "No autorizado" });
  }
}
