import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import { config } from 'dotenv';
const schema = {
    type: 'object',
    required: ['PORT'],
    properties: {
        PORT: {
            type: 'string',
            default: 3000,
        },
        NODE_ENV: {
            type: 'string',
            default: 'development',
        },
    },
};
export default fp(async (fastify, opts) => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envFilePath = `.env.${nodeEnv}`;
    config({ path: envFilePath });
    fastify
        .register(fastifyEnv, {
        schema: schema,
        dotenv: true,
    })
        .ready((err) => {
        if (err)
            console.error(err);
    });
});
