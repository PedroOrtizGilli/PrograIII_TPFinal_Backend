import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Calcula y devuelve el __dirname (la ruta del directorio)
 * para el módulo ES que llama a esta función.
 * @param {string} metaUrl - Pasa siempre 'import.meta.url' desde el archivo que llama.
 * @returns {string} La ruta absoluta al directorio del archivo que llama.
 */
export const calculateDirname = (metaUrl) => {
    const __filename = fileURLToPath(metaUrl);
    return path.dirname(__filename);
};