import { request } from 'undici';
import qs from 'node:querystring';
import { jiraLoginSchema } from '../../../schema/jira.js';
function returnAuthorization(urlString) {
    const parsedUrl = new URL(urlString);
    const { username, password } = parsedUrl;
    if (username && password) {
        return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }
    else {
        return undefined;
    }
}
const jira = async (fastify, opts) => {
    fastify.post('', {
        schema: jiraLoginSchema,
        handler: async (req, reply) => {
            const jiraUrl = 'http://newsee:newsee@bug.new-see.com:8088/rest/gadget/1.0/login';
            const { jiraUser, jiraPassword } = req.body;
            try {
                let qsData = qs.stringify({
                    os_username: jiraUser,
                    os_password: jiraPassword,
                    os_cookie: true,
                });
                const loginResponse = await request(jiraUrl, {
                    method: 'POST',
                    body: qsData,
                    headers: {
                        Authorization: returnAuthorization(jiraUrl),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
                const setCookieHeader = loginResponse.headers['set-cookie'] ?? [];
                const cookies = Array.isArray(setCookieHeader)
                    ? setCookieHeader
                        .map((cookie) => cookie.split(';')[0])
                        .join(';')
                    : setCookieHeader.split(';')[0];
                let atlToken = '';
                if (Array.isArray(setCookieHeader)) {
                    const xsrfCookie = setCookieHeader.find((cookie) => cookie.startsWith('atlassian.xsrf.token='));
                    if (xsrfCookie) {
                        atlToken = xsrfCookie.split(';')[0].split('=')[1];
                    }
                }
                return { cookies, atlToken };
            }
            catch (error) {
                fastify.log.error(error);
                reply.status(500).send({ error: error });
            }
        },
    });
};
export default jira;
