// Must be imported before any module that reads process.env (e.g. db.js).
// ES modules evaluate dependency modules before this file's importer runs body code,
// but they are evaluated in import order — import this file first in server.js.
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });
