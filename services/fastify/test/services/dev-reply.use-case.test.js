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
        getProjectVersions: async () => [{ id: '23987', name: version.name }],
        getHolidays: async () => new Set(),
        getFields: async () => [],
        getTransitions: async () => [],
        doTransition: async () => {
            calls.push('doTransition');
        },
    };
    const sessionService = {
        resolveCredentials: (credentials) => credentials,
        getSession: async () => ({
            cookies: 'mock-cookie',
            atlToken: 'mock-token',
        }),
        withSession: async (credentials, fn) => fn(await sessionService.getSession(credentials)),
        isSessionExpiredError: () => false,
        invalidate: () => {},
        login: async () => ({ cookies: 'mock-cookie', atlToken: 'mock-token' }),
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
        getProjectVersions: async () => [{ id: '23987', name: version.name }],
        getHolidays: async () => new Set(),
        getFields: async () => [],
        getTransitions: async () => [{ id: '11', name: '开发回复' }],
        doTransition: async () => ({}),
    };
    const sessionService = {
        resolveCredentials: (credentials) => credentials,
        getSession: async () => ({
            cookies: 'mock-cookie',
            atlToken: 'mock-token',
        }),
        withSession: async (credentials, fn) => fn(await sessionService.getSession(credentials)),
        isSessionExpiredError: () => false,
        invalidate: () => {},
        login: async () => ({ cookies: 'mock-cookie', atlToken: 'mock-token' }),
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
        getProjectVersions: async () => overrides.versions ?? [{ id: '23987', name: version.name }],
        suggestFixVersion: overrides.suggestFixVersion
            ? async (input) => {
                calls.push(`suggestFixVersion:${input.candidates.map((c) => c.name).join('|')}`);
                return overrides.suggestFixVersion(input);
            }
            : undefined,
        getHolidays: async () => overrides.holidays ?? new Set(),
        getTransitions: async () => overrides.transitions ?? [],
        doTransition: async () => {
            calls.push('doTransition');
        },
        addComment: async (_issueKey, _cookies, body) => {
            calls.push('addComment');
            comments.push(body);
        },
    };
    const sessionService = {
        resolveCredentials: (credentials) => credentials,
        getSession: async () => ({ cookies: 'c', atlToken: 't' }),
        withSession: async (credentials, fn) => fn(await sessionService.getSession(credentials)),
        isSessionExpiredError: () => false,
        invalidate: () => {},
        login: async () => ({ cookies: 'c', atlToken: 't' }),
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
    const result = await useCase.devReply({ jiraUser: 'zengdi', jiraPassword: '1' }, { issueKey: 'NDE-3150', projectKey: 'NDE', assignee: 'zhouxia' });
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
                value: `${anchor}T10:30:00.000+0800`,
                reason: '计划开始时间已过期',
            },
        ],
    });
    const result = await useCase.devReply({ jiraUser: 'u', jiraPassword: 'p' }, { issueKey: 'NDE-3170', assignee: 'zhouxia' });
    assert.equal(result.status, 'success');
    const applied = updates.find((f) => f.customfield_10100);
    assert.equal(applied?.customfield_10100, `${anchor}T10:30:00.000+0800`);
    assert.equal(comments.length, 1);
    assert.match(comments[0], /计划开始时间/);
});
test('semanticDateReview should exclude non-dev fields from LLM review entirely', async () => {
    const anchor = nextWeekday();
    const { llmInputs, updates, useCase } = makeHarness({
        issueDetails: {
            'NDE-3173': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: anchor,
                customfield_10100: '2020-01-01T10:00:00.000+0800', // 已过期 → 触发评审
                customfield_10041: '2020-01-01',
                customfield_10101: '2020-01-01',
                customfield_10051: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
        fieldMeta: [
            { id: 'customfield_10041', name: '期望上线时间', schema: { type: 'date' } },
            { id: 'customfield_10101', name: '计划测试开始', schema: { type: 'date' } },
            { id: 'customfield_10051', name: '预计测试完成', schema: { type: 'date' } },
            { id: 'customfield_10100', name: '计划开始时间', schema: { type: 'datetime' } },
        ],
        llmDecisions: [
            { fieldId: 'customfield_10041', action: 'update', value: anchor },
            { fieldId: 'customfield_10100', action: 'keep' },
        ],
    });
    const result = await useCase.devReply({ jiraUser: 'u', jiraPassword: 'p' }, { issueKey: 'NDE-3173', assignee: 'zhouxia' });
    const reviewedIds = (llmInputs[0]?.fields ?? []).map((f) => f.fieldId);
    assert.deepEqual(reviewedIds, ['customfield_10100']);
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
                customfield_10100: '2020-01-01T10:00:00.000+0800',
                status: { name: '开发已回复' },
            },
        },
        fieldMeta: [
            { id: 'customfield_10100', name: '计划开始时间', schema: { type: 'datetime' } },
        ],
        llmDecisions: [
            {
                fieldId: 'customfield_10100',
                action: 'update',
                value: '2099-12-26T10:00:00.000+0800',
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
    assert.equal(updates.find((f) => f.customfield_10100 && !/T00:00:00/.test(f.customfield_10100)), undefined);
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

// ===== 工作负载排期模型：版本选择五级优先级 + 推理链 =====
const { findAvailableSlot } = require('../../api/services/jira/utils.js');
const versionNamed = (prefix, daysAhead) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return { name: `${prefix}_V10.1.${fmtYmd(date)}`, date };
};
const pastVersionNamed = (prefix, daysAgo = 60) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return `${prefix}_V10.1.${fmtYmd(date)}`;
};
const workdayAfter = (n) => {
    const d = new Date();
    let count = 0;
    while (count < n) {
        if (d.getDay() !== 0 && d.getDay() !== 6) count++;
        if (count === n) break;
        d.setDate(d.getDate() + 1);
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

test('现有版本仍可行时优先保留，不被同日其他前缀版本替换（ARM 不会被换成 HD）', async () => {
    const arm = versionNamed('ARM', 20);
    const hd = versionNamed('HD', 20); // 同日不同前缀，列表里 HD 还排在前面
    const validDate = nextWeekday();
    const { updates, useCase } = makeHarness({
        versions: [
            { id: 'HD1', name: hd.name },
            { id: 'A1', name: arm.name },
        ],
        issueDetails: {
            'ARM-1': {
                fixVersions: [{ id: 'A1', name: arm.name }],
                customfield_10022: validDate,
                status: { name: '开发已回复' },
            },
        },
    });
    const result = await useCase.devReply({ jiraUser: 'z', jiraPassword: '1' }, {
        issueKey: 'ARM-1', assignee: 'zhouxia',
    });
    assert.equal(result.fixVersionName, arm.name);
    assert.equal(result.status, 'unchanged');
    assert.equal(updates.length, 0);
    assert.match(result.reasoning.join('\n'), /保留/);
});

test('现有版本失效时优先选同前缀车次，而不是同日其他前缀', async () => {
    const newArm = versionNamed('ARM', 30);
    const newHd = versionNamed('HD', 14); // HD 发车更早，但前缀不对
    const { updates, useCase } = makeHarness({
        versions: [
            { id: 'HD1', name: newHd.name },
            { id: 'A2', name: newArm.name },
        ],
        issueDetails: {
            'ARM-2': {
                fixVersions: [{ id: 'A0', name: pastVersionNamed('ARM') }],
                customfield_10022: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
    });
    const result = await useCase.devReply({ jiraUser: 'z', jiraPassword: '1' }, {
        issueKey: 'ARM-2', assignee: 'zhouxia',
    });
    assert.equal(result.fixVersionName, newArm.name);
    assert.deepEqual(updates[0].fixVersions, [{ id: 'A2' }]);
    assert.match(result.reasoning.join('\n'), /同前缀/);
});

test('无历史版本时汇入经办人工作负载主流版本', async () => {
    const dc = versionNamed('DC', 30);
    const ai = versionNamed('AI', 30);
    const { useCase } = makeHarness({
        versions: [
            { id: 'AI1', name: ai.name },
            { id: 'DC1', name: dc.name },
        ],
        issueDetails: {
            'NLC-1': {
                fixVersions: [],
                customfield_10022: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
        // 经办人其他未完成单：3 单在 DC、1 单在 AI → 主流是 DC
        issues: [
            { fields: { fixVersions: [{ id: 'DC1', name: dc.name }] } },
            { fields: { fixVersions: [{ id: 'DC1', name: dc.name }] } },
            { fields: { fixVersions: [{ id: 'DC1', name: dc.name }] } },
            { fields: { fixVersions: [{ id: 'AI1', name: ai.name }] } },
        ],
    });
    const result = await useCase.devReply({ jiraUser: 'z', jiraPassword: '1' }, {
        issueKey: 'NLC-1', assignee: 'zhouxia',
    });
    assert.equal(result.fixVersionName, dc.name);
    assert.match(result.reasoning.join('\n'), /主流版本|汇入/);
});

test('无前缀无主流版本时采纳 AI 建议（候选集外一律忽略）', async () => {
    const dc = versionNamed('DC', 30);
    const ai = versionNamed('AI', 14);
    const { calls, useCase } = makeHarness({
        versions: [
            { id: 'DC1', name: dc.name },
            { id: 'AI1', name: ai.name },
        ],
        issueDetails: {
            'NLC-2': {
                fixVersions: [],
                customfield_10022: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
        issues: [],
        suggestFixVersion: () => ({ version: ai.name, reason: 'AI 综合考虑' }),
    });
    const result = await useCase.devReply({ jiraUser: 'z', jiraPassword: '1' }, {
        issueKey: 'NLC-2', assignee: 'zhouxia',
    });
    assert.equal(result.fixVersionName, ai.name);
    assert.equal(calls.some((c) => c.startsWith('suggestFixVersion')), true);
    assert.match(result.reasoning.join('\n'), /AI 建议/);
});

test('AI 建议不在可行候选内时走确定性兜底（发车日最近有余量车次）', async () => {
    const dc = versionNamed('DC', 30);
    const ai = versionNamed('AI', 14); // 发车更早 → 兜底应选它
    const { useCase } = makeHarness({
        versions: [
            { id: 'DC1', name: dc.name },
            { id: 'AI1', name: ai.name },
        ],
        issueDetails: {
            'NLC-3': {
                fixVersions: [],
                customfield_10022: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
        issues: [],
        suggestFixVersion: () => ({ version: 'GARBAGE_V99' }),
    });
    const result = await useCase.devReply({ jiraUser: 'z', jiraPassword: '1' }, {
        issueKey: 'NLC-3', assignee: 'zhouxia',
    });
    assert.equal(result.fixVersionName, ai.name);
    assert.match(result.reasoning.join('\n'), /不在可行候选内|兜底/);
});

test('所有版本窗口均无容量时明确失败，不写假日期', async () => {
    const { updates, useCase } = makeHarness({
        versions: [{ id: 'P1', name: pastVersionNamed('DC') }],
        issueDetails: {
            'NLC-4': {
                fixVersions: [],
                customfield_10022: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
        issues: [],
    });
    const result = await useCase.devReply({ jiraUser: 'z', jiraPassword: '1' }, {
        issueKey: 'NLC-4', assignee: 'zhouxia',
    });
    assert.equal(result.failedSteps.includes('selectFixVersion'), true);
    assert.equal(updates.length, 0); // 没有"版本前一天"假日期被写入
});

test('版本窗口分配避让节假日和他人占用日（一日一单）', async () => {
    const occupied = workdayAfter(1); // 第一个工作日被别人占了
    const holiday = workdayAfter(2);   // 第二个是封网
    const ver = versionNamed('DC', 20);
    const { updates, useCase } = makeHarness({
        versions: [{ id: 'DC1', name: ver.name }],
        holidays: new Set([holiday]),
        issueDetails: {
            'NLC-5': {
                fixVersions: [],
                customfield_10022: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
        issues: [{ fields: { customfield_10022: occupied } }],
    });
    const result = await useCase.devReply({ jiraUser: 'z', jiraPassword: '1' }, {
        issueKey: 'NLC-5', assignee: 'zhouxia',
    });
    const allocated = updates[0].customfield_10022;
    assert.notEqual(allocated, occupied);
    assert.notEqual(allocated, holiday);
    assert.equal(allocated, findAvailableSlot(ver.date, new Set([occupied]), new Set([holiday])));
});

test('语义巡检：无违规字段时跳过 LLM，不做任何改写', async () => {
    const validDate = nextWeekday();
    const { llmInputs, updates, useCase } = makeHarness({
        fieldMeta: [
            { id: 'customfield_90000', name: '联调时间', schema: { type: 'date' } },
        ],
        issueDetails: {
            'NLC-6': {
                fixVersions: [{ id: '23987' }],
                customfield_10022: validDate,
                customfield_90000: validDate, // 合规值
                status: { name: '开发已回复' },
            },
        },
    });
    const result = await useCase.devReply({ jiraUser: 'z', jiraPassword: '1' }, {
        issueKey: 'NLC-6', assignee: 'zhouxia',
    });
    assert.equal(result.status, 'unchanged');
    assert.equal(llmInputs.length, 0); // LLM 根本没被调用
    assert.equal(updates.filter((f) => f.customfield_90000).length, 0);
});

test('审计详情包含完整推理链，末行为结论', async () => {
    const { audits, useCase } = makeHarness({
        issueDetails: {
            'NLC-8': {
                fixVersions: [{ id: 'OLD', name: pastVersionNamed('DC') }],
                customfield_10022: '2020-01-01',
                status: { name: '开发已回复' },
            },
        },
        issues: [],
    });
    await useCase.devReply({ jiraUser: 'z', jiraPassword: '1' }, {
        issueKey: 'NLC-8', assignee: 'zhouxia',
    });
    assert.equal(audits.length, 1);
    const reasoning = audits[0].details.reasoning;
    assert.equal(Array.isArray(reasoning), true);
    assert.equal(reasoning.length > 0, true);
    assert.match(reasoning[reasoning.length - 1], /^结论：/);
});

test('无可行版本且工单未回复：直接失败，不尝试工作流转换', async () => {
    const { calls, updates, useCase } = makeHarness({
        versions: [], // ITOPS 项目下无未发布版本
        issueDetails: {
            'ITOPS-1': {
                fixVersions: [],
                customfield_10022: null,
                status: { name: '创建工单' },
            },
        },
        transitions: [{ id: '11', name: '开发回复' }],
    });
    const result = await useCase.devReply({ jiraUser: 'z', jiraPassword: '1' }, {
        issueKey: 'ITOPS-1', assignee: 'xiezhekai',
    });
    assert.equal(result.success, false);
    assert.equal(result.status, 'failure');
    assert.equal(calls.includes('doTransition'), false);
    assert.equal(updates.length, 0);
    assert.equal(result.failedSteps.includes('selectFixVersion'), true);
    assert.match(result.message, /预计开发完成时间/);
    const conclusion = result.reasoning[result.reasoning.length - 1];
    assert.match(conclusion, /^结论：/);
});
