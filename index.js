/* ===========IMPORTACIONES=========== */
import express from "express"
import environments from "./src/api/config/environments.js";

const app = express();
const PORT = environments.port;

/* ===========ENDPOINTS===========*/
app.get("/", (req, res) => {
    res.send("Hola mundo desde express.js")
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

//Traemos todos los productos
app.get("/productos", async (req, res) => {
    try {
        const sql = "SELECT * from productos"
        //Con rows extraemos explicitamente los datos que pedimos en la consulta
        const [rows] = await connection.query(sql);
        console.log(rows);
        res.status(200).json({
            payload: rows
        });
    } catch (error){
        console.error("Error obteniendo productos",error.message);
        res.status(500).json({
            message: "Error interno al obtener productos"
        })
    }
})