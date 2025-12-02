import connection from "../database/db";

const hashPassword = (correo) => {
    const sql = "SELECT * FROM usuarios where correo = ?"
    return connection.query(sql, [correo]);
}

export default {
    hashPassword
}