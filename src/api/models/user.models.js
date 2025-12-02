import connection from "../database/db.js";

// Crear usuario
const insertUser = (correo, contrasenia) => {
    const sql = `INSERT INTO usuarios (correo, contrasenia) VALUES (?, ?)`;
    return connection.query(sql, [correo, contrasenia]);
}

const checkUser = async (correo) => {
    const sqlCheck = "SELECT * FROM usuarios WHERE correo = ?";
    const [existingUsers] = await connection.query(sqlCheck, [correo]);

    // Si la consulta devuelve algún resultado, es que ya existe
    if (existingUsers.length > 0) {
        return res.status(409).json({ 
            message: "El correo ya está registrado"
        });
    }
}

export default {
    insertUser,
    checkUser
}