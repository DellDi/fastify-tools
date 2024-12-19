type CamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${First}${Capitalize<CamelCase<Rest>>}`
  : S;

// 类型下划线转驼峰
export type ConvertKeysToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K];
};
