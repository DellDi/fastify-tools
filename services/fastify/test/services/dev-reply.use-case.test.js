import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { DevReplyUseCase } = require('../../api/services/jira/use-cases/dev-reply.use-case.js');
const fmtYmd = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
const futureVersion = () => {
    const date = new Date();
    date.setDate(date.getDate() + 60);
    return { name: `DC_V10.1.${fmtYmd(date)}`, date };
};
test('devReply should still update fields when transition is unavailable', async () => {
    const calls = [];
    const version = futureVersion();
    const logger = {
        info(message) {
            calls.push(`logger.info:${message}`);
        },
        warn(message) {
            calls.push(`logger.warn:${message}`);
        },
        error(message) {
            calls.push(`logger.error:${message}`);
        },
    };
    const jiraRestService = {
        searchIssuesByJql: async () => ({ issues: [] }),
        getMaxUsedDate: () => undefined,
        getProjectVersions: async () => [{ id: '23987', name: version.name }],
        selectFixVersionSmart: () => ({
            version: { id: '23987', name: version.name },
            date: version.date,
        }),
        getHolidays: async () => new Set(),
        getTransitions: async () => [],
        doTransition: async () => {
            calls.push('doTransition');
        },
    };
    const session = { cookies: 'mock-cookie', atlToken: 'mock-token' };
    const sessionService = {
        resolveCredentials: (credentials) => credentials,
        getSession: async () => session,
        withSession: async (_credentials, fn) => fn(session),
        isSessionExpiredError: () => false,
        invalidate: () => { },
        login: async () => session,
    };
    const updateTicket = async (_credentials, data) => {
        calls.push('updateTicket');
        assert.equal(data.issueIdOrKey, 'NDE-3149');
        assert.deepEqual(data.fields, {
            fixVersions: [{ id: '23987' }],
            customfield_10022: '2026-03-18',
        });
        return { message: 'ok' };
    };
    const useCase = new DevReplyUseCase(logger, jiraRestService, sessionService, updateTicket);
    const result = await useCase.devReply({ jiraUser: 'zengdi', jiraPassword: '1' }, {
        issueKey: 'NDE-3149',
        projectKey: 'NDE',
        assignee: 'lvkailang',
        devCompleteDate: '2026-03-18',
    });
    assert.equal(result.success, true);
    assert.equal(result.status, 'partial_success');
    assert.equal(result.fieldUpdateSuccess, true);
    assert.equal(result.transitionSuccess, false);
    assert.equal(result.fixVersionName, version.name);
    assert.equal(result.devCompleteDate, '2026-03-18');
    assert.match(result.message, /字段已更新/);
    assert.deepEqual(calls.includes('updateTicket'), true);
    assert.deepEqual(calls.includes('doTransition'), false);
});
test('devReplyBatch should reserve allocated dev complete dates within the same batch', async () => {
    const updatedDates = [];
    const version = futureVersion();
    const logger = {
        info() { },
        warn() { },
        error() { },
    };
    const jiraRestService = {
        searchIssuesByJql: async () => ({ issues: [] }),
        getMaxUsedDate: (usedDates) => {
            if (usedDates.size === 0) {
                return undefined;
            }
            return Array.from(usedDates).sort()[usedDates.size - 1];
        },
        getProjectVersions: async () => [{ id: '23987', name: version.name }],
        selectFixVersionSmart: () => ({
            version: { id: '23987', name: version.name },
            date: version.date,
        }),
        getHolidays: async () => new Set(),
        getTransitions: async () => [{ id: '11', name: '开发回复' }],
        doTransition: async () => ({}),
    };
    const session = { cookies: 'mock-cookie', atlToken: 'mock-token' };
    const sessionService = {
        resolveCredentials: (credentials) => credentials,
        getSession: async () => session,
        withSession: async (_credentials, fn) => fn(session),
        isSessionExpiredError: () => false,
        invalidate: () => { },
        login: async () => session,
    };
    const updateTicket = async (_credentials, data) => {
        updatedDates.push(data.fields.customfield_10022);
        return { message: 'ok' };
    };
    const useCase = new DevReplyUseCase(logger, jiraRestService, sessionService, updateTicket);
    const result = await useCase.devReplyBatch({ jiraUser: 'zengdi', jiraPassword: '1' }, {
        issueKeys: ['NDE-3149', 'NDE-3150'],
        projectKey: 'NDE',
        assignee: 'lvkailang',
    });
    assert.equal(result.successCount, 2);
    assert.equal(updatedDates.length, 2);
    assert.notEqual(updatedDates[0], updatedDates[1]);
});
const nextWeekday = () => {
    const d = new Date();
    while (d.getDay() === 0 || d.getDay() === 6) {
        d.setDate(d.getDate() + 1);
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const makeHarness = (overrides) => {
    const calls = [];
    const comments = [];
    const updates = [];
    const audits = [];
    const llmInputs = [];
    const version = futureVersion();
    const logger = { info() { }, warn() { }, error() { } };
    const jiraRestService = {
        getIssueDetail: async (issueKey) => {
            calls.push(`getIssueDetail:${issueKey}`);
            const fields = overrides.issueDetails?.[issueKey];
            if (!fields) {
                throw new Error('issue not found');
            }
            return { fields };
        },
        getFields: async () => overrides.fieldMeta ?? [],
        reviewScheduleFields: async (input) => {
            llmInputs.push(input);
            if (overrides.llmError) {
                throw new Error(overrides.llmError);
            }
            return overrides.llmDecisions ?? [];
        },
        searchIssuesByJql: async () => ({
            issues: overrides.issues ?? [],
        }),
        getMaxUsedDate: (usedDates) => {
            if (usedDates.size === 0)
                return undefined;
            return Array.from(usedDates).sort()[usedDates.size - 1];
        },
        getProjectVersions: async () => [{ id: '23987', name: version.name }],
        selectFixVersionSmart: () => ({
            version: { id: '23987', name: version.name },
            date: version.date,
        }),
        getHolidays: async () => new Set(),
        getTransitions: async () => overrides.transitions ?? [],
        suggestFixVersion: async () => undefined,
        doTransition: async () => {
            calls.push('doTransition');
        },
        addComment: async (_issueKey, _cookies, body) => {
            calls.push('addComment');
            comments.push(body);
        },
    };
    const session = { cookies: 'c', atlToken: 't' };
    const sessionService = {
        resolveCredentials: (credentials) => credentials,
        getSession: async () => session,
        withSession: async (_credentials, fn) => fn(session),
        isSessionExpiredError: () => false,
        invalidate: () => { },
        login: async () => session,
    };
    const updateTicket = async (_credentials, data) => {
        calls.push('updateTicket');
        updates.push(data.fields);
        return { message: 'ok' };
    };
    return {
        calls,
        comments,
        updates,
        audits,
        llmInputs,
        useCase: new DevReplyUseCase(logger, jiraRestService, sessionService, updateTicket, async (entry) => {
            audits.push(entry);
        }),
    };
};
test('devReply reconcile should keep an already-replied compliant issue unchanged', async () => {
    const validDate = nextWeekday();
    const { calls, comments, updates, useCase } = makeHarness({
        issueDetails: {
            'NDE-3149': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: validDate,
                status: { name: '开发已回复' },
            },
        },
        issues: [{ fields: { customfield_10022: validDate } }],
    });
    const result = await useCase.devReply({ jiraUser: 'zengdi', jiraPassword: '1' }, { issueKey: 'NDE-3149', projectKey: 'NDE', assignee: 'zhouxia' });
    assert.equal(result.status, 'unchanged');
    assert.equal(result.success, true);
    assert.equal(updates.length, 0);
    assert.equal(calls.includes('doTransition'), false);
    assert.equal(comments.length, 0);
});
test('devReply reconcile should fix drifted fields on an already-replied issue and comment', async () => {
    const { comments, updates, useCase } = makeHarness({
        issueDetails: {
            'NDE-3150': {
                fixVersions: [{ id: '100' }, { id: '23987' }],
                customfield_10022: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
        issues: [{ fields: { customfield_10022: '2020-01-01' } }],
    });
    const result = await useCase.devReply({ jiraUser: 'zengdi', jiraPassword: '1' }, {
        issueKey: 'NDE-3150',
        projectKey: 'NDE',
        assignee: 'zhouxia',
        withComment: true,
    });
    assert.equal(result.status, 'success');
    assert.match(result.message, /已是回复状态，字段已按需调整/);
    assert.equal(updates.length, 1);
    assert.deepEqual(updates[0].fixVersions, [{ id: '23987' }]);
    assert.notEqual(updates[0].customfield_10022, '2020-01-01');
    assert.equal(comments.length, 1);
    assert.match(comments[0], /修复版本|预计|排期|实施/);
});
test('devReply with reconcile=false should not read current state and blind-write', async () => {
    const { calls, updates, useCase } = makeHarness({});
    await useCase.devReply({ jiraUser: 'zengdi', jiraPassword: '1' }, {
        issueKey: 'NDE-3151',
        projectKey: 'NDE',
        assignee: 'zhouxia',
        devCompleteDate: '2026-03-18',
        reconcile: false,
    });
    assert.equal(calls.some((c) => c.startsWith('getIssueDetail')), false);
    assert.equal(updates.length, 1);
    assert.equal(updates[0].customfield_10022, '2026-03-18');
});
test('devReply reconcile should normalize a 00:00 plan start time', async () => {
    const { updates, useCase } = makeHarness({
        issueDetails: {
            'NDE-3160': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: '2026-11-10',
                customfield_10100: '2026-11-10T00:00:00.000+0800',
                status: { name: '开发已回复' },
            },
        },
        issues: [],
    });
    const result = await useCase.devReply({ jiraUser: 'zengdi', jiraPassword: '1' }, { issueKey: 'NDE-3160', projectKey: 'NDE', assignee: 'zhouxia' });
    assert.equal(result.success, true);
    const startUpdate = updates.find((f) => f.customfield_10100);
    assert.ok(startUpdate, '应当修正 00:00 的计划开始时间');
    assert.doesNotMatch(startUpdate.customfield_10100, /T00:00:00/);
    assert.match(startUpdate.customfield_10100, /^2026-11-10T(09|1[0-7]):[0-5]\d:00\.000\+0800$/);
});
test('devReplyBatch should collect unchangedIssueKeys', async () => {
    const validDate = nextWeekday();
    const { useCase } = makeHarness({
        issueDetails: {
            'NDE-3149': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: validDate,
                status: { name: '开发已回复' },
            },
            'NDE-3150': {
                fixVersions: [{ id: '999' }],
                customfield_10022: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
    });
    const result = await useCase.devReplyBatch({ jiraUser: 'zengdi', jiraPassword: '1' }, {
        issueKeys: ['NDE-3149', 'NDE-3150'],
        projectKey: 'NDE',
        assignee: 'zhouxia',
    });
    assert.deepEqual(result.unchangedIssueKeys, ['NDE-3149']);
    assert.equal(result.results[0].status, 'unchanged');
    assert.equal(result.results[1].status, 'success');
});
test('semanticDateReview should apply a valid LLM suggestion for an expired dev-scope field', async () => {
    const anchor = nextWeekday();
    const { comments, updates, useCase } = makeHarness({
        issueDetails: {
            'NDE-3170': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: anchor,
                customfield_10086: '2020-01-01T10:00:00.000+0800',
                status: { name: '开发已回复' },
            },
        },
        fieldMeta: [
            { id: 'customfield_10022', name: '预计开发完成', schema: { type: 'date' } },
            { id: 'customfield_10086', name: '预计联调完成时间', schema: { type: 'datetime' } },
        ],
        llmDecisions: [
            {
                fieldId: 'customfield_10086',
                action: 'update',
                value: `${anchor}T10:30:00.000+0800`,
                reason: '预计联调完成时间已过期',
            },
        ],
    });
    const result = await useCase.devReply({ jiraUser: 'u', jiraPassword: 'p' }, { issueKey: 'NDE-3170', assignee: 'zhouxia', withComment: true });
    assert.equal(result.status, 'success');
    const applied = updates.find((f) => f.customfield_10086);
    assert.equal(applied?.customfield_10086, `${anchor}T10:30:00.000+0800`);
    assert.equal(comments.length, 1);
    assert.match(comments[0], /预计联调完成时间/);
});
test('semanticDateReview should treat a past start field as a historical anchor', async () => {
    const anchor = nextWeekday();
    const { llmInputs, updates, useCase } = makeHarness({
        issueDetails: {
            'NDE-3174': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: anchor,
                customfield_10100: '2020-01-01T10:00:00.000+0800',
                status: { name: '开发已回复' },
            },
        },
        fieldMeta: [
            { id: 'customfield_10022', name: '预计开发完成', schema: { type: 'date' } },
            { id: 'customfield_10100', name: '计划开始时间', schema: { type: 'datetime' } },
        ],
        llmDecisions: [
            {
                fieldId: 'customfield_10100',
                action: 'update',
                value: `${anchor}T09:00:00.000+0800`,
                reason: '计划开始时间已过期',
            },
        ],
    });
    const result = await useCase.devReply({ jiraUser: 'u', jiraPassword: 'p' }, { issueKey: 'NDE-3174', assignee: 'zhouxia' });
    assert.equal(result.status, 'unchanged');
    assert.equal(llmInputs.length, 0);
    assert.equal(updates.find((f) => f.customfield_10100), undefined);
});
test('semanticDateReview should exclude non-dev fields from LLM review entirely', async () => {
    const anchor = nextWeekday();
    const { llmInputs, updates, useCase } = makeHarness({
        issueDetails: {
            'NDE-3173': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: anchor,
                customfield_10100: `${anchor}T10:00:00.000+0800`,
                customfield_10041: '2020-01-01',
                customfield_10101: '2020-01-01',
                customfield_10051: '2020-01-01',
                customfield_10086: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
        fieldMeta: [
            { id: 'customfield_10041', name: '期望上线时间', schema: { type: 'date' } },
            { id: 'customfield_10101', name: '计划测试开始', schema: { type: 'date' } },
            { id: 'customfield_10051', name: '预计测试完成', schema: { type: 'date' } },
            { id: 'customfield_10100', name: '计划开始时间', schema: { type: 'datetime' } },
            { id: 'customfield_10086', name: '预计联调完成时间', schema: { type: 'date' } },
        ],
        llmDecisions: [
            { fieldId: 'customfield_10041', action: 'update', value: anchor },
            { fieldId: 'customfield_10100', action: 'keep' },
            { fieldId: 'customfield_10086', action: 'keep' },
        ],
    });
    const result = await useCase.devReply({ jiraUser: 'u', jiraPassword: 'p' }, { issueKey: 'NDE-3173', assignee: 'zhouxia' });
    const reviewedIds = (llmInputs[0]?.fields ?? []).map((f) => f.fieldId);
    assert.deepEqual(reviewedIds, ['customfield_10100', 'customfield_10086']);
    assert.equal(updates.find((f) => f.customfield_10041), undefined);
    assert.equal(result.status, 'unchanged');
});
test('semanticDateReview should reject LLM suggestions violating deterministic rules', async () => {
    const anchor = nextWeekday();
    const { updates, useCase } = makeHarness({
        issueDetails: {
            'NDE-3171': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: anchor,
                customfield_10086: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
        fieldMeta: [
            { id: 'customfield_10086', name: '预计联调完成时间', schema: { type: 'date' } },
        ],
        llmDecisions: [
            {
                fieldId: 'customfield_10086',
                action: 'update',
                value: '2099-12-26',
                reason: '过期字段',
            },
            { fieldId: 'customfield_99999', action: 'update', value: '2099-01-01' },
        ],
    });
    const result = await useCase.devReply({ jiraUser: 'u', jiraPassword: 'p' }, {
        issueKey: 'NDE-3171',
        assignee: 'zhouxia',
        extraHolidays: ['2099-12-25~2099-12-31'],
    });
    assert.equal(result.status, 'unchanged');
    assert.equal(updates.find((f) => f.customfield_10086), undefined);
});
test('semanticDateReview should fall back to the hard rule when LLM fails', async () => {
    const anchor = nextWeekday();
    const { updates, useCase } = makeHarness({
        issueDetails: {
            'NDE-3172': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: anchor,
                customfield_10100: '2030-01-01T10:00:00.000+0800',
                status: { name: '开发已回复' },
            },
        },
        fieldMeta: [
            { id: 'customfield_10100', name: '计划开始时间', schema: { type: 'datetime' } },
        ],
        llmError: 'LLM API error: 503',
    });
    const result = await useCase.devReply({ jiraUser: 'u', jiraPassword: 'p' }, { issueKey: 'NDE-3172', assignee: 'zhouxia' });
    assert.equal(result.status, 'success');
    const startUpdate = updates.find((f) => f.customfield_10100);
    assert.ok(startUpdate, '硬规则兜底应修正晚于锚点的计划开始时间');
    assert.match(startUpdate.customfield_10100, new RegExp(`^${anchor}T(09|1[0-7]):[0-5]\\d:00\\.000\\+0800$`));
});
test('devReplyBatch should write an audit row per issue with a shared batchId', async () => {
    const validDate = nextWeekday();
    const { audits, useCase } = makeHarness({
        issueDetails: {
            'NDE-3149': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: validDate,
                status: { name: '开发已回复' },
            },
            'NDE-3150': {
                fixVersions: [{ id: '999' }],
                customfield_10022: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
    });
    await useCase.devReplyBatch({ jiraUser: 'u', jiraPassword: 'p' }, { issueKeys: ['NDE-3149', 'NDE-3150'], assignee: 'zhouxia' });
    assert.equal(audits.length, 2);
    assert.equal(audits[0].batchId, audits[1].batchId);
    assert.equal(audits[0].issueKey, 'NDE-3149');
    assert.equal(audits[0].status, 'unchanged');
    assert.equal(audits[1].issueKey, 'NDE-3150');
    assert.equal(audits[1].status, 'success');
    assert.equal(audits[0].assignee, 'zhouxia');
    assert.equal(audits[0].projectKey, 'NDE');
    assert.equal(typeof audits[0].durationMs, 'number');
    assert.ok(audits[0].details.successfulSteps);
});
