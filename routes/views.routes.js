import { Router } from "express";

import * as ProductRepository from "../src/api/models/products.repository.js";
import { requiereLogin } from "../src/api/middlewares/logger.middleware.js";

const router = Router();

/*==================
    Rutas de Vistas (EJS)
==================*/

router.get("/", requiereLogin, async (req, res) => {
    try {
        const products = await ProductRepository.getAll();
        
        // Express buscará en 'views/indexAdmin.ejs'
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
    
    res.render('cargar', {
        title: 'Cargar Producto'
    });
});

router.get("/buscar", requiereLogin, (req, res) => {
 
    res.render('buscar', {
        title: 'Buscar Producto'
    });
});

router.get("/modificar", requiereLogin, (req, res) => {
    
    res.render('modificar', {
        title: 'Modificar Producto'
    });
});

router.get("/eliminar", requiereLogin, (req, res) => {
   
    res.render('eliminar', {
        title: 'Eliminar Producto'
    });
});

router.get("/login", (req, res) => {
    res.render('login', {
        title: "login"
    });
});

export default router;