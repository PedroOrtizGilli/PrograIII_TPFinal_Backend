import { Router } from "express";
import path from 'path';
import { calculateDirname } from "../src/utils/pathUtils.js";

const router = Router();

const __dirname = calculateDirname(import.meta.url);

/*==================
    Rutas de Vistas (HTML)
==================*/

// --- Servir VISTA Principal ---
router.get("/", (req, res) => {
   
    res.sendFile(path.join(__dirname, '..', '..', '5_tpIntegradorFront', 'indexAdmin.html'));
});

// --- Servir Vistas de 'views/admin' ---
router.get("/cargar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '5_tpIntegradorFront', 'views', 'admin', 'cargar.html'));
});

router.get("/buscar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '5_tpIntegradorFront', 'views', 'admin', 'buscar.html'));
});

router.get("/modificar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '5_tpIntegradorFront', 'views', 'admin', 'modificar.html'));
});

router.get("/eliminar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '5_tpIntegradorFront', 'views', 'admin', 'eliminar.html'));
});

export default router;