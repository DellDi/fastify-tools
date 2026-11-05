import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { CreateTicketWithLabelsUseCase } = require('../../api/services/jira/use-cases/create-ticket-with-labels.use-case.js');
test('createTicketWithLabels use-case should update labels and auto dev reply', async () => {
    const calls = [];
    const logger = {
        info(message) {
            calls.push(`logger.info:${message}`);
        },
        warn(message) {
            calls.push(`logger.warn:${message}`);
        },
        error() { },
    };
    const createTicket = async (_credentials, _data) => {
        calls.push('createTicket');
        return {
            issueId: '10001',
            issueKey: 'NDE-1',
            issueUrl: 'http://jira.test/browse/NDE-1',
            updateMsg: '工单创建成功',
            matchInfo: {
                componentId: 'cmp-1',
                projectKey: 'NDE',
                projectName: 'NDE',
                issueTypeId: '10001',
                issueTypeName: 'Task',
                confidence: 'high',
            },
        };
    };
    const updateTicket = async (_credentials, data) => {
        calls.push('updateTicket');
        assert.equal(data.issueIdOrKey, 'NDE-1');
        assert.deepEqual(data.fields, {
            labels: ['foo', 'bar'],
        });
        return { message: 'ok' };
    };
    const devReply = async (_credentials, data) => {
        calls.push('devReply');
        assert.deepEqual(data, {
            issueKey: 'NDE-1',
            projectKey: 'NDE',
            assignee: 'alice',
        });
        return {
            success: true,
            issueKey: 'NDE-1',
            message: 'ok',
        };
    };
    const useCase = new CreateTicketWithLabelsUseCase(logger, {
        defaultProject: 'V10',
    }, createTicket, updateTicket, devReply);
    const result = await useCase.execute({
        jiraUser: 'alice',
        jiraPassword: 'secret',
    }, {
        title: 'title',
        description: 'desc',
        labels: 'foo,bar',
        autoDevReply: true,
        assignee: 'alice',
    });
    assert.equal(result.issueKey, 'NDE-1');
    assert.equal(result.devReply?.success, true);
    assert.deepEqual(calls, [
        'createTicket',
        'updateTicket',
        'devReply',
        'logger.info:Dev reply completed for NDE-1',
    ]);
});
