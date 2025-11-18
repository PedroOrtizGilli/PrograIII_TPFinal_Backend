
// Definir los datos de los alumnos
const alumnos = [
    {
        nombre: "Matías Ariel",
        apellido: "Schirone"
    },
    {
        nombre: "Pedro",
        apellido: "Ortiz Gilli"
    }
];

// Definir la URL del logo
const logoUrl = "https://image.pngaaa.com/392/5315392-middle.png";

// Función de middleware para añadir a res.locals
export const addLocals = (req, res, next) => {
    
    // Añadimos las variables a 'res.locals'
    // Cualquier cosa en 'res.locals' es accesible automáticamente en EJS
    res.locals.alumnos = alumnos;
    res.locals.logoUrl = logoUrl;

    // Continuamos con la siguiente función (ej. el router de vistas)
    next();
};