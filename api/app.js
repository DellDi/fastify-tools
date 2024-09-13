import * as path from 'path';
import process from 'node:process';
import AutoLoad from '@fastify/autoload';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const options = {};
const app = async (fastify, opts) => {
    void fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: opts,
        forceESM: true,
    });
    void fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: opts,
        forceESM: true,
    });
    await fastify.ready((err) => {
        if (err)
            throw err;
    });
    fastify.log.info('Something important happened!');
    fastify.log.info('process', JSON.stringify(process.env));
    fastify.addHook('preHandler', function (req, reply, done) {
        if (req.body) {
            req.log.info({ body: req.body }, 'parsed body');
        }
        done();
    });
    fastify.addHook('onRequest', (req, reply, done) => {
        reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        done();
    });
};
export default app;
export { app, options };
