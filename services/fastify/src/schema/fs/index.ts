import { Type } from '@fastify/type-provider-typebox'

const PathQuery = Type.Object({
  path: Type.String({ description: '宿主机视角路径，如 /opt、/srv（容器内映射为 /host 前缀）。' }),
})

const FsEntry = Type.Object({
  name: Type.String(),
  type: Type.Union([
    Type.Literal('dir'),
    Type.Literal('file'),
    Type.Literal('link'),
    Type.Literal('other'),
  ]),
  size: Type.Union([Type.Number(), Type.Null()]),
  mtimeMs: Type.Number(),
  mode: Type.String({ description: '八进制权限位，如 755。' }),
  denied: Type.Boolean({ description: '命中敏感黑名单，禁止预览/操作。' }),
})

export const FsListSchema = {
  description: '目录列表（目录优先排序）。读取范围：宿主机全盘（/host 挂载）。',
  tags: ['fs'],
  querystring: PathQuery,
  response: {
    200: Type.Object({
      path: Type.String({ description: '宿主机视角的当前路径。' }),
      writable: Type.Boolean({ description: '当前目录是否在可写白名单（/opt、/srv）。' }),
      entries: Type.Array(FsEntry),
    }),
  },
}

export const FsReadSchema = {
  description:
    '文件预览。文本按 utf8 分块返回（≤2MB，含 NUL 判为二进制）；图片返回 type=image，走 /raw 取流；目录返回 type=dir。',
  tags: ['fs'],
  querystring: Type.Intersect([
    PathQuery,
    Type.Object({
      offset: Type.Optional(Type.Number({ minimum: 0, default: 0 })),
      limit: Type.Optional(Type.Number({ minimum: 1 })),
    }),
  ]),
  response: {
    200: Type.Object({
      type: Type.Union([
        Type.Literal('text'),
        Type.Literal('binary'),
        Type.Literal('image'),
        Type.Literal('dir'),
      ]),
      content: Type.Optional(Type.String()),
      mime: Type.Optional(Type.String()),
      size: Type.Number(),
      mtimeMs: Type.Number(),
      truncated: Type.Boolean(),
    }),
  },
}

export const FsSearchSchema = {
  description:
    '文件检索。name=文件名子串（不区分大小写）；content=文本内容子串（仅扫 <2MB 文本文件）。限深/限量/限时，跳过 /proc /sys /dev /run 与敏感路径。',
  tags: ['fs'],
  querystring: Type.Intersect([
    PathQuery,
    Type.Object({
      name: Type.Optional(Type.String()),
      content: Type.Optional(Type.String()),
      depth: Type.Optional(Type.Number({ minimum: 1, maximum: 8, default: 4 })),
      limit: Type.Optional(Type.Number({ minimum: 1, maximum: 500, default: 200 })),
    }),
  ]),
  response: {
    200: Type.Object({
      hits: Type.Array(
        Type.Object({
          path: Type.String({ description: '宿主机视角路径。' }),
          type: Type.Union([Type.Literal('dir'), Type.Literal('file')]),
          size: Type.Union([Type.Number(), Type.Null()]),
          match: Type.Union([Type.Literal('name'), Type.Literal('content')]),
        })
      ),
      truncated: Type.Boolean({ description: '达到条数上限被截断。' }),
      timedOut: Type.Boolean({ description: '达到时限被截断。' }),
    }),
  },
}

const DuNode: import('@sinclair/typebox').TSchema = Type.Recursive((Self) =>
  Type.Object({
    name: Type.String(),
    path: Type.String({ description: '宿主机视角路径。' }),
    size: Type.Number({ description: '累计体积（字节，不跟随软链）。' }),
    children: Type.Optional(Type.Array(Self)),
  })
)

export const FsDuSchema = {
  description:
    '磁盘占用分析：递归累计目录体积（du）。depth 控制展开层数（默认 2）；节点数/时限超限截断。跳过 /proc /sys /dev /run 与软链。',
  tags: ['fs'],
  querystring: Type.Intersect([
    PathQuery,
    Type.Object({
      depth: Type.Optional(Type.Number({ minimum: 1, maximum: 6, default: 2 })),
    }),
  ]),
  response: {
    200: Type.Object({
      root: DuNode,
      truncated: Type.Boolean(),
    }),
  },
}

export const FsMkdirSchema = {
  description: '创建目录（recursive）。仅可写白名单（/opt、/srv）。',
  tags: ['fs'],
  body: Type.Object({ path: Type.String() }),
  response: { 200: Type.Object({ ok: Type.Boolean() }) },
}

export const FsRenameSchema = {
  description: '重命名（同目录内改名）。两端都须在可写白名单。',
  tags: ['fs'],
  body: Type.Object({ path: Type.String(), newName: Type.String() }),
  response: { 200: Type.Object({ ok: Type.Boolean() }) },
}

export const FsMoveSchema = {
  description: '移动文件/目录到目标目录。两端都须在可写白名单。',
  tags: ['fs'],
  body: Type.Object({ src: Type.String(), dest: Type.String({ description: '目标目录路径' }) }),
  response: { 200: Type.Object({ ok: Type.Boolean() }) },
}

export const FsDeleteSchema = {
  description:
    '删除文件或目录。仅可写白名单；必须 confirm=true 二次确认；目录需 recursive=true。',
  tags: ['fs'],
  querystring: Type.Intersect([
    PathQuery,
    Type.Object({
      confirm: Type.Boolean(),
      recursive: Type.Optional(Type.Boolean({ default: false })),
    }),
  ]),
  response: { 200: Type.Object({ ok: Type.Boolean() }) },
}

export const FsUploadSchema = {
  description: 'multipart 上传到指定目录（字段名 file，可多文件）。仅可写白名单。',
  tags: ['fs'],
  querystring: PathQuery,
  response: {
    200: Type.Object({
      ok: Type.Boolean(),
      files: Type.Array(Type.String()),
    }),
  },
}
