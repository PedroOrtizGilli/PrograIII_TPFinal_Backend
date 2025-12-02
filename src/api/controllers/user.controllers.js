import bcrypt from 'bcrypt';
import UserModels from '../models/user.models.js';
import connection from '../database/db.js';

export const insertUser = async (req, res) => {
    try{
        const { correo, contrasenia } = req.body;

        if(!correo || !contrasenia){
            return res.status(400).json({
                message: "Datos invalidos, asegurese de enviar todos los datos del formulario"
            });
        }

        // --- Verificar si el usuario ya existe ---
        const sqlCheck = "SELECT * FROM usuarios WHERE correo = ?";
        const [existingUsers] = await connection.query(sqlCheck, [correo]);

        // Si la consulta devuelve algún resultado, es que ya existe
        if (existingUsers.length > 0) {
            return res.status(409).json({ 
                message: "El correo ya está registrado"
            });
        }

        //Setup del bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasenia, saltRounds);

        const [rows] = await UserModels.insertUser(correo, hashedPassword);

        res.status(201).json({
            message: "Usuario creado con exito",
            userId: rows.insertId
        });

    }catch(error){
        console.log("Error interno del servidor", error);

        res.status(500).json({
            message: "Error al intentar crear el usuario",
            error: error.message
        })
    }
}
