import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { CreateTicketUseCase } = require('../../api/services/jira/use-cases/create-ticket.use-case.js');
test('createTicket use-case should orchestrate smart match, meta, custom info, issue creation and follow-up update', async () => {
    const calls = [];
    const logger = {
        info(...args) {
            calls.push(`logger.info:${String(args[0])}`);
        },
        warn(...args) {
            calls.push(`logger.warn:${String(args[0])}`);
        },
        error(...args) {
            calls.push(`logger.error:${String(args[0])}`);
        },
    };
    const jiraRestService = {
        getProjects: async (_cookies) => {
            calls.push('getProjects');
            return [{ key: 'NDE', name: 'NDE' }];
        },
        getIssueTypes: async (_projectKey, _cookies) => {
            calls.push('getIssueTypes');
            return {
                issueTypes: [{ id: '10001', name: 'Task' }],
                components: [{ id: 'cmp-1', name: 'component-1' }],
            };
        },
        matchProjectAndIssueType: async () => {
            calls.push('matchProjectAndIssueType');
            return {
                componentId: 'cmp-1',
                projectKey: 'NDE',
                projectName: 'NDE',
                issueTypeId: '10001',
                issueTypeName: 'Task',
                confidence: 'high',
            };
        },
        createMeta: async () => {
            calls.push('createMeta');
            return {
                values: [{ fieldId: 'customfield_10000' }],
            };
        },
        genCustomInfo: async () => {
            calls.push('genCustomInfo');
            return {
                customfield_10000: 'auto-value',
            };
        },
        createIssue: async (payload, _cookies, options) => {
            calls.push('createIssue');
            assert.equal(payload.customAutoFields.customfield_10000, 'auto-value');
            assert.equal(options.projectKey, 'NDE');
            assert.equal(options.issueTypeId, '10001');
            assert.equal(options.componentId, 'cmp-1');
            return {
                id: '10086',
                key: 'NDE-10086',
            };
        },
        getCustomInfo: () => {
            calls.push('getCustomInfo');
            return {
                customfield_20000: 'customer-value',
            };
        },
    };
    const sessionService = {
        getSession: async (_credentials) => {
            calls.push('getSession');
            return {
                cookies: 'mock-cookie',
                atlToken: 'mock-token',
            };
        },
    };
    const updateTicket = async (_credentials, data) => {
        calls.push('updateTicket');
        assert.equal(data.issueIdOrKey, 'NDE-10086');
        assert.deepEqual(data.fields, {
            customfield_20000: 'customer-value',
        });
        return { message: 'ok' };
    };
    const useCase = new CreateTicketUseCase(logger, jiraRestService, sessionService, {
        baseUrl: 'http://jira.test',
        defaultProject: 'V10',
        defaultIssueType: '4',
    }, updateTicket);
    const result = await useCase.createTicket({
        jiraUser: 'alice',
        jiraPassword: 'secret',
    }, {
        title: 'title',
        description: 'description',
        customerName: 'customer-a',
        smartMatch: true,
    });
    assert.equal(result.issueId, '10086');
    assert.equal(result.issueKey, 'NDE-10086');
    assert.equal(result.issueUrl, 'http://jira.test/browse/NDE-10086');
    assert.equal(result.matchInfo?.projectKey, 'NDE');
    assert.deepEqual(calls, [
        'getSession',
        'getProjects',
        'getIssueTypes',
        'matchProjectAndIssueType',
        'logger.info:Smart match result: componentId=cmp-1, project=NDE, issueType=10001, confidence=high',
        'createMeta',
        'genCustomInfo',
        'logger.info:[object Object]',
        'getIssueTypes',
        'createIssue',
        'getCustomInfo',
        'logger.info:[object Object]',
        'updateTicket',
    ]);
});
test('createTicket use-case should keep explicit projectKey when smartMatch fills missing issueTypeId', async () => {
    const calls = [];
    const logger = {
        info(...args) {
            calls.push(`logger.info:${String(args[0])}`);
        },
        warn(...args) {
            calls.push(`logger.warn:${String(args[0])}`);
        },
        error(...args) {
            calls.push(`logger.error:${String(args[0])}`);
        },
    };
    const jiraRestService = {
        getProjects: async (_cookies) => {
            calls.push('getProjects');
            return [{ key: 'NDE', name: 'NDE' }];
        },
        getIssueTypes: async (_projectKey, _cookies) => {
            calls.push('getIssueTypes');
            return {
                issueTypes: [{ id: '10604', name: '新需求' }],
                components: [{ id: 'cmp-2', name: 'component-2' }],
            };
        },
        matchProjectAndIssueType: async () => {
            calls.push('matchProjectAndIssueType');
            return {
                componentId: 'cmp-2',
                projectKey: 'CPYF',
                projectName: 'CPYF',
                issueTypeId: '10604',
                issueTypeName: '新需求',
                confidence: 'high',
            };
        },
        createMeta: async () => {
            calls.push('createMeta');
            return {
                values: [],
            };
        },
        genCustomInfo: async () => {
            calls.push('genCustomInfo');
            return {};
        },
        createIssue: async (payload, _cookies, options) => {
            calls.push('createIssue');
            assert.equal(options.projectKey, 'NDE');
            assert.equal(options.issueTypeId, '10604');
            assert.equal(options.componentId, 'cmp-2');
            return {
                id: '20001',
                key: 'NDE-20001',
            };
        },
        getCustomInfo: () => {
            calls.push('getCustomInfo');
            return {};
        },
    };
    const sessionService = {
        getSession: async (_credentials) => {
            calls.push('getSession');
            return {
                cookies: 'mock-cookie',
                atlToken: 'mock-token',
            };
        },
    };
    const updateTicket = async (_credentials, _data) => {
        calls.push('updateTicket');
        return { message: 'ok' };
    };
    const useCase = new CreateTicketUseCase(logger, jiraRestService, sessionService, {
        baseUrl: 'http://jira.test',
        defaultProject: 'V10',
        defaultIssueType: '4',
    }, updateTicket);
    const result = await useCase.createTicket({
        jiraUser: 'alice',
        jiraPassword: 'secret',
    }, {
        title: 'title',
        description: 'description',
        projectKey: 'NDE',
        smartMatch: true,
    });
    assert.equal(result.issueKey, 'NDE-20001');
    assert.equal(result.matchInfo?.projectKey, 'NDE');
    assert.equal(result.matchInfo?.issueTypeId, '10604');
    assert.deepEqual(calls, [
        'getSession',
        'getProjects',
        'getIssueTypes',
        'matchProjectAndIssueType',
        'logger.info:Smart match result: componentId=cmp-2, project=NDE, issueType=10604, confidence=high',
        'createMeta',
        'genCustomInfo',
        'logger.info:[object Object]',
        'getIssueTypes',
        'createIssue',
    ]);
});
test('createTicket use-case should not pass default component for explicit non-default project without smart match', async () => {
    const calls = [];
    const logger = {
        info(...args) {
            calls.push(`logger.info:${String(args[0])}`);
        },
        warn(...args) {
            calls.push(`logger.warn:${String(args[0])}`);
        },
        error(...args) {
            calls.push(`logger.error:${String(args[0])}`);
        },
    };
    const jiraRestService = {
        getIssueTypes: async (projectKey) => {
            calls.push('getIssueTypes');
            assert.equal(projectKey, 'NLC');
            return {
                issueTypes: [{ id: '4', name: '新需求' }],
                components: [{ id: 'nlc-cmp-1', name: 'NLC 默认组件' }],
            };
        },
        createMeta: async (projectKey, issueTypeId) => {
            calls.push('createMeta');
            assert.equal(projectKey, 'NLC');
            assert.equal(issueTypeId, '4');
            return { values: [] };
        },
        genCustomInfo: async () => {
            calls.push('genCustomInfo');
            return {};
        },
        createIssue: async (payload, _cookies, options) => {
            calls.push('createIssue');
            assert.equal(payload.assignee, 'alice');
            assert.equal(options.projectKey, 'NLC');
            assert.equal(options.issueTypeId, '4');
            assert.equal(options.componentId, 'nlc-cmp-1');
            return {
                id: '30001',
                key: 'NLC-30001',
            };
        },
    };
    const sessionService = {
        getSession: async (_credentials) => {
            calls.push('getSession');
            return {
                cookies: 'mock-cookie',
                atlToken: 'mock-token',
            };
        },
    };
    const updateTicket = async () => ({ message: 'ok' });
    const useCase = new CreateTicketUseCase(logger, jiraRestService, sessionService, {
        baseUrl: 'http://jira.test',
        defaultProject: 'NDE',
        defaultIssueType: '4',
    }, updateTicket);
    const result = await useCase.createTicket({
        jiraUser: 'alice',
        jiraPassword: 'secret',
    }, {
        title: '数智底座需求',
        description: 'description',
        projectKey: 'NLC',
        smartMatch: false,
    });
    assert.equal(result.issueKey, 'NLC-30001');
    assert.deepEqual(calls, [
        'getSession',
        'createMeta',
        'genCustomInfo',
        'logger.info:[object Object]',
        'getIssueTypes',
        'createIssue',
    ]);
});
