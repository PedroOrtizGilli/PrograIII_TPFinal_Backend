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
import authRoutes from "./routes/auth.routes.js";
import salesRoutes from "./routes/sales.routes.js";

// Middlewares
import { addLocals } from "./src/api/middlewares/locals.middleware.js";
import { loggerUrl } from "./src/api/middlewares/logger.middleware.js"; 

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

//Endpoint para login y logout
app.use("/", authRoutes);

//Endpoint para registrar ventas
app.use("/api/sales", salesRoutes);


/*==================
    Iniciar Servidor
====================*/
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});