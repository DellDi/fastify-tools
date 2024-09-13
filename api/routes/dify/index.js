import auth from '@fastify/auth';
import bearerAuth from '@fastify/bearer-auth';
import { difySchema, } from '../../schema/dify.js';
const dify = async (fastify, opts) => {
    await fastify
        .register(auth)
        .register(bearerAuth, {
        addHook: true,
        keys: new Set(['zd-nb-19950428']),
        verifyErrorLogLevel: 'debug',
    })
        .decorate('allowAnonymous', function (req, reply, done) {
        fastify.log.debug('Authorization header:', req.headers.authorization);
        if (req.headers.authorization) {
            return done(Error('not anonymous'));
        }
        return done(undefined);
    });
    fastify.post('/create-jira', {
        schema: difySchema,
        preHandler: fastify.verifyBearerAuth,
        handler: async (request, reply) => {
            const { point, ...params } = request.body;
            console.log('🚀 ~ handler: ~ params:', params);
            fastify.log.info(`point: ${point}`);
            if (point === 'ping') {
                return { result: 'pong' };
            }
            if (point === 'app.external_data_tool.query') {
                const { issueId, issueKey, issueUrl } = await handleAppExternalDataToolQuery(fastify, params || {});
                return {
                    result: `${Date.now()}`,
                    issueId,
                    issueKey,
                    issueUrl,
                };
            }
            reply.code(400).send({ error: 'Not implemented' });
        },
    });
};
async function handleAppExternalDataToolQuery(fastify, params) {
    const { title, description, assignee } = params || {};
    const { issueId, issueKey, issueUrl } = (await fastify.inject({
        url: '/jira/create-ticket',
        method: 'POST',
        body: {
            title,
            description,
            assignee,
        },
        headers: {
            'content-type': 'application/json',
        },
    }));
    return {
        issueId,
        issueKey,
        issueUrl,
    };
}
export default dify;
