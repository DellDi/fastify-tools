import {fileURLToPath} from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const UPLOAD_DIR = path.join(__dirname, '../', 'public')
