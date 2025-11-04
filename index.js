/*====================
    Importaciones
====================*/
import express from "express";
const app = express();

import path from 'path';
import { fileURLToPath } from 'url';

import environments from "./src/api/config/environments.js";
const PORT = environments.port;

import connection from "./src/api/database/db.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/*====================
    Middlewares
====================*/
app.use(cors());
app.use(express.json()); // Para entender peticiones con body tipo JSON
app.use(express.urlencoded({ extended: true })); // Para entender formularios HTML

// --- Middleware para servir archivos estáticos (CSS, JS cliente, imágenes) ---
app.use('/css', express.static(path.join(__dirname, '..', '5_tpIntegradorFront', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', '5_tpIntegradorFront', 'js')));

/*==================
    Endpoints (Rutas)
==================*/

// --- RUTAS PARA SERVIR VISTAS (PÁGINAS HTML) ---

// --- Endpoint para servir la VISTA de admin ---
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '5_tpIntegradorFront', 'indexAdmin.html'));
});

// Estas rutas ahora apuntan a la subcarpeta 'views' dentro de 5_tpIntegradorFront.

app.get("/cargar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '5_tpIntegradorFront', 'views', 'cargar.html'));
});

app.get("/buscar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '5_tpIntegradorFront', 'views', 'buscar.html'));
});

app.get("/modificar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '5_tpIntegradorFront', 'views', 'modificar.html'));
});

app.get("/eliminar.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '5_tpIntegradorFront', 'views', 'eliminar.html'));
});


// --- RUTAS DE API (PARA DATOS) ---


// Traer todos los productos
app.get("/products", async (req, res) => {

    try {
        const sql = "SELECT * FROM productos";
    
        // Con rows extraemos exclusivamente los datos que solicitamos en la consulta
        const [rows] = await connection.query(sql);

        console.log(rows);
        
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


// Consultar un producto por ID
app.get("/products/:id", async (req, res) => {

    
    try {
        //let id = req.params.id;
        let { id } = req.params;

        //Gracias al uso de los placeholders -> ? evitamos inyecciones SQL
        let sql = "SELECT * FROM productos WHERE id = ?";

        let [rows] = await connection.query(sql, [id]); //este id reemplaza el placeholder ?
        console.log(rows);

        // Devolvemos solo el primer resultado (o null si no existe)
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


// --- POST (Crear un producto)
app.post("/products", async (req, res) => {
    try {
        // Obtenemos los 5 campos del body (antes solo eran 3)
        let { nombre, tipo, precio, imagen, stock } = req.body;

        // Aseguramos valores por defecto si vienen vacíos
        const safeTipo = tipo || 'N/A';
        const safeStock = stock || 0;
        const safeImagen = imagen || null;

        // Actualizamos la consulta SQL para que incluya los 5 campos
        let sql = "INSERT INTO productos (nombre, tipo, precio, imagen, stock) VALUES (?, ?, ?, ?, ?)";
        let [result] = await connection.query(sql, [nombre, safeTipo, precio, safeImagen, safeStock]);
        
        res.status(201).json({
            message: "Producto creado exitosamente",
            payload: {
                id: result.insertId,
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

// Eliminar un producto
app.delete("/products/:id", async (req, res) => {
    try {
        let { id } = req.params;  // Destructuring para extraer el id de los parametros de la url

        let sql = "DELETE FROM productos WHERE id = ?";// Usamos placeholder para evitar inyecciones SQL
        let [result] = await connection.query(sql, [id]);// El id reemplaza el placeholder ?

        // Comprobamos si se eliminó alguna fila
        if (result.affectedRows === 0) {
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

// Eliminar todos los productos 
app.delete("/products", async (req, res) => {
    try {
        let sql = "DELETE FROM productos";// Sin WHERE para eliminar todos
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


// --- PUT (Actualizar un producto)
app.put("/products/:id", async (req, res) => {
    try {
        let { id } = req.params;
        // Obtenemos los 5 campos del body
        let { nombre, tipo, precio, imagen, stock } = req.body;

        // Aseguramos valores
        const safeTipo = tipo || 'N/A';
        const safeStock = stock || 0;
        const safeImagen = imagen || null;

        let sql = "UPDATE productos SET nombre = ?, tipo = ?, precio = ?, imagen = ?, stock = ? WHERE id = ?";
        let [result] = await connection.query(sql, [nombre, safeTipo, precio, safeImagen, safeStock, id]);

        // Comprobamos si se actualizó alguna fila
        if (result.affectedRows === 0) {
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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
