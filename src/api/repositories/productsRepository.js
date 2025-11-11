// Importamos la conexión a la BD
import connection from "../database/db.js";

// Esta capa solo se encarga de las consultas SQL y de devolver los datos.
// No maneja req ni res.

const getAll = async () => {
    const sql = "SELECT * FROM productos";
    // Usamos 'nombreProducto' para ser consistentes, aunque 'SELECT *' trae todo.
    const [rows] = await connection.query(sql);
    return rows;
};

const getById = async (id) => {
    const sql = "SELECT * FROM productos WHERE id = ?";
    const [rows] = await connection.query(sql, [id]);
    // Devuelve el primer resultado (el objeto) o null si no se encuentra
    return rows[0] || null;
};

const create = async (product) => {
    
    // Usamos 'nombreProducto' como nos indicaste
    const { nombreProducto, tipo, precio, imagen, stock } = product;

    // Aseguramos valores por defecto
    const safeNombreProducto = nombreProducto || 'N/A';
    const safeTipo = tipo || 'N/A';
    const safeStock = stock || 0;
    const safeImagen = imagen || null;
    const safePrecio = precio || 0; // Añadido por seguridad

    const sql = "INSERT INTO productos (nombreProducto, tipo, precio, imagen, stock) VALUES (?, ?, ?, ?, ?)";

    const [result] = await connection.query(sql, [safeNombreProducto, safeTipo, safePrecio, safeImagen, safeStock]);
    
    // Devolvemos el ID del nuevo producto
    return result.insertId;
};

const update = async (id, product) => {
   
    const { nombreProducto, tipo, precio, imagen, stock } = product;
    
    // Aseguramos valores por defecto
    const safeNombreProducto = nombreProducto || 'N/A';
    const safeTipo = tipo || 'N/A';
    const safeStock = stock || 0;
    const safeImagen = imagen || null;
    const safePrecio = precio || 0;

    const sql = "UPDATE productos SET nombreProducto = ?, tipo = ?, precio = ?, imagen = ?, stock = ? WHERE id = ?";
    const [result] = await connection.query(sql, [safeNombreProducto, safeTipo, safePrecio, safeImagen, safeStock, id]);

    // Devolvemos el número de filas afectadas
    return result.affectedRows;
};


const remove = async (id) => {
    const sql = "DELETE FROM productos WHERE id = ?";
    const [result] = await connection.query(sql, [id]);
    
    // Devolvemos el número de filas afectadas
    return result.affectedRows;
};

const removeAll = async () => {
    const sql = "DELETE FROM productos";
    await connection.query(sql);
    // No necesitamos devolver nada, solo confirmar que se ejecutó
    return; 
};

export {
    getAll,
    getById,
    create,
    update,
    remove,
    removeAll
};  