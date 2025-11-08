/*====================
    Importaciones
====================*/
import express from "express";
import path from 'path'; // Aún necesitamos path para 'path.join'
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { calculateDirname } from "./src/utils/pathUtils.js";

// --- Importamos nuestros Routers ---
import productsRouter from "./routes/productsRoutes.js"; 
import viewsRouter from "./routes/viewsRoutes.js";

/*====================
    Configuración Inicial
====================*/
const app = express();
const PORT = environments.port;
const __dirname = calculateDirname(import.meta.url);

/*====================
    Middlewares
====================*/
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- Middleware para servir archivos estáticos (CSS, JS) ---
app.use('/css', express.static(path.join(__dirname, '..', '5_tpIntegradorFront', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', '5_tpIntegradorFront', 'js')));


/*==================
    Rutas (Delegadas)
==================*/

// Delegamos las rutas de la API a /products
app.use("/products", productsRouter);

// Delegamos las rutas de las Vistas (HTML) a /
app.use("/", viewsRouter); 


/*==================
    Iniciar Servidor
==================*/
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});