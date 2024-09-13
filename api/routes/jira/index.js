import { request } from 'undici';
import qs from 'node:querystring';
import { jiraCreateExport, } from '../../schema/jira.js';
const jiraBaseUrl = 'http://bug.new-see.com:8088';
const jira = async (fastify, opts) => {
    fastify.post('/create-ticket', {
        schema: jiraCreateExport,
        handler: async (req, reply) => {
            const { title, description, assignee } = req.body;
            try {
                const resLogin = await fastify.inject({
                    method: 'POST',
                    url: '/jira/login',
                    body: {
                        jiraUser: process.env.JIRA_USERNAME,
                        jiraPassword: process.env.JIRA_PASSWORD,
                    },
                });
                const { cookies, atlToken } = resLogin.json();
                const jiraPostData = {
                    pid: '11450',
                    issuetype: '10604',
                    atl_token: atlToken,
                    summary: title,
                    components: '13676',
                    customfield_10000: '14169',
                    customfield_12600: '17714',
                    'customfield_12600:1': '21057',
                    customfield_10041: '2024-09-11',
                    customfield_10070: '10270',
                    priority: '3',
                    description: description || title,
                    assignee: assignee,
                    labels: ['SaaS专项工作', '数据中台'],
                    timetracking: '',
                    isCreateIssue: 'true',
                    hasWorkStarted: 'false',
                    fieldsToRetain: [
                        'project',
                        'issuetype',
                        'components',
                        'customfield_10000',
                        'customfield_12600',
                        'customfield_10041',
                        'priority',
                        'assignee',
                    ],
                };
                const createTicketResponse = await request(`http://newsee:newsee@bug.new-see.com:8088/secure/QuickCreateIssue.jspa?decorator=none`, {
                    method: 'POST',
                    headers: {
                        Cookie: cookies,
                        Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: qs.stringify(jiraPostData),
                });
                const responseBody = (await createTicketResponse.body.json());
                const createdIssueDetails = responseBody.createdIssueDetails;
                const { id: issueId } = createdIssueDetails;
                const issueKey = responseBody.issueKey;
                const issueUrl = `${jiraBaseUrl}/browse/${issueKey}`;
                const updateData = {
                    issueId,
                    atl_token: atlToken,
                    singleFieldEdit: 'true',
                    fieldsToForcePresent: 'labels',
                    labels: ['SaaS专项工作', '管理驾驶舱'],
                };
                const updateIssueResponse = await request(`http://newsee:newsee@bug.new-see.com:8088/secure/AjaxIssueAction.jspa?decorator=none`, {
                    method: 'POST',
                    headers: {
                        Cookie: cookies,
                        Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: qs.stringify(updateData),
                });
                const updateResponseData = await updateIssueResponse.body.json();
                fastify.log.info(updateResponseData);
                return { issueId, issueKey, issueUrl };
            }
            catch (error) {
                fastify.log.error(error);
                reply.status(500).send({ error: error });
            }
        },
    });
};
export default jira;
