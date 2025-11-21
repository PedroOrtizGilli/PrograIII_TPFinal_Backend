const loggerUrl = (req, res, next) => {
    // Obtenemos solo la ruta (sin parámetros de consulta para la validación)
    const path = req.path;
    const method = req.method;

    // --- LISTA NEGRA DE EXTENSIONES ---
    // Si la ruta termina en cualquiera de estas, NO se imprime nada.
    const extensionesIgnoradas = [
        '.css', '.js', '.html', '.map', '.ico', 
        '.png', '.jpg', '.jpeg', '.gif', '.svg', 
        '.woff', '.woff2', '.ttf', '.eot'
    ];

    // Verificamos si la URL actual termina con alguna extensión ignorada
    const esArchivoEstatico = extensionesIgnoradas.some(ext => path.endsWith(ext));

    // Si es un archivo estático, pasamos al siguiente middleware SIN imprimir
    if (esArchivoEstatico) {
        return next();
    }

    // --- IMPRESIÓN LIMPIA ---
    // Solo llegamos aquí si es una ruta de API (/products) o una Vista principal
    console.log(`[${new Date().toLocaleString()}] ${method} ${req.url}`);
    
    next();
}


// Middleware de ruta -> Se aplica a rutas especificas
const validateId = (req, res, next) => {
    let { id } = req.params;

    // Nos aseguramos que el ID sea un numero (La consulta podria fallar o generar un error en la BBDD)
    if(!id || isNaN(Number(id))) {
        return res.status(400).json({
            message: "El id del producto debe ser un numero valido"
        })
    }

    // Convertimos el parametro id (originalmente un string porque viene de la URL) a un numero entero (en base 10 decimal)
    req.id = parseInt(id, 10);

    console.log("Id validado: ", req.id);
    next();
}


export {
    loggerUrl,
    validateId,
}