import bcrypt from 'bcrypt';
import connection from '../database/db.js';

export const login = async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;

        if(!correo || !contrasenia){
            return res.render("login", {
                title: "Login",
                error: "Todos los campos son obligatorios"
            });
        }
        /*
        //Sentencia sin bcrypt
        const sql = `SELECT * FROM usuarios where correo = ? AND contrasenia = ?`;
        const [rows] = await connection.query(sql, [correo, contrasenia]);
        */
        //Sentencia con bcrypt
        const sql = "SELECT * FROM usuarios where correo = ?"
        const [rows] = await connection.query(sql, [correo]);

        if(rows.length === 0){
            return res.render("login", {
                title: "Login",
                error: "Credenciales incorrectas"
            });
        }
        console.log(rows)

        const user = rows[0];

        const match = await bcrypt.compare(contrasenia, user.contrasenia);

        if(match){
            req.session.user = {
                id: user.id,
                correo: user.correo
            }
            res.redirect("/")

        } else {
            return res.render("login", {
                title: "Login",
                error: "Epa! Contraseña incorrecta"
            });
        }


    } catch(error){
        console.log(error)
        res.status(500).json({
            error: "Error interno del servidor"
        });
    } 
};

export const logout = (req, res) => {
    
    req.session.destroy((error) => {
        if(error){
            console.error("Error al destruir la sesion", error);
            return res.status(500).json({
                error: "Error al cerrar sesion"
            });
        }
        res.redirect("/login");
    });
};

