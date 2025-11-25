import { Router } from "express";

import * as ProductRepository from "../src/api/models/products.repository.js";

const router = Router();

/*==================
    Rutas de Vistas (EJS)
==================*/

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

router.get("/cargar", (req, res) => {
    
    res.render('admin/cargar', {
        title: 'Cargar Producto'
    });
});

router.get("/buscar", (req, res) => {
 
    res.render('admin/buscar', {
        title: 'Buscar Producto'
    });
});

router.get("/modificar", (req, res) => {
    
    res.render('admin/modificar', {
        title: 'Modificar Producto'
    });
});

router.get("/eliminar", (req, res) => {
   
    res.render('admin/eliminar', {
        title: 'Eliminar Producto'
    });
});

export default router;