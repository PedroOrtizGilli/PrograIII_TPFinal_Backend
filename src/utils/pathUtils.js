import path from 'path';
import { fileURLToPath } from 'url';

export const calculateDirname = (metaUrl) => {
    const __filename = fileURLToPath(metaUrl);
    return path.dirname(__filename);
};