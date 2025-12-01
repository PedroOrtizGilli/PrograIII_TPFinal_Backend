/*====================
    Importaciones
====================*/
import express from "express";
import session from "express-session";
import cors from "cors";
import { __dirname, join } from "./src/utils/path.utils.js";

// Configuración
import environments from "./src/api/config/environments.js";

// Routers
import productsRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";

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

//Endpoint para la creacion de usuarios
app.post("/api/users", async (req, res) =>  {
    try{
        const { correo, contrasenia } = req.body;

        if(!correo || !contrasenia){
            return res.status(500).json({
                message: "Datos invalidos"
            });
        }

        let sql = `
            INSERT INTO usuarios (correo, contrasenia)
            VALUES (?, ?)
        `;

        const [rows] = await connection.query(sql, [correo, contrasenia]);

        res.status(201).json({
            message: "Usuario creado con exito"
        });

    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "Error interno al crear usuario",
            error: error
        });
    }
})

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

        const sql = `SELECT * FROM usuarios where correo = ? AND contrasenia = ?`;
        const [rows] = await connection.query(sql, [correo, contrasenia]);

        if(rows.length === 0){
            return res.render("login", {
                title: "Login",
                error: "Credenciales incorrectas"
            });
        }
        console.log(rows)

        const user = rows[0];

        req.session.user = {
            id: user.id,
            correo: user.correo
        }
        res.redirect("/")

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


/*==================
    Iniciar Servidor
====================*/
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});