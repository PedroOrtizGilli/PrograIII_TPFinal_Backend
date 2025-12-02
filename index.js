/*====================
    Importaciones
====================*/
import express from "express";
import session from "express-session";
import cors from "cors";
import { __dirname, join } from "./src/utils/path.utils.js";
import bcrypt from "bcrypt";

// Configuración
import environments from "./src/api/config/environments.js";

// Routers
import productsRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";
import userRoutes from "./routes/user.routes.js";

// Middlewares
import { addLocals } from "./src/api/middlewares/locals.middleware.js";
import { loggerUrl } from "./src/api/middlewares/logger.middleware.js"; 
import connection from "./src/api/database/db.js";

/*====================
    Configuración Inicial
====================*/
const app = express();
const SESSION_KEY = environments.session_key;
const PORT = environments.port;

// --- CONFIGURACIÓN DE EJS ---
app.set('view engine', 'ejs');

app.set('views', join(__dirname, 'views')); 


/*====================
    Middlewares Globales
====================*/

app.use(loggerUrl);

app.use(cors());
app.use(express.json()); 

// Permite recibir datos de formularios HTML 
app.use(express.urlencoded({ extended: true })); 

// Apuntamos a la carpeta 'public' 
app.use(express.static(join(__dirname, 'public')));

// Este middleware inyecta datos en 'res.locals' para que EJS los use
app.use(addLocals);

app.use(session({
    secret: SESSION_KEY, //Firma las cookies para evitar manipulacion
    resave: false, //Evita guardar la sesion si no hubo cambios
    saveUninitialized: true //No guarda sesiones vacias
}));


/*==================
    Rutas
====================*/

// Rutas de la API 
app.use("/products", productsRouter);

// Rutas de las Vistas
app.use("/", viewsRouter);

// Endpoint para la creación de usuarios
app.use("/api/users", userRoutes);

//Endpoint para login
app.post("/login", async (req, res) => {
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
});

app.post("/logout", (req, res) => {
    
    req.session.destroy((error) => {
        if(error){
            console.error("Error al destruir la sesion", error);
            return res.status(500).json({
                error: "Error al cerrar sesion"
            });
        }
        res.redirect("/login");
    });
});

//Endpoint para registrar ventas
app.post("/api/sales", async (req, res) => {
    try{
        const { nombreUsuario, precioTotal, fechaEmision, productos } = req.body;

        if(!nombreUsuario || !precioTotal || !fechaEmision || !Array.isArray(productos) || productos.length === 0){
            return res.status(400).json({
                message: "Datos inválidos: faltan campos o formato incorrecto"
            });
        }

        const sql = `
            INSERT INTO tickets (nombreUsuario, precioTotal, fechaEmision)
            VALUES (?, ?, ?)    
        `;

        const [resultTicket] = await connection.query(sql, [nombreUsuario, precioTotal, fechaEmision]);

        const ticketId = resultTicket.insertId;

        const sqlProductoTickets = `
            INSERT INTO productos_tickets (idProducto, idTicket) VALUES (?, ?)
        `;

        for (const idProducto of productos) {
            await connection.query(sqlProductoTickets, [idProducto, ticketId]);
        }

        res.status(201).json({
            message: "Venta registrada con éxito",
            ticketId: ticketId
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
});


/*==================
    Iniciar Servidor
====================*/
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});