import { Router } from "express";
// Importamos la conexión a la BBDD

import connection from "../src/api/database/db.js";

const router = Router();

/*==================
    Endpoints de API
==================*/

// --- Traer todos los productos ---
// La ruta cambia de "/products" a "/"
// porque el prefijo "/products" se definirá en index.js
router.get("/", async (req, res) => {
    try {
        const sql = "SELECT * FROM productos";
        const [rows] = await connection.query(sql);
        
        res.status(200).json({
            payload: rows
        });
        
    } catch (error) {
        console.error("Error obteniendo productos", error.message);
        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
});

// --- Consultar un producto por ID ---
// La ruta cambia de "/products/:id" a "/:id"
router.get("/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let sql = "SELECT * FROM productos WHERE id = ?";
        let [rows] = await connection.query(sql, [id]);
        
        res.status(200).json({
            payload: rows[0] || null
        });

    } catch (error) {
        console.error("Error obteniendo producto", error.message);
        res.status(500).json({
            message: "Error interno al obtener producto con id"
        });
    }
});

// --- Crear un producto ---
// La ruta cambia de "/products" a "/"
router.post("/", async (req, res) => {
    try {
        let { nombre, tipo, precio, imagen, stock } = req.body;

        const safeTipo = tipo || 'N/A';
        const safeStock = stock || 0;
        const safeImagen = imagen || null;

        let sql = "INSERT INTO productos (nombre, tipo, precio, imagen, stock) VALUES (?, ?, ?, ?, ?)";
        let [rows] = await connection.query(sql, [nombre, safeTipo, precio, safeImagen, safeStock]);
        
        res.status(201).json({
            message: "Producto creado exitosamente",
            payload: {
                id: rows.insertId,
                nombre,
                tipo: safeTipo,
                precio,
                imagen: safeImagen,
                stock: safeStock
            }
        });

    } catch (error) {
        console.error("Error creando producto", error.message);
        res.status(500).json({
            message: "Error interno al crear producto"
        });
    }
});

// --- Eliminar un producto ---
// La ruta cambia de "/products/:id" a "/:id"
router.delete("/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let sql = "DELETE FROM productos WHERE id = ?";
        let [rows] = await connection.query(sql, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({
                message: "No se encontró un producto con ese ID"
            });
        }

        res.status(200).json({
            message: "Producto eliminado exitosamente"
        });

    } catch (error) {
        console.error("Error eliminando producto", error.message);
        res.status(500).json({
            message: "Error interno al eliminar producto"
        });
    }
});

// --- Eliminar todos los productos ---
// La ruta cambia de "/products" a "/"
router.delete("/", async (req, res) => {
    try {
        let sql = "DELETE FROM productos";
        await connection.query(sql);

        res.status(200).json({
            message: "Todos los productos eliminados exitosamente"
        });

    } catch (error) {
        console.error("Error eliminando productos", error.message);
        res.status(500).json({
            message: "Error interno al eliminar productos"
        });
    }
});


// --- Actualizar un producto ---
// La ruta cambia de "/products/:id" a "/:id"
router.put("/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let { nombre, tipo, precio, imagen, stock } = req.body;

        const safeTipo = tipo || 'N/A';
        const safeStock = stock || 0;
        const safeImagen = imagen || null;

        let sql = "UPDATE productos SET nombre = ?, tipo = ?, precio = ?, imagen = ?, stock = ? WHERE id = ?";
        let [rows] = await connection.query(sql, [nombre, safeTipo, precio, safeImagen, safeStock, id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({
                message: "No se encontró un producto con ese ID para actualizar"
            });
        }

        res.status(200).json({
            message: "Producto actualizado exitosamente"
        });

    } catch (error) {
        console.error("Error actualizando producto", error.message);
        res.status(500).json({
            message: "Error interno al actualizar producto"
        });
    }
});

// Exportamos el router para que index.js pueda usarlo
export default router;