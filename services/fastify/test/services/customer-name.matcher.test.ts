import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const {
  matchCustomerOption,
  normalizeCustomerText,
} = require('../../api/services/jira/customer-name.matcher.js') as {
  matchCustomerOption: (input: string, candidates: Array<{ id: string; label: string }>) => {
    bestMatch?: { id: string; label: string }
    score: number
  }
  normalizeCustomerText: (input: string) => string
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

test('matchCustomerOption chooses the lowest id when score and label are tied', async () => {
  const candidates = [
    { id: '10', label: '北方项目' },
    { id: '11', label: '北方项目' },
  ]

  const reversed = [...candidates].reverse()

  const result = matchCustomerOption('北方项目', candidates)
  const reversedResult = matchCustomerOption('北方项目', reversed)

  assert.equal(result.bestMatch?.id, '10')
  assert.equal(result.bestMatch?.label, '北方项目')
  assert.equal(reversedResult.bestMatch?.id, '10')
  assert.equal(reversedResult.bestMatch?.label, '北方项目')
  assert.ok(result.score > 0)
})

test('normalizeCustomerText strips spaces, delimiters and numeric prefix noise', async () => {
  assert.equal(normalizeCustomerText(' 714 - 中油 / 阳光 '), '中油阳光')
  assert.equal(normalizeCustomerText('00123,  星河·物业'), '星河物业')
})

test('matchCustomerOption does not award a strong match for empty or noise-only input', async () => {
  const candidates = [
    { id: '1', label: '星河物业服务中心' },
    { id: '2', label: '中油阳光' },
  ]

  const result = matchCustomerOption('  -- / ,  123 ', candidates)

  assert.ok(result.score <= 0)
  assert.ok(result.rankedCandidates.every(candidate => candidate.score <= 0))
})

test('matchCustomerOption chooses the same winner regardless of candidate order on ties', async () => {
  const ordered = [
    { id: 'B', label: '星河服务' },
    { id: 'A', label: '星河物业' },
  ]
  const reversed = [...ordered].reverse()

  const orderedResult = matchCustomerOption('星河', ordered)
  const reversedResult = matchCustomerOption('星河', reversed)

  assert.equal(orderedResult.bestMatch?.id, reversedResult.bestMatch?.id)
  assert.equal(orderedResult.bestMatch?.label, reversedResult.bestMatch?.label)
})
