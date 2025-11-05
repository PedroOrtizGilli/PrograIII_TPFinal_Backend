/*====================
    Importaciones
====================*/
import express from "express";
const app = express();

import path from 'path';// Módulo nativo de Node.js para manejar rutas de archivos
import { fileURLToPath } from 'url';

import environments from "./src/api/config/environments.js";
const PORT = environments.port;

import cors from "cors";

import productsRouter from "./routes/productsRoutes.js"; 

const __filename = fileURLToPath(import.meta.url); // Obtener el path del archivo actual
const __dirname = path.dirname(__filename);// Obtener el directorio del archivo actual


/*====================
    Middlewares
====================*/
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/css', express.static(path.join(__dirname, '..', '5_tpIntegradorFront', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', '5_tpIntegradorFront', 'js')));

/*==================
    Rutas de Vistas (HTML)
==================*/

// --- Ruta Principal ---
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '5_tpIntegradorFront', 'indexAdmin.html'));
});


app.get("/cargar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '5_tpIntegradorFront', 'views', 'admin', 'cargar.html'));
});

app.get("/buscar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '5_tpIntegradorFront', 'views', 'admin', 'buscar.html'));
});

app.get("/modificar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '5_tpIntegradorFront', 'views', 'admin', 'modificar.html'));
});

app.get("/eliminar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '5_tpIntegradorFront', 'views', 'admin', 'eliminar.html'));
});


/*==================
    Rutas de API (Datos)
==================*/
// Esta parte delega todo lo de /products al archivo de rutas
app.use("/products", productsRouter);


/*==================
    Iniciar Servidor
==================*/
app.listen(PORT, () => {
     console.log(`Servidor corriendo en el puerto ${PORT}`);
});

