/*====================
    Importaciones
====================*/
import express from "express";
import cors from "cors";
// Importamos __dirname y join desde TU archivo utils (respetando tu código)
import { __dirname, join } from "./src/utils/path.utils.js";

// Configuración
import environments from "./src/api/config/environments.js";

// Routers
import productsRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";

// Middlewares (Desde src/api/middlewares como indicaste)
import { addLocals } from "./src/api/middlewares/locals.middleware.js";
import { loggerUrl } from "./src/api/middlewares/logger.middleware.js"; 

/*====================
    Configuración Inicial
====================*/
const app = express();
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

// Permite recibir datos de formularios HTML (como el de cargar.ejs)
app.use(express.urlencoded({ extended: true })); 

// Apuntamos a la carpeta 'public' (donde están css y js del front)
app.use(express.static(join(__dirname, 'public')));

// Este middleware inyecta datos en 'res.locals' para que EJS los use
app.use(addLocals);


/*==================
    Rutas
====================*/

// Rutas de la API (Datos)
app.use("/products", productsRouter);

// Rutas de las Vistas (HTML renderizado)
app.use("/", viewsRouter);


/*==================
    Iniciar Servidor
====================*/
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});