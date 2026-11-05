import helper from 'fastify-cli/helper.js';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AppPath = path.join(__dirname, '..', 'src', 'app.ts');
async function config() {
    return {};
}
async function build(t) {
    const argv = [AppPath];
    const app = await helper.build(argv, await config());
    t.after(() => void app.close());
    return app;
}
export { config, build };
