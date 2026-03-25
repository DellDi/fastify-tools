import type {
  CustomerCandidate,
  CustomerCandidateScore,
  CustomerMatchResult,
} from './types.js'

const WEAK_TOKENS = ['物业', '公司', '集团', '项目', '服务中心'] as const

const NORMALIZE_NOISE_PATTERN = /[\s,，.。·•_/\\|()[\]{}<>:：;；~`'"“”‘’!?！？-]+/g

export function normalizeCustomerText(input: string): string {
  return input
    .trim()
    .replace(NORMALIZE_NOISE_PATTERN, '')
    .replace(/^\d+/, '')
}

export function splitCustomerTokens(input: string): string[] {
  const normalized = normalizeCustomerText(input)
  if (!normalized) {
    return []
  }

  const tokens: string[] = []
  let cursor = 0

  while (cursor < normalized.length) {
    let matchedWeakToken = ''

    for (const weakToken of WEAK_TOKENS) {
      if (normalized.startsWith(weakToken, cursor)) {
        matchedWeakToken = weakToken
        break
      }
    }

    if (matchedWeakToken) {
      tokens.push(matchedWeakToken)
      cursor += matchedWeakToken.length
      continue
    }

    let nextWeakIndex = normalized.length
    for (const weakToken of WEAK_TOKENS) {
      const index = normalized.indexOf(weakToken, cursor + 1)
      if (index !== -1 && index < nextWeakIndex) {
        nextWeakIndex = index
      }
    }

    const token = normalized.slice(cursor, nextWeakIndex)
    if (token) {
      tokens.push(token)
    }
    cursor = nextWeakIndex
  }

  return tokens.filter(Boolean)
}

function splitPrimaryAndWeakTokens(tokens: string[]): { primaryTokens: string[]; weakTokens: string[] } {
  const primaryTokens: string[] = []
  const weakTokens: string[] = []

  for (const token of tokens) {
    if (WEAK_TOKENS.includes(token as (typeof WEAK_TOKENS)[number])) {
      weakTokens.push(token)
    } else {
      primaryTokens.push(token)
    }
  }

  return { primaryTokens, weakTokens }
}

function scoreCandidate(
  normalizedInput: string,
  inputTokens: string[],
  candidate: CustomerCandidate,
  originalIndex: number,
): CustomerCandidateScore {
  const normalizedLabel = normalizeCustomerText(candidate.label)
  const { primaryTokens, weakTokens } = splitPrimaryAndWeakTokens(inputTokens)

  let score = 0
  const matchedPrimaryTokens: string[] = []
  const matchedWeakTokens: string[] = []
  const hasPrimaryTokens = primaryTokens.length > 0

  if (hasPrimaryTokens && normalizedInput && normalizedLabel.includes(normalizedInput)) {
    score += 100
  }

  for (const token of primaryTokens) {
    if (token && normalizedLabel.includes(token)) {
      score += 30
      matchedPrimaryTokens.push(token)
    }
  }

  for (const token of weakTokens) {
    if (token && normalizedLabel.includes(token)) {
      score += 8
      matchedWeakTokens.push(token)
    }
  }

  const lengthPenalty = Math.abs(normalizedLabel.length - normalizedInput.length)
  score -= lengthPenalty

  return {
    id: candidate.id,
    label: candidate.label,
    score,
    normalizedLabel,
    matchedPrimaryTokens,
    matchedWeakTokens,
    originalIndex,
  }
}

function compareCustomerCandidateScore(
  left: CustomerCandidateScore,
  right: CustomerCandidateScore,
): number {
  if (left.score !== right.score) {
    return right.score - left.score
  }

  if (left.normalizedLabel !== right.normalizedLabel) {
    return left.normalizedLabel.localeCompare(right.normalizedLabel)
  }

  if (left.label !== right.label) {
    return left.label.localeCompare(right.label)
  }

  const leftIdIsNumeric = /^\d+$/.test(left.id)
  const rightIdIsNumeric = /^\d+$/.test(right.id)

  if (leftIdIsNumeric && rightIdIsNumeric) {
    const numericIdDifference = Number(left.id) - Number(right.id)
    if (numericIdDifference !== 0) {
      return numericIdDifference
    }
  }

  return left.id.localeCompare(right.id)
}

export function matchCustomerOption(
  input: string,
  candidates: CustomerCandidate[],
): CustomerMatchResult {
  const normalizedInput = normalizeCustomerText(input)
  const inputTokens = splitCustomerTokens(normalizedInput)
  const rankedCandidates = candidates
    .map((candidate, index) => scoreCandidate(normalizedInput, inputTokens, candidate, index))
    .sort(compareCustomerCandidateScore)

  return {
    bestMatch: rankedCandidates[0],
    score: rankedCandidates[0]?.score ?? 0,
    rankedCandidates,
  }
}

export function hasMeaningfulCustomerMatch(
  candidate?: CustomerCandidateScore,
): boolean {
  return Boolean(candidate?.matchedPrimaryTokens.length)
}
