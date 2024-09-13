import fp from 'fastify-plugin';
import scalarReference from '@scalar/fastify-api-reference';
export default fp(async (fastify, opts) => {
    fastify.register(scalarReference, {
        routePrefix: '/docs-reference',
        configuration: {
            theme: 'purple',
            title: 'Dell DI 的API文档',
            description: '丰富的API工具集合',
            version: '1.0.0',
            contact: {
                name: 'DellDi',
                email: '875372314@qq.com',
            },
        },
        uiConfig: {
            docExpansion: 'list',
            deepLinking: true,
            displayRequestDuration: true,
        },
        transformStaticCSP: (header) => header,
        exposeRoute: true,
    });
});
