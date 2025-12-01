// Importacion de modulos para poder trabajar con rutas
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Obtener nombre del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtener el directorio del archivo actual
// Desde /src/utils/, bajamos 2 niveles (../../) para llegar a la raíz del proyecto
const __dirname = join(dirname(__filename), "../../"); 

export {
    __dirname,
    join
}