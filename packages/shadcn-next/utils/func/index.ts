// 下划线转驼峰
export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  )
}

// mapKeys
export function mapKeys(obj: Record<string, any>, fn: (key: string) => string): Record<string, any> {
  return Object.keys(obj).reduce((acc, key) => {
    acc[fn(key)] = obj[key]
    return acc
  }, {} as Record<string, any>)
}

// cloneDeep
