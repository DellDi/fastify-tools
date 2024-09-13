import Fastify from 'fastify';
import closeWithGrace from 'close-with-grace';
const app = Fastify({
    logger: {
        level: 'info',
    },
});
await app.register(import('./app.js'));
closeWithGrace({ delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY || '500') }, async function ({ signal, err, manual }) {
    if (err) {
        app.log.error({ signal, err, manual });
    }
    await app.close();
});
export default async function handler(req, res) {
    await app.ready();
    app.server.emit('request', req, res);
}
