import { Router } from "express";
const router = Router();
import * as ProductController from "../src/api/controllers/productsController.js";


// Traer todos los productos
router.get("/", ProductController.getProducts);

// Consultar un producto por ID
router.get("/:id", ProductController.getProductById);

// Crear un producto
router.post("/", ProductController.createProduct);

// Actualizar un producto
router.put("/:id", ProductController.updateProduct);

// Eliminar un producto
router.delete("/:id", ProductController.deleteProduct);

// Eliminar todos los productos
router.delete("/", ProductController.deleteAllProducts);

// Exportamos el router para que index.js pueda usarlo
export default router;