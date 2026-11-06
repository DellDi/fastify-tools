# Jira API 完整端点参考

Base URL: `https://delldiagi.top/fastify`（本地 `http://localhost:3100`，Docker `http://localhost:4000`）

所有 POST 接口均为 `Content-Type: application/json`。`jiraUser`/`jiraPassword` 在所有接口中均可选，不传则使用服务端公共账号，下表不再重复列出。

## 目录

1. [POST /jira/login — 登录](#post-jiralogin)
2. [POST /jira/search — JQL 搜索](#post-jirasearch)
3. [GET /jira/{issueIdOrKey} — 工单详情（当前 500）](#get-jiraissueidorkey)
4. [POST /jira/create-ticket — 智能建单](#post-jiracreate-ticket)
5. [POST /jira/create-meta — 建单字段元数据（当前 500）](#post-jiracreate-meta)
6. [POST /jira/upload-attachment — 上传附件](#post-jiraupload-attachment)
7. [POST /jira/update-fields — 业务字段更新（推荐）](#post-jiraupdate-fields)
8. [POST /jira/update — 原生 fields 透传更新](#post-jiraupdate)
9. [POST /jira/dev-reply — 批量开发回复工作流](#post-jiradev-reply)
10. [GET /jira/link/types — 查询关联类型](#get-jiralinktypes)
11. [POST /jira/link — 批量建立工单关联](#post-jiralink)
12. [GET /jira/field-rules — 查询字段经验规则](#get-jirafield-rules)
13. [GET /jira/field-rules/combos — 规则的项目+类型组合](#get-jirafield-rulescombos)
14. [PATCH /jira/field-rules/{id} — 校准规则](#patch-jirafield-rulesid)
15. [DELETE /jira/field-rules/{id} — 删除规则](#delete-jirafield-rulesid)

---

## POST /jira/login

Jira 登录，换取 `cookies`（search 必填）和 `atlToken`。

**Request**: `{}`（空 body 即用服务端公共账号）或 `{ "jiraUser": "...", "jiraPassword": "..." }`

**Response 200**:
```json
{ "cookies": "JSESSIONID=...;atlassian.xsrf.token=...", "atlToken": "..." }
```

## POST /jira/search

JQL 分页搜索。响应里的每个 issue 额外带一个 `fields.customFieldCode`（服务端钩子从 `customfield_10000` 解析出的客户编码）。

| 字段 | 类型 | 说明 |
|---|---|---|
| `jql` | string | **必填**。Jira 查询语句，如 `project = NLC AND resolution = Unresolved ORDER BY created DESC` |
| `jiraCookies` | string | 可选。`/jira/login` 返回的 cookies 原样传入（调用方会话，失效需自行重登） |
| `jiraUser` / `jiraPassword` | string | 可选。不传 `jiraCookies` 时生效：以该账号身份搜索；都不传则用服务端公共账号（会话托管，401/403 自动重登重试） |
| `startAt` | number | 起始偏移，默认 0 |
| `maxResults` | number | 每页数量，默认 20 |

三种身份方式：`jiraCookies`（调用方 cookie）> `jiraUser`+`jiraPassword`（指定账号）> 都不传（服务端公共账号）。

**Response 200**: `{ total, issues: [{ id, key, fields: { summary, status{name}, assignee{displayName}, creator{displayName}, fixVersions[{name}], labels[], customfield_10000?, customFieldCode?, created } }] }`

## GET /jira/{issueIdOrKey}

按 key/id 查工单详情。**当前部署版返回 500**，用 `POST /jira/search` + `issuekey = "X"` 替代。

## POST /jira/create-ticket

智能建单。服务端流程：拉建单元数据 → 应用已学习字段规则 → LLM 补齐剩余必填字段 → 创建 → （可选）回写学习结果。缺必填字段时会根据 Jira 报错自动补值重试一次。

| 字段 | 类型 | 说明 |
|---|---|---|
| `title` | string | **必填**。工单标题（Jira `summary`） |
| `description` | string | **必填**。工单描述 |
| `assignee` | string | 经办人登录名；不传默认用登录账号自己 |
| `customAutoFields` | object | 显式指定 `customfield_xxxxx: value`，优先于自动填充 |

**Response 200**: `{ issueKey, issueId, issueUrl, updateMsg, matchInfo? }`；**400**: `{ error, details? }`（`details` 是字段级错误 map，如 `{"customfield_10601": "功能现状是必需的。"}`）

## POST /jira/create-meta

查某项目+问题类型下建单表单的字段元数据（前端动态表单用）。**当前部署版返回 500**。

| 字段 | 类型 | 说明 |
|---|---|---|
| `projectKey` | string | 项目 Key，如 `NLC` |
| `issueTypeId` | string | 问题类型 ID，如 `10604` |
| `maxResults` / `startAt` | number | 分页，默认 25 / 0 |

**Response 200**: `{ maxResults, startAt, total, isLast, values: [{ fieldId, name, required, allowedValues[], schema, autoCompleteUrl, hasDefaultValue, operations[] }] }`

## POST /jira/upload-attachment

上传附件，三种来源模式。

**模式 A — multipart**: `Content-Type: multipart/form-data`，字段 `file`（文件）、`issueIdOrKey`、`jiraUser`/`jiraPassword`（可选）。最多 1 个文件。

**模式 B/C — JSON**:

| 字段 | 说明 |
|---|---|
| `issueIdOrKey` | **必填** |
| `sourceType` | **必填**。`local_path` 或 `remote_url`（JSON 模式不用 `multipart`） |
| `filePath` | `sourceType=local_path` 时必填，**服务端**可读的本地绝对路径 |
| `fileUrl` | `sourceType=remote_url` 时必填，服务端先去下载再传 Jira |

**Response 200**: `{ issueIdOrKey, sourceType, fileName, mimeType, size, attachment: { id, filename, content, thumbnail }, message }`

## POST /jira/update-fields

业务字段更新的推荐入口。所有快捷字段最终合并为 Jira `fields` 后一次更新。

| 字段 | 类型 | 说明 |
|---|---|---|
| `issueIdOrKey` | string | **必填** |
| `labels` | string[] | 标签，**整体覆盖**非追加 |
| `fixVersionIds` | string[] | 修复版本 ID 列表，自动转 `fixVersions: [{id}]` |
| `devCompleteDate` | string | `YYYY-MM-DD`，写 `customfield_10022` |
| `summary` / `description` | string | 直接覆盖 |
| `assignee` | string | 登录名，转 `assignee: {name}`；**传空串不会清空经办人** |
| `fields` | object | 原生 fields 对象，如 `{priority:{id:"3"}}` |
| `extraFields` | object | 任意自定义字段，**最后合并，优先级最高** |

合并优先级：`extraFields` > 顶层快捷字段（labels/fixVersionIds/...）> `fields`。

**Response 200**: `{ message }`

## POST /jira/update

底层透传：`{ issueIdOrKey, fields: {...原生 Jira fields...} }`。仅当 update-fields 不够用时用。

## POST /jira/dev-reply

批量"开发回复"编排。`issueKeys` 支持数组或逗号分隔字符串。

| 字段 | 类型 | 说明 |
|---|---|---|
| `issueKeys` | string[] \| string | **必填**。如 `["NLC-3050","NLC-3049"]` 或 `"NLC-3050,NLC-3049"` |
| `projectKey` | string | 用于查版本。**不传时按每个工单号前缀自动推导项目**（`ARM-75059` → `ARM`），跨项目可混投 |
| `assignee` | string | 用于查已占用的预计开发完成日期。**默认 `zhouxia`** |
| `reconcile` | boolean | **默认 `true` 对账模式**：先读现状逐项对比、只改漂移项（见下）；`false` 回退到全量盲写 |
| `transitionId` | string | 工作流转换 ID，默认 `'11'`；找不到时按名称含"开发回复/dev reply/development"兜底匹配 |
| `fixVersionId` | string | 显式指定修复版本，跳过自动选版 |
| `devCompleteDate` | string | `YYYY-MM-DD`，跳过自动分配 |
| `comment` | string | 评论内容，显式传入时始终发表；不传时是否自动评论由 `withComment` 控制 |
| `withComment` | boolean | **默认 `false` 不评论**。`true` 且有实际改动时自动生成客观说明评论（随转换提交或独立补评）；显式 `comment` 不受此开关影响 |
| `additionalFields` | object | 额外更新字段 `{fieldId: value}` |
| `extraHolidays` | string[] | 额外注入的节假日/封网日期：单日 `YYYY-MM-DD` 或区间 `YYYY-MM-DD~YYYY-MM-DD`。日期分配与语义巡检都避开，且注入 LLM 评审上下文 |

**reconcile 语义**（默认开启，幂等可重复巡检）：先读工单现状（`queryCurrentState` 步骤，取 fixVersions/customfield_10022/status），再以**经办人工作负载**为上下文逐项决策——`queryUsedDates` 步骤一次 JQL 拉取该经办人全部未完成单的已承诺日期 + 版本分布，批次内共享：

- **版本（五级优先级）**：① 现挂版本仍在未发布池且窗口有余量 → 保留（历史参照最强，**绝不跨前缀换版**：ARM 单不会被换成同日 HD 版）；② 现挂版本失效/满员 → 同前缀车次；③ → 经办人工作负载主流版本（汇入）；④ → LLM 在**容量校验过的可行候选**内建议（候选集外一律忽略）；⑤ → 确定性兜底（发车日最近有余量车次）。选定后现状≠`[目标]`单选才整体替换（不追加；含目标的多选收敛为单选）
- **日期**：现状仍合法（≥今天、<版本日、工作日、非节假日、未被他人占用）→ 保留；否则在选中版本窗口分配最近可工作日。**一日一单**：经办人其他单的承诺日期 + 批内已分配日期都避让；窗口可工作日 = 今天~发车日前一天扣周末/节假日/封网期，占满即换版或明确失败（不写假日期）。本单旧日期自动从占用集排除，重复跑不漂移
- **状态**：已是"开发已回复"→ 跳过转换记为成功；有字段改动时走独立评论接口补说明（不依赖转换）
- **计划开始时间**：`customfield_10100` 若为 `T00:00:00` 假时间 → 改写为同日期随机工作时段（09:00–17:59）
- **动态时间字段语义巡检**（`semanticDateReview` 步骤，**仅开发视角**）：`/rest/api/2/field` 识别所有 date/datetime 自定义字段；名称含测试/上线/发布/验收/交付的字段归其他角色管，**直接排除**。**违规预扫描先行**：只对存在确定性违规的字段（已过期/周末节假日/开始晚于完成/零点占位时间）才调 LLM——全部合规直接跳过，LLM 对无违规字段的建议一律忽略 → LLM 建议再经确定性校验（格式合法、不早于今天、非周末/节假日、"开始"类字段不晚于预计开发完成、新值≠现值）才写入。**LLM 失败自动兜底**：开始类字段晚于预计开发完成一律回退到锚点日
- **评论**：`withComment: true` 或显式 `comment` 时才发；自动文案只在有实际改动时产生（客观事实陈述），无任何改动 → `unchanged`，不发评论
- **推理链**：每单返回 `reasoning[]`——每个决策点的逐条推理记录（保留/换版/日期分配/语义评审的理由与容量数字），末行为 `结论：...` 总结。同时写入审计 `details.reasoning`

**Response 200**: `{ total, successCount, failureCount, successfulIssueKeys[], failedIssueKeys[], unchangedIssueKeys[], results: [{ success, status(success|partial_success|failure|unchanged), issueKey, fixVersionName?, devCompleteDate?, transitionName?, message, reasoning?[], steps?[], successfulSteps?[], failedSteps?[] }] }`

`partial_success` = 字段更新成功但工作流转换失败；`unchanged` = reconcile 后无需改动；`steps` 含 `queryCurrentState / queryUsedDates / selectFixVersion / allocateDevCompleteDate / updateFields / getTransitions / doTransition / normalizeStartTime / semanticDateReview / addComment` 逐步明细（`selectFixVersion`/`allocateDevCompleteDate`/`semanticDateReview` 的 `data.reasoning` 带分级决策记录）。

**巡检审计**：每次调用逐单写入 `jira_reconcile_logs` 表（批次 ID、工单、状态、改动明细、`details.reasoning` 推理链、耗时），`GET /jira/reconcile-logs` 查询（query：`batchId/issueKey/status/assignee/from/to/take/skip`）。写库失败不阻塞巡检。

## GET /jira/reconcile-logs

查询巡检审计日志。Query：`batchId`/`issueKey`/`status`(success|partial_success|failure|unchanged)/`assignee`/`from`/`to`/`take`(≤200，默认50)/`skip`。

**Response 200**: `{ total, values: [{ id, batchId, issueKey, projectKey, assignee, status, message, details, durationMs, createdAt }] }`

## GET /jira/link/types

查询 Jira 实例支持的关联类型（query 可带 `jiraUser`/`jiraPassword`）。

**Response 200**: `[{ id, name, inward, outward }]`，实测如 `Defect`、`Git Code Review`、`Tests`、`相关问题`、`重复问题`。

## POST /jira/link

批量把多个来源工单关联到一个目标工单。

| 字段 | 说明 |
|---|---|
| `sourceIssueKeys` | **必填**。逗号分隔来源单，如 `NDE-4143,NDE-4144` |
| `targetIssueKey` | **必填**。目标单 |
| `linkTypeName` | **建议必填**。不传自动选第一个可用类型（实测是 `Defect`，语义通常不对） |

**Response 200**: `{ results: [{ issueKey, success, message }] }`

## GET /jira/field-rules

分页查字段经验规则（create-ticket 自动填充的知识库）。

Query: `projectKey`, `issueTypeId`, `strategy`(`fixed|llm|computed|avoid`), `stale`(`true|false`), `keyword`(fieldId/fieldName 模糊), `take`(默认100,max500), `skip`(默认0)

**Response 200**: `{ total, values: [{ id, projectKey, issueTypeId, fieldId, fieldName, kind, strategy, learnedValue, valueStreak, required, stale, lastError, successCount, failCount, lastSeenAt, createdAt, updatedAt }] }`

策略含义：`fixed` 复用已学习值 / `llm` 每次 LLM 推断 / `computed` 确定性计算 / `avoid` 建单时不下发该字段。

## GET /jira/field-rules/combos

已学规则的 `projectKey + issueTypeId` 组合及各自规则数：`{ values: [{ projectKey, issueTypeId, count }] }`

## PATCH /jira/field-rules/{id}

人工校准规则。body 可选字段：`strategy`、`learnedValue`(传 `null` 清空重学)、`valueStreak`、`required`、`stale`、`fieldName`。返回更新后的规则对象。

## DELETE /jira/field-rules/{id}

删除规则（下次建单从元数据重新学习）。返回 `{ ok: true }`。
