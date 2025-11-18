
import * as ProductRepository from "../repositories/products.repository.js";

// --- Traer todos los productos ---
const getProducts = async (req, res) => {
    try {
        // 1. Pedimos los datos al repositorio
        const products = await ProductRepository.getAll();
        
        // 2. Respondemos al cliente
        res.status(200).json({
            payload: products
        });
        
    } catch (error) {
        console.error("Error en el controlador al obtener productos", error.message);
        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
};

// --- Consultar un producto por ID ---
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductRepository.getById(id);

        if (!product) {
            // Si el repositorio devuelve null, es un 404
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({
            payload: product
        });

    } catch (error) {
        console.error("Error en el controlador al obtener producto", error.message);
        res.status(500).json({
            message: "Error interno al obtener producto con id"
        });
    }
};

// --- Crear un producto ---
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        // Le pasamos los datos al repositorio
        const newProductId = await ProductRepository.create(productData);
        
        // Respondemos con éxito
        res.status(201).json({
            message: "Producto creado exitosamente",
            payload: {
                id: newProductId,
                ...productData
            }
        });

    } catch (error) {
        console.error("Error en el controlador al crear producto", error.message);
        res.status(500).json({
            message: "Error interno al crear producto"
        });
    }
};

// --- Actualizar un producto ---
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        
        // Le pasamos el ID y los datos al repositorio
        const affectedRows = await ProductRepository.update(id, productData);

        // El repositorio nos dice cuántas filas se afectaron
        if (affectedRows === 0) {
            return res.status(404).json({
                message: "No se encontró un producto con ese ID para actualizar"
            });
        }

        res.status(200).json({
            message: "Producto actualizado exitosamente"
        });

    } catch (error) {
        console.error("Error en el controlador al actualizar producto", error.message);
        res.status(500).json({
            message: "Error interno al actualizar producto"
        });
    }
};

// --- Eliminar un producto ---
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Le pasamos el ID al repositorio
        const affectedRows = await ProductRepository.remove(id);

        if (affectedRows === 0) {
            return res.status(404).json({
                message: "No se encontró un producto con ese ID"
            });
        }

        res.status(200).json({
            message: "Producto eliminado exitosamente"
        });

    } catch (error) {
        console.error("Error en el controlador al eliminar producto", error.message);
        res.status(500).json({
            message: "Error interno al eliminar producto"
        });
    }
};

// --- Eliminar todos los productos ---
const deleteAllProducts = async (req, res) => {
    try {
        // Llamamos al repositorio
        await ProductRepository.removeAll();

        res.status(200).json({
            message: "Todos los productos eliminados exitosamente"
        });

    } catch (error) {
        console.error("Error en el controlador al eliminar productos", error.message);
        res.status(500).json({
            message: "Error interno al eliminar productos"
        });
    }
};

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts
};