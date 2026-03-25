# Dify Customer Token Match Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 Dify 创建工单时的 `customerName` 支持“主词命中、弱词加减分”的分词匹配，避免 `"中油物业"` 这类简称无法命中 `"714-中油阳光"` 并触发后续 422。

**Architecture:** 新增一个共享的客户名称匹配器，对输入值和候选值做归一化、分词和加权打分，然后在 `/dify/customer` 与 `JiraRestService.getCustomInfo()` 两条链路复用。保持外部请求结构不变，内部从“简单 includes”升级为“稳定的最高分选择”，即使低分也返回最高分候选来保证流程不中断。

**Tech Stack:** TypeScript, Fastify, Cheerio, Node.js test runner, ts-node/esm, pnpm

---

## File Structure

- Create: `services/fastify/src/services/jira/customer-name.matcher.ts`
  - 单一职责：归一化候选文本、拆词、计算分数、返回最高分候选。
- Create: `services/fastify/test/services/customer-name.matcher.test.ts`
  - 单一职责：覆盖主词优先、弱词微调、编号前缀、并列打分等匹配行为。
- Create: `services/fastify/test/routes/dify-customer.route.test.ts`
  - 单一职责：验证 `/dify/customer` 在真实 HTML 片段下能选出 `"714-中油阳光"` 对应 ID。
- Create: `services/fastify/test/services/jira-rest.service.test.ts`
  - 单一职责：验证 `getCustomInfo()` 对 Jira `allowedValues` 的客户字段选择逻辑。
- Modify: `services/fastify/src/routes/dify/customer/index.ts`
  - 接入共享 matcher，替换当前三处 `includes`。
- Modify: `services/fastify/src/services/jira/jira-rest.service.ts`
  - 接入共享 matcher，统一 Jira 创建后客户字段更新逻辑。
- Modify: `services/fastify/src/services/jira/types.ts`
  - 仅在需要时补充 matcher 输入/输出类型；如果会让类型文件继续膨胀，则优先把类型与 matcher 放在同文件导出。

## Constraints And Decisions

- 外部接口 `customerName` 入参保持不变。
- 命中策略固定为：主词优先，弱词只做加减分。
- 当所有候选分数都低时，仍返回最高分项，不做“未命中”中断。
- 当前不引入 LLM，不维护独立别名表；实现时要预留后续补别名映射点。
- 只修改与客户匹配直接相关的文件，不顺手重构其他 Jira 逻辑。

### Task 1: 新增共享客户名称匹配器

**Files:**
- Create: `services/fastify/src/services/jira/customer-name.matcher.ts`
- Create: `services/fastify/test/services/customer-name.matcher.test.ts`
- Modify: `services/fastify/src/services/jira/types.ts`

- [ ] **Step 1: 写失败测试，锁定分词评分规则**

```ts
test('matchCustomerOption prefers primary token over weak hint token', async () => {
  const candidates = [
    { id: '17714', label: '714-中油阳光' },
    { id: '18888', label: '715-阳光物业' },
  ]

  const result = matchCustomerOption('中油物业', candidates)

  assert.equal(result.bestMatch?.id, '17714')
  assert.equal(result.bestMatch?.label, '714-中油阳光')
  assert.ok(result.score > 0)
})
```

- [ ] **Step 2: 运行单测，确认当前实现缺失而失败**

Run: `pnpm --dir services/fastify run build && FASTIFY_AUTOLOAD_TYPESCRIPT=1 node --test --loader ts-node/esm services/fastify/test/services/customer-name.matcher.test.ts`
Expected: FAIL with `Cannot find module` or `matchCustomerOption is not a function`

- [ ] **Step 3: 只实现最小 matcher**

```ts
const WEAK_TOKENS = ['物业', '公司', '集团', '项目', '服务中心']

export function matchCustomerOption(input: string, candidates: CustomerCandidate[]) {
  const normalizedInput = normalizeCustomerText(input)
  const tokens = splitCustomerTokens(normalizedInput)
  const ranked = candidates.map((candidate) => scoreCandidate(tokens, candidate))
  ranked.sort(compareCustomerCandidateScore)
  return ranked[0]
}
```

要求：
- 归一化时去掉空格、常见分隔符、编号前缀噪音。
- 分词时保留主词，弱词不删除，只降低权重。
- 评分至少包含：完整包含、主词命中、弱词命中、候选长度惩罚。
- 并列时保证排序稳定，不依赖运行时偶然顺序。

- [ ] **Step 4: 重新运行 matcher 单测直到通过**

Run: `pnpm --dir services/fastify run build && FASTIFY_AUTOLOAD_TYPESCRIPT=1 node --test --loader ts-node/esm services/fastify/test/services/customer-name.matcher.test.ts`
Expected: PASS with coverage for `"中油物业" -> "714-中油阳光"` plus at least 2 more scoring cases

- [ ] **Step 5: 提交 matcher 基础能力**

```bash
git add services/fastify/src/services/jira/customer-name.matcher.ts services/fastify/src/services/jira/types.ts services/fastify/test/services/customer-name.matcher.test.ts
git commit -m "feat: add customer name token matcher"
```

### Task 2: 在 `/dify/customer` 路由接入 matcher

**Files:**
- Modify: `services/fastify/src/routes/dify/customer/index.ts`
- Create: `services/fastify/test/routes/dify-customer.route.test.ts`

- [ ] **Step 1: 先写失败的路由测试**

```ts
test('/dify/customer selects highest-score customer ids for tokenized input', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/dify/customer',
    payload: {
      customerName: '中油物业',
      htmlStr: `<select><option value="14169">714-中油阳光</option></select>`,
      htmlStrAll: `
        <select class="cascadingselect-parent">
          <option value="17714">714-中油阳光</option>
        </select>
        <select class="cascadingselect-child">
          <option value="21057">默认子项</option>
        </select>
      `,
    },
  })

  assert.equal(res.statusCode, 200)
  assert.deepEqual(JSON.parse(res.payload), {
    isSaaS: false,
    customerNameId: '14169',
    customerInfoId: '17714',
    customerInfoIdAlias: '21057',
  })
})
```

- [ ] **Step 2: 运行路由测试，确认现状不能命中该场景**

Run: `pnpm --dir services/fastify run build && FASTIFY_AUTOLOAD_TYPESCRIPT=1 node --test --loader ts-node/esm services/fastify/test/routes/dify-customer.route.test.ts`
Expected: FAIL because route returns fallback IDs or wrong match

- [ ] **Step 3: 在路由里替换三处 `includes` 为共享 matcher**

```ts
const elementName = matchOptionElement(customerName, optionsList.toArray(), $1)
const elementInfo = matchOptionElement(customerName, optionsP.toArray(), $2)
const elementInfoAlias = matchOptionElement(customerName, optionsC.toArray(), $2)
```

要求：
- 保持返回结构不变。
- `customerName` 为空时沿用现有 fallback，而不是抛新错误。
- `isSaaS` 仍沿用匹配到的客户编号计算。
- 需要为日志补充输入词、命中标签、分数摘要，便于排查误配。

- [ ] **Step 4: 重新运行路由测试并补一个回归样例**

Run: `pnpm --dir services/fastify run build && FASTIFY_AUTOLOAD_TYPESCRIPT=1 node --test --loader ts-node/esm services/fastify/test/routes/dify-customer.route.test.ts`
Expected: PASS for `"中油物业"` and one existing `includes` 场景

- [ ] **Step 5: 提交 Dify 路由接入**

```bash
git add services/fastify/src/routes/dify/customer/index.ts services/fastify/test/routes/dify-customer.route.test.ts
git commit -m "feat: use customer matcher in dify customer route"
```

### Task 3: 在 Jira 客户字段更新链路接入 matcher

**Files:**
- Modify: `services/fastify/src/services/jira/jira-rest.service.ts`
- Create: `services/fastify/test/services/jira-rest.service.test.ts`

- [ ] **Step 1: 先写失败的 `getCustomInfo()` 测试**

```ts
test('getCustomInfo selects highest-score allowed value for tokenized customer name', async () => {
  const service = new JiraRestService(createMockFastify())

  const result = service.getCustomInfo(
    [
      {
        fieldId: 'customfield_12600',
        name: '客户信息',
        allowedValues: [
          { id: '17714', value: '714-中油阳光', children: [{ id: '21057', value: '默认子项' }] },
          { id: '17715', value: '715-阳光物业' },
        ],
      },
    ] as any,
    '中油物业',
  )

  assert.deepEqual(result, {
    customfield_12600: {
      id: '17714',
      child: { id: '21057' },
    },
  })
})
```

- [ ] **Step 2: 运行服务测试，确认当前 `includes` 行为失败**

Run: `pnpm --dir services/fastify run build && FASTIFY_AUTOLOAD_TYPESCRIPT=1 node --test --loader ts-node/esm services/fastify/test/services/jira-rest.service.test.ts`
Expected: FAIL because `getCustomInfo()` returns `{}` or selects the wrong allowed value

- [ ] **Step 3: 用共享 matcher 改造 `getCustomInfo()`**

```ts
const bestValue = matchCustomerOption(cusstomName, item.allowedValues.map(toCandidate))

if (bestValue?.bestMatch) {
  dynamicCustomField[item.fieldId] = buildJiraCustomerFieldValue(bestValue.bestMatch)
}
```

要求：
- 继续只处理 `客户名称`、`客户信息` 字段。
- 保持返回结构与 `updateTicket()` 当前消费方式兼容。
- 有 `children` 时继续回填默认子项，避免破坏现有 Jira 级联字段格式。
- 不要更改 `CreateTicketUseCase` 的调用方式。

- [ ] **Step 4: 跑服务测试并补一个精确包含回归样例**

Run: `pnpm --dir services/fastify run build && FASTIFY_AUTOLOAD_TYPESCRIPT=1 node --test --loader ts-node/esm services/fastify/test/services/jira-rest.service.test.ts`
Expected: PASS for both token match and direct `includes` match

- [ ] **Step 5: 提交 Jira 客户字段匹配改造**

```bash
git add services/fastify/src/services/jira/jira-rest.service.ts services/fastify/test/services/jira-rest.service.test.ts
git commit -m "feat: share customer matcher in jira custom info"
```

### Task 4: 回归验证与收口

**Files:**
- Modify: `services/fastify/src/routes/dify/customer/index.ts`
- Modify: `services/fastify/src/services/jira/customer-name.matcher.ts`
- Modify: `services/fastify/src/services/jira/jira-rest.service.ts`
- Modify: `services/fastify/test/routes/dify-customer.route.test.ts`
- Modify: `services/fastify/test/services/customer-name.matcher.test.ts`
- Modify: `services/fastify/test/services/jira-rest.service.test.ts`

- [ ] **Step 1: 运行所有相关测试**

Run: `pnpm --dir services/fastify run build && FASTIFY_AUTOLOAD_TYPESCRIPT=1 node --test --loader ts-node/esm services/fastify/test/services/customer-name.matcher.test.ts services/fastify/test/routes/dify-customer.route.test.ts services/fastify/test/services/jira-rest.service.test.ts services/fastify/test/services/create-ticket.use-case.test.ts`
Expected: PASS with 0 failed

- [ ] **Step 2: 运行测试类型检查**

Run: `pnpm --dir services/fastify exec tsc -p services/fastify/test/tsconfig.json`
Expected: PASS

- [ ] **Step 3: 运行服务构建，确认生产产物可生成**

Run: `pnpm --dir services/fastify run build`
Expected: PASS

- [ ] **Step 4: 只在必要时做最后一轮小修**

```ts
// 仅修正评分权重、日志字段或测试夹具，不追加别名表、LLM 或新配置项
```

- [ ] **Step 5: 提交最终收口**

```bash
git add services/fastify/src/routes/dify/customer/index.ts services/fastify/src/services/jira/customer-name.matcher.ts services/fastify/src/services/jira/jira-rest.service.ts services/fastify/test/routes/dify-customer.route.test.ts services/fastify/test/services/customer-name.matcher.test.ts services/fastify/test/services/jira-rest.service.test.ts
git commit -m "fix: support token-based customer name matching"
```

## Acceptance Checklist

- `"中油物业"` 能稳定命中 `"714-中油阳光"`。
- `/dify/customer` 返回真实命中的 ID，而不是仅靠默认值兜底。
- Jira `getCustomInfo()` 对同一输入使用同一套评分逻辑。
- 原有直接 `includes` 场景不回归。
- 不新增请求参数，不改变外部接口响应结构。

## Notes For Execution

- 这份计划基于本次对话中已确认的需求直接生成，未单独编写 spec 文档。
- 当前工作区不是独立 worktree；如果要严格按 superpowers 流程执行，先新建 worktree 再按本计划开工。
