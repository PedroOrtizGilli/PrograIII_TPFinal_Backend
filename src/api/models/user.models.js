import connection from "../database/db.js";

// Crear usuario
const insertUser = (correo, contrasenia) => {
    const sql = `INSERT INTO usuarios (correo, contrasenia) VALUES (?, ?)`;
    return connection.query(sql, [correo, contrasenia]);
}

export default {
    insertUser
}