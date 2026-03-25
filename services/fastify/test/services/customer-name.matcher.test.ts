import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { matchCustomerOption } = require('../../api/services/jira/customer-name.matcher.js') as {
  matchCustomerOption: (input: string, candidates: Array<{ id: string; label: string }>) => {
    bestMatch?: { id: string; label: string }
    score: number
  }
}

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

test('matchCustomerOption ranks a full text containment above a weaker partial match', async () => {
  const candidates = [
    { id: '1', label: '星河物业服务中心' },
    { id: '2', label: '星河服务' },
  ]

  const result = matchCustomerOption('星河服务中心', candidates)

  assert.equal(result.bestMatch?.id, '1')
  assert.equal(result.bestMatch?.label, '星河物业服务中心')
  assert.ok(result.score > 0)
})

test('matchCustomerOption keeps ordering stable for equal scores', async () => {
  const candidates = [
    { id: '10', label: '北方项目' },
    { id: '11', label: '北方项目' },
  ]

  const result = matchCustomerOption('北方项目', candidates)

  assert.equal(result.bestMatch?.id, '10')
  assert.equal(result.bestMatch?.label, '北方项目')
  assert.ok(result.score > 0)
})
