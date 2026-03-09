# Jira Service Dev Reply Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在不改变现有路由调用方式的前提下，将 `JiraService` 中的 `devReply` / `devReplyBatch` 及凭证会话逻辑做第一刀渐进式拆分。

**Architecture:** 保留 `JiraService` 作为 facade，对外方法名与调用方式不变；新增独立的 session service 管理凭证解析与 session 获取；新增独立的 dev-reply use-case 管理开发回复流程编排。这样先把高变化、高复杂度逻辑迁出，后续再继续拆其他 use-case。

**Tech Stack:** TypeScript, Fastify, TypeBox, Node.js test runner, ts-node/esm, pnpm

---

### Task 1: 抽离 Jira session 与凭证解析

**Files:**
- Create: `services/fastify/src/services/jira/jira-session.service.ts`
- Modify: `services/fastify/src/services/jira/jira.service.ts`
- Test: `services/fastify/test/services/jira.service.test.ts`

**Step 1: 先补最小行为测试**

验证 `devReplyBatch` 在默认凭证与外部凭证下都能继续工作，不因为 session service 抽离而回归。

**Step 2: 实现独立 session service**

封装：
- `resolveCredentials`
- `getSessionKey`
- `login`
- `getSession`

要求：
- 保持原有缓存与错误行为一致
- 不改变 `JiraService` 公开接口

**Step 3: 在 `JiraService` 中接入新 session service**

- 通过组合而不是继承
- 保留 `login` / `getSession` 公开方法作为 facade

**Step 4: 跑测试与编译**

Run: `pnpm exec tsc --noEmit -p services/fastify/tsconfig.json`
Expected: PASS

### Task 2: 抽离 dev-reply use-case

**Files:**
- Create: `services/fastify/src/services/jira/use-cases/dev-reply.use-case.ts`
- Modify: `services/fastify/src/services/jira/jira.service.ts`
- Modify: `services/fastify/src/services/jira/types.ts`
- Test: `services/fastify/test/services/jira.service.test.ts`

**Step 1: 保持返回结构不变，先迁移内部实现**

抽离：
- `buildStepSummary`
- `buildDevReplyFailure`
- `executeDevReplyWorkflow`
- `devReply`
- `devReplyBatch`

**Step 2: 通过依赖注入 use-case 所需能力**

向 use-case 注入：
- `fastify.log`
- `jiraRestService`
- `sessionService`

要求：
- 不直接依赖 route 层
- 不改返回类型

**Step 3: `JiraService` 改为 facade**

- `devReply()` 只转调 use-case
- `devReplyBatch()` 只转调 use-case

**Step 4: 跑新增测试**

Run: `pnpm exec node --test --loader ts-node/esm services/fastify/test/services/jira.service.test.ts`
Expected: PASS

### Task 3: 回归验证与收口

**Files:**
- Modify: `services/fastify/src/services/jira/jira.service.ts`
- Modify: `services/fastify/src/services/jira/use-cases/dev-reply.use-case.ts`
- Modify: `services/fastify/src/services/jira/jira-session.service.ts`

**Step 1: 全量编译检查**

Run: `pnpm --dir services/fastify run build`
Expected: PASS

**Step 2: 检查 facade 是否仍向后兼容**

确认：
- 路由无需改调用方式
- `createTicketWithLabels` 中 `devReply` 调用仍可用
- 现有测试全部通过

**Step 3: 收敛说明**

记录本轮完成内容：
- 已迁出能力
- 暂未迁出的能力
- 下一刀建议拆分点

---

## Current Completion Snapshot

### 已完成拆分

- `services/fastify/src/services/jira/jira-session.service.ts`
  - 负责凭证解析、登录、session 获取与缓存

- `services/fastify/src/services/jira/use-cases/dev-reply.use-case.ts`
  - 负责 `devReply`
  - 负责 `devReplyBatch`
  - 负责开发回复步骤编排、失败汇总与批量聚合

- `services/fastify/src/services/jira/use-cases/create-ticket.use-case.ts`
  - 负责 `createTicket`
  - 包含智能匹配、`createMeta`、`genCustomInfo`、`createIssue`、补充更新

- `services/fastify/src/services/jira/use-cases/create-ticket-with-labels.use-case.ts`
  - 负责 `createTicketWithLabels`
  - 包含 labels 更新、`autoDevReply` 编排与结果拼装

- `services/fastify/src/services/jira/use-cases/update-ticket.use-case.ts`
  - 负责 `updateTicket`
  - 包含更新请求、参数校验与错误处理

### 当前 facade 边界

`services/fastify/src/services/jira/jira.service.ts` 当前保留为 facade，对外公开方法名与调用方式不变，以下能力已主要改为转调 use-case / session service：

- `login`
- `getSession`
- `devReply`
- `devReplyBatch`
- `createTicket`
- `createTicketWithLabels`
- `updateTicket`

### 已完成验证

已执行并通过：

- `pnpm exec tsc --noEmit -p tsconfig.json`
- `pnpm run build`
- `pnpm exec node --test --loader ts-node/esm test/services/jira.service.test.ts test/services/create-ticket.use-case.test.ts test/services/create-ticket-with-labels.use-case.test.ts test/services/update-ticket.use-case.test.ts`

当前测试结果：

- 5 passed
- 0 failed

### 当前结论

- 当前 `JiraService` 已经从“大而全业务类”演进为“facade + session service + use-cases”
- 对现有路由调用方式保持兼容
- 当前复杂度与可维护性已明显改善
- 现阶段可以暂停继续拆分，待项目继续膨胀后再按需推进

---

## Deferred Roadmap

以下为后续可选优化路线，当前先不实现。

### Option A: 继续拆查询类能力

候选能力：

- `getCreateMeta`
- `getProjects`
- `getIssueTypes`
- `getProjectVersions`
- `getIssueLinkTypes`

适合触发时机：

- 查询类方法继续增多
- `JiraService` 再次明显变长
- 查询逻辑开始出现复用或聚合编排

### Option B: 收敛 application 层组织方式

候选方向：

- 引入更统一的 `jira-commands` / `jira-queries` 目录结构
- 对 use-case 的依赖注入方式做统一收敛
- 视需要引入更轻量的 application service 分组

适合触发时机：

- use-case 数量继续增加
- 构造注入开始重复
- facade 初始化代码明显膨胀

### Option C: 补充更细粒度测试覆盖

候选方向：

- 补 facade 层兼容测试
- 补异常路径测试
- 补批量/并发边界测试

适合触发时机：

- 新功能继续叠加到 Jira 领域
- 线上回归风险上升
- 需要为后续重构提供更强保护网

### Recommended Next Step When Needed

如果后面继续推进，建议优先顺序：

1. 拆查询类能力
2. 收敛 commands / queries 组织方式
3. 再补更细粒度测试
