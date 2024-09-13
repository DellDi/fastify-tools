import { request } from 'undici';
import { JiraUpdateTicketSchema, } from '../../../schema/jira.js';
const jira = async (fastify, opts) => {
    fastify.post('', {
        schema: JiraUpdateTicketSchema,
        handler: async (req, reply) => {
            const { issueId, ...data } = req.body;
            try {
                const resLogin = await fastify.inject({
                    method: 'POST',
                    url: '/jira/login',
                    body: {
                        username: process.env.JIRA_USERNAME,
                        password: process.env.JIRA_PASSWORD,
                    },
                });
                const { cookies, atlToken } = resLogin.json();
                await request(`http://newsee:newsee@bug.new-see.com:8088/secure/AjaxIssueAction.jspa`, {
                    method: 'POST',
                    body: new URLSearchParams({
                        issueId: issueId.toString(),
                        ...data,
                        atlToken,
                        atl_token: atlToken,
                        singleFieldEdit: 'true',
                    }).toString(),
                    query: {
                        decorator: 'none',
                    },
                    headers: {
                        Cookie: cookies,
                        Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
                return {
                    message: 'Jira ticket updated successfully',
                };
            }
            catch (error) {
                fastify.log.error(error);
                reply.status(500).send({ error: error });
            }
        },
    });
};
export default jira;
