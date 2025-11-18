/*====================
    Importaciones
====================*/
import express from "express";
import cors from "cors";
import { __dirname, join } from "./src/utils/path.utils.js";
// Importamos las variables de entorno (para el puerto)
import environments from "./src/api/config/environments.js";

// Importamos nuestros routers delegados
import productsRouter from "./routes/products.routes.js"; // (Asegúrate que este nombre coincida con tu archivo)
import viewsRouter from "./routes/views.routes.js";

// Importamos el middleware de 'locals'
import { addLocals } from "./src/middlewares/locals.middleware.js";


/*====================
    Configuración Inicial
====================*/
const app = express();
const PORT = environments.port;

// --- CONFIGURACIÓN DE EJS ---
// Le decimos a Express que EJS es nuestro motor de plantillas
app.set('view engine', 'ejs');
// Le decimos que nuestras vistas están en la carpeta 'views' LOCAL
app.set('views', join(__dirname, 'views'));


/*====================
    Middlewares
====================*/
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- Middlewares Estáticos ---
// Hacemos que la carpeta 'public' local sea accesible
app.use(express.static(join(__dirname, 'public')));


// --- Middleware de Locales (Sin cambios) ---
app.use(addLocals);


/*==================
    Rutas (Delegadas)
====================*/
// Delegamos las rutas de la API (Sin cambios)
app.use("/products", productsRouter);

// Delegamos las rutas de las Vistas (Sin cambios)
app.use("/", viewsRouter);


/*==================
    Iniciar Servidor
====================*/
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});