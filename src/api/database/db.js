// Importamos el modulo mysql2 en modo promesas para hacer peticiones asincronicas a la BBDD
import mysql2 from "mysql2/promise"; 

// Importamos la informacion de conexion a nuestra BBDD
import environments from "../config/environments.js";

// Hacemos destructuring para guardar en la variable environments la informacion de la BBDD
const { database } = environments;


const connection = mysql2.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

export default connection;