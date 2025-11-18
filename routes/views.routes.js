import { Router } from "express";

// --- ¡ESTA ES LA LÍNEA CLAVE! ---
// La ruta correcta sube un nivel (../) y luego entra a (src/api/repositories/...)
import * as ProductRepository from "../src/api/repositories/products.repository.js";

const router = Router();

/*==================
    Rutas de Vistas (EJS)
==================*/
// La raíz de vistas ahora es: '.../5_tpIntegradorBack/views/'

// --- Servir VISTA Principal ---
router.get("/", async (req, res) => {
    try {
        const products = await ProductRepository.getAll();
        
        // ¡Ruta limpia! Express buscará en 'views/indexAdmin.ejs'
        res.render('indexAdmin', { 
            title: 'Inicio - Gestor',
            products: products 
        });

    } catch (error) {
        console.error("Error al cargar la vista de inicio:", error);
        res.status(500).send("Error al cargar la página");
    }
});

// --- Servir el resto de las Vistas ---
// ¡Rutas limpias!

router.get("/cargar.html", (req, res) => {
    // Express buscará en: 'views/admin/cargar.ejs'
    res.render('admin/cargar', {
        title: 'Cargar Producto'
    });
});

router.get("/buscar.html", (req, res) => {
    // Express buscará en: 'views/admin/buscar.ejs'
    res.render('admin/buscar', {
        title: 'Buscar Producto'
    });
});

router.get("/modificar.html", (req, res) => {
    // Express buscará en: 'views/admin/modificar.ejs'
    res.render('admin/modificar', {
        title: 'Modificar Producto'
    });
});

router.get("/eliminar.html", (req, res) => {
    // Express buscará en: 'views/admin/eliminar.ejs'
    res.render('admin/eliminar', {
        title: 'Eliminar Producto'
    });
});

export default router;