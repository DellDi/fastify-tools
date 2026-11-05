---
name: jira-api
description: 调用部署在 https://delldiagi.top/fastify 的 Jira 工单 HTTP API（fastify-tools 后端）。任何涉及 Jira 工单的任务都应该用它——JQL 搜索工单、查看工单详情和字段、创建工单（服务端自动补齐必填自定义字段）、更新标签/修复版本/经办人/标题/描述、上传附件、批量"开发回复"工作流、工单关联、查询建单字段元数据和字段经验规则。只要任务提到 Jira、工单、单子、issue key（如 NLC-3050、NDE-4143、V10-28154）、建单/提单、开发回复、挂附件、关联工单，就应该使用本技能，即使用户没有点名这个 API。不要直连 Jira REST API，一律走这里的封装接口。
---

# fastify-tools Jira API

一组部署在 `https://delldiagi.top/fastify` 的 HTTP 接口，封装了公司 Jira 的常用工单操作。本技能教你在正确的场景选对正确的接口、用对参数。

## 基本信息

- **Base URL**: `https://delldiagi.top/fastify`（本地开发 `http://localhost:3100`、Docker `http://localhost:4000`）
- **鉴权**: 无 Bearer Token。业务接口的凭证是请求体（或 query）里**可选**的 `jiraUser` / `jiraPassword`——不传则使用服务端环境变量配置的公司公共账号。**除非用户明确给了账号，否则不要传这两个字段**。
- **数据格式**: 除附件上传的 multipart 模式外，一律 `Content-Type: application/json` 的 POST/GET。
- **错误格式**: `{ "error": "错误信息", "statusCode": xxx }`，400 = 参数问题，500/502 = Jira 侧或服务端异常。
- Scalar API 文档在线可查：`https://delldiagi.top/fastify/docs`

## 选哪个接口（任务 → 端点）

先按这张表定接口，再看下面的参数速查。字段级完整参考在 `references/endpoints.md`。

| 任务场景 | 端点 | 备注 |
|---|---|---|
| 按条件查工单（项目/经办人/状态/标签/任意 JQL） | `POST /jira/search` | 需要先 `POST /jira/login` 拿 `cookies`；或直接跑 `scripts/search.py` 一步完成 |
| 看单个工单的字段、状态、经办人 | `POST /jira/search` + `issuekey = "XXX-nnn"` | ⚠️ `GET /jira/{key}` 当前部署版返回 500，用 search 绕开 |
| 创建工单（提单、建单、开单） | `POST /jira/create-ticket` | 智能建单：只传 `title`/`description`/`assignee` 即可，必填自定义字段由服务端的字段经验规则 + LLM 自动补齐 |
| 查建单表单要填哪些字段 | `POST /jira/create-meta` | ⚠️ 当前部署版 500；替代方案：查 `GET /jira/field-rules` 已学规则，或直接调 `create-ticket` 让它自己处理 |
| 改标签 / 修复版本 / 经办人 / 标题 / 描述 / 预计开发完成时间 | `POST /jira/update-fields` | 业务字段更新的推荐入口，常用字段有快捷写法 |
| 需要透传任意 Jira 原生 fields | `POST /jira/update` | 底层接口，仅当 update-fields 的快捷字段+`extraFields` 都不够用时才用 |
| 给工单传附件 | `POST /jira/upload-attachment` | 三种来源：`multipart` 直接传文件 / `local_path` 服务器本地文件 / `remote_url` 远程 URL |
| 批量"开发回复"/定时巡检（对账式：选修复版本 + 校订完成日期 + 工作流转换 + 变动才评论） | `POST /jira/dev-reply` | 默认 reconcile 模式：逐项检查现状只改漂移项，幂等可重复跑；`assignee` 默认 zhouxia |
| 建立工单关联（相关/重复/Defect 等） | `GET /jira/link/types` → `POST /jira/link` | 先查可用 `linkTypeName` 再建关联 |
| 查字段经验规则（审计"建单自动填充"学了什么） | `GET /jira/field-rules`、`GET /jira/field-rules/combos` | 只读查询 |
| 校准/删除某条字段规则 | `PATCH /jira/field-rules/{id}`、`DELETE /jira/field-rules/{id}` | 运维纠偏用，改动会影响后续建单的自动填充，动手前先跟用户确认 |

## 常用流程

### 1. 搜索工单（两步）

`/jira/search` 的 `jiraCookies` 是必填项，先登录拿 cookie：

```bash
# 第一步：登录（body 传 {} 即用服务端公共账号）
curl -s -X POST https://delldiagi.top/fastify/jira/login \
  -H 'Content-Type: application/json' -d '{}'
# => { "cookies": "JSESSIONID=...; atlassian.xsrf.token=...", "atlToken": "..." }

# 第二步：把 cookies 原样带进 search
curl -s -X POST https://delldiagi.top/fastify/jira/search \
  -H 'Content-Type: application/json' \
  -d '{"jql": "project = NLC AND resolution = Unresolved", "jiraCookies": "<上一步的 cookies>", "startAt": 0, "maxResults": 20}'
```

**更省事**：技能目录下 `scripts/search.py` 把这两步合并了，自动登录、自动带 cookie、直接输出 Jira 返回的 JSON：

```bash
python3 <skill-dir>/scripts/search.py "project = NLC AND resolution = Unresolved" 0 20
```

JQL 要点：`project` 用项目 Key（NLC、NDE、V10…）；`assignee` 用登录用户名不是显示名；状态用 `status = "开发已回复"` 或 `resolution = Unresolved`；多条件用 `AND`/`OR` 组合；`ORDER BY created DESC` 排序。

### 2. 创建工单

```bash
curl -s -X POST https://delldiagi.top/fastify/jira/create-ticket \
  -H 'Content-Type: application/json' \
  -d '{"title": "【XX系统】XX功能异常", "description": "复现步骤…期望…实际…", "assignee": "zhangsan"}'
```

不需要自己研究 Jira 的一堆必填自定义字段——服务端会先查建单元数据，按已学习的字段规则（fixed/computed）自动填充，剩下的必填项由 LLM 根据标题和描述推断，填不齐还会根据 Jira 的报错自动重试一次。返回 `{ issueKey, issueId, issueUrl }`。

`customAutoFields`（可选）允许你显式覆盖某些 `customfield_xxxxx`，传了的值优先于自动填充。

### 3. 批量开发回复 / 定时巡检（reconcile 对账模式，默认开启）

```bash
curl -s -X POST https://delldiagi.top/fastify/jira/dev-reply \
  -H 'Content-Type: application/json' \
  -d '{"issueKeys": ["NLC-3050", "NLC-3049"], "projectKey": "NLC"}'
```

`assignee` 不传默认 `zhouxia`；`projectKey` 不传时**按每个工单号前缀自动推导项目**（`ARM-75059` → `ARM`），跨项目工单可混投一次调用。服务端对每个工单逐项检查现状、只改写漂移项：

- **现状读取**（`queryCurrentState`）：先取 fixVersions / customfield_10022 / status
- **fixVersions**：现状恰好是 `[目标版本]`（单选）→ 不动；否则整体替换为单选目标版本（不是追加）。不传 `fixVersionId` 时自动选 unreleased 中最合适的版本
- **devCompleteDate**：现状日期仍合法（≥今天、<版本日、工作日、非节假日）→ 保留；否则重新分配。本单旧日期不算"被占用"，所以**重复跑不会漂移**——天然幂等
- **状态转换**：已是"开发已回复"→ 跳过转换记为成功，不算失败
- **评论**：只有发生实际改动才自动补评论（"排期巡检自动同步：修复版本更新为…预计完成时间由X调整为Y…"）；已回复单的字段调整走独立评论接口，新回复单的评论随转换提交。`comment` 显式传入时覆盖自动文案
- **结果分类**：`success` / `partial_success`（字段改了但转换失败）/ `failure` / `unchanged`（什么都没动）；批量响应里 `unchangedIssueKeys` 单独列出未改动单

**定时巡检配方**（cron / 定时任务直接用）：

```bash
# 1. 捞某人所有未解决单（用 scripts/search.py 一步完成）
python3 scripts/search.py 'assignee = "zhouxia" AND resolution = Unresolved' 0 100

# 2. 全部 issueKeys 原样丢给 dev-reply（不用传 projectKey，跨项目自动按单号前缀分流）
curl -s -X POST https://delldiagi.top/fastify/jira/dev-reply \
  -H 'Content-Type: application/json' \
  -d '{"issueKeys": ["NLC-3050","ARM-75059","NDE-4569"]}'
# 已回复单自动跳过转换；超期日期自动重排；版本自动跟随各自项目最新 unreleased
# unchangedIssueKeys = 本次巡检无需改动的单
```

多个经办人要按人分批（`assignee` 决定占用日期的查询范围）。传 `reconcile: false` 可回退到旧的全量盲写行为。

## 参数速查（高频字段）

| 端点 | 必填 | 常用可选 |
|---|---|---|
| `POST /jira/login` | 无（body `{}`） | `jiraUser`, `jiraPassword` |
| `POST /jira/search` | `jql`, `jiraCookies` | `startAt`(0), `maxResults`(20) |
| `POST /jira/create-ticket` | `title`, `description` | `assignee`, `customAutoFields` |
| `POST /jira/update-fields` | `issueIdOrKey` | `labels`, `fixVersionIds`, `devCompleteDate`, `summary`, `description`, `assignee`, `fields`, `extraFields` |
| `POST /jira/update` | `issueIdOrKey`, `fields` | —— |
| `POST /jira/upload-attachment` | `issueIdOrKey`, `sourceType` | `filePath`/`fileUrl`（按 sourceType）或 multipart 文件 |
| `POST /jira/dev-reply` | `issueKeys`, `projectKey`, `assignee` | `transitionId`, `fixVersionId`, `devCompleteDate`, `comment`, `additionalFields` |
| `GET /jira/link/types` | 无 | `jiraUser`/`jiraPassword`（query） |
| `POST /jira/link` | `sourceIssueKeys`(逗号分隔), `targetIssueKey` | `linkTypeName`（强烈建议显式传，见坑位） |
| `GET /jira/field-rules` | 无 | `projectKey`, `issueTypeId`, `strategy`, `stale`, `keyword`, `take`, `skip` |

## 坑位与注意事项

1. **`GET /jira/{issueIdOrKey}` 当前部署版返回 500。** 查单要用 `POST /jira/search`，JQL 写 `issuekey = "NLC-3050"`。
2. **`POST /jira/create-meta` 当前部署版返回 500。** 想知道建单字段，用 `GET /jira/field-rules?projectKey=X&issueTypeId=Y` 看已学规则；或干脆直接 `create-ticket` 让服务端自己处理。
3. **`POST /jira/link` 不传 `linkTypeName` 会自动选"第一个"可用类型**（实测第一个是 `Defect`，通常不是你要的"相关问题"）。先调 `GET /jira/link/types` 拿列表——常见的有 `相关问题`(相关)、`重复问题`(重复)、`Defect`、`Tests`、`Git Code Review`——再显式传 `linkTypeName`。
4. **`assignee` 是登录用户名**（如 `zhangsan`），不是显示名（如"张三"）。search 结果里 `fields.assignee.displayName` 是显示名，拿去做更新前要有登录名；不确定时问用户。
5. **`devCompleteDate` 格式必须 `YYYY-MM-DD`**，落到 Jira 自定义字段 `customfield_10022`。`update-fields` 和 `dev-reply` 都是这个字段。
6. **`update-fields` 的 `labels` 是整体覆盖**，不是追加；想保留旧标签要先把旧值查出来一起传。`extraFields` 在最终合并阶段覆盖同名字段，优先级最高。
7. **cookies 会过期**（JSESSIONID）。search 返回 401/未授权时重新 `POST /jira/login` 再试。
8. 写操作（create/update/dev-reply/link/upload）会真实改动 Jira 数据，执行前向用户确认目标单号和内容。

字段级的完整请求/响应参考：`references/endpoints.md`。
