/*====================
    Importaciones
====================*/
import express from "express";
import cors from "cors";
import path from 'path';

// Importamos la utilidad para calcular __dirname
import { calculateDirname } from "./src/utils/path.utils.js";

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

// Calculamos el __dirname para ESTE archivo (index.js)
const __dirname = calculateDirname(import.meta.url);


// --- ¡CAMBIO! CONFIGURACIÓN DE EJS ---
// 1. Le decimos a Express que EJS es nuestro motor de plantillas
app.set('view engine', 'ejs');
// 2. ¡CAMBIO! Le decimos que nuestras vistas están en la carpeta 'views' LOCAL
app.set('views', path.join(__dirname, 'views'));


/*====================
    Middlewares
====================*/
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- ¡CAMBIO! Middlewares Estáticos ---
// Hacemos que la carpeta 'public' local sea accesible
app.use(express.static(path.join(__dirname, 'public')));


// --- Middleware de Locales (Sin cambios) ---
app.use(addLocals);


/*==================
    Rutas (Delegadas)
====================*/
// 1. Delegamos las rutas de la API (Sin cambios)
app.use("/products", productsRouter);

// 2. Delegamos las rutas de las Vistas (Sin cambios)
app.use("/", viewsRouter);


/*==================
    Iniciar Servidor
====================*/
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});