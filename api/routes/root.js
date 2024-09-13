const example = async (fastify, opts) => {
    fastify.get('/', async function (request, reply) {
        let headers = request.headers;
        return {
            headers: headers,
            'process.env': process.env,
        };
    });
};
export default example;
