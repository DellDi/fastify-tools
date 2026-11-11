import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import {
  DockerContainersSchema,
  DockerDfSchema,
  DockerImageDeleteSchema,
  DockerImagesSchema,
  DockerLogsSchema,
  DockerPruneSchema,
} from '@/schema/docker/index.js'
import { dockerApi, dockerAvailable, dockerLogs, DockerError } from '@/utils/docker.js'

// /system/df 新旧两种返回格式兼容：
// 新版(docker ≥28) {Images:{TotalCount,Active,Size,Reclaimable},...}
// 旧版 {LayersSize, Images:[{Size,Containers}], Containers:[{State,SizeRw}], Volumes:[{UsageData:{Size}}], BuildCache:[{Size}]}
interface DfStatNew {
  TotalCount?: number
  Active?: number
  Size?: number
  Reclaimable?: number
}
interface DfImageOld {
  Size: number
  Containers: number
}
interface DfContainerOld {
  State?: string
  SizeRw?: number | null
}
interface DfVolumeOld {
  UsageData?: { Size?: number } | null
}
interface DfBuildCacheOld {
  Size?: number
}
interface DfResponse {
  LayersSize?: number
  Images?: DfStatNew | DfImageOld[]
  Containers?: DfStatNew | DfContainerOld[]
  Volumes?: DfStatNew | DfVolumeOld[]
  BuildCache?: DfStatNew | DfBuildCacheOld[]
}
const isNew = (v: unknown): v is DfStatNew => !!v && !Array.isArray(v)
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

const dockerRoutes: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify
    .register(auth)
    .register(bearerAuth, {
      addHook: true,
      keys: new Set([fastify.config.BEARER_TOKEN]),
    })

  const guard = { preHandler: fastify.verifyBearerAuth }

  fastify.setErrorHandler((err, _req, reply) => {
    const statusCode = err instanceof DockerError ? err.statusCode : (err.statusCode ?? 500)
    void reply.code(statusCode).send({ message: err.message })
  })

  const requireDocker = async () => {
    if (!(await dockerAvailable())) throw new DockerError('docker.sock 未挂载', 503)
  }

  fastify.get('/df', {
    schema: DockerDfSchema,
    ...guard,
    handler: async () => {
      await requireDocker()
      const df = await dockerApi<DfResponse>('/system/df')
      const imgs = isNew(df.Images) ? df.Images : null
      const ctrs = isNew(df.Containers) ? df.Containers : null
      const vols = isNew(df.Volumes) ? df.Volumes : null
      const bcs = isNew(df.BuildCache) ? df.BuildCache : null
      const imgArr = (df.Images as DfImageOld[] | undefined) ?? []
      const ctrArr = (df.Containers as DfContainerOld[] | undefined) ?? []
      const volArr = (df.Volumes as DfVolumeOld[] | undefined) ?? []
      const bcArr = (df.BuildCache as DfBuildCacheOld[] | undefined) ?? []
      return {
        images: imgs
          ? {
              count: imgs.TotalCount ?? 0,
              size: imgs.Size ?? df.LayersSize ?? 0,
              reclaimable: imgs.Reclaimable ?? 0,
            }
          : {
              count: imgArr.length,
              size: df.LayersSize ?? sum(imgArr.map((i) => i.Size)),
              reclaimable: sum(imgArr.filter((i) => i.Containers === 0).map((i) => i.Size)),
            },
        containers: ctrs
          ? {
              count: ctrs.TotalCount ?? 0,
              running: ctrs.Active ?? 0,
              size: ctrs.Size ?? 0,
            }
          : {
              count: ctrArr.length,
              running: ctrArr.filter((c) => c.State === 'running').length,
              size: sum(ctrArr.map((c) => c.SizeRw ?? 0)),
            },
        volumes: vols
          ? { count: vols.TotalCount ?? 0, size: vols.Size ?? 0 }
          : {
              count: volArr.length,
              size: sum(volArr.map((v) => v.UsageData?.Size ?? 0)),
            },
        buildCache: bcs
          ? { count: bcs.TotalCount ?? 0, size: bcs.Size ?? 0 }
          : { count: bcArr.length, size: sum(bcArr.map((b) => b.Size ?? 0)) },
      }
    },
  })

  fastify.get('/images', {
    schema: DockerImagesSchema,
    ...guard,
    handler: async () => {
      await requireDocker()
      const list = await dockerApi<
        {
          Id: string
          RepoTags: string[] | null
          Size: number
          Created: number
          Containers: number
        }[]
      >('/images/json')
      return {
        images: list
          .map((i) => ({
            id: i.Id,
            repoTags: i.RepoTags ?? [],
            size: i.Size,
            created: i.Created * 1000,
            containers: i.Containers,
          }))
          .sort((a, b) => b.size - a.size),
      }
    },
  })

  fastify.get('/containers', {
    schema: DockerContainersSchema,
    ...guard,
    handler: async () => {
      await requireDocker()
      const list = await dockerApi<
        {
          Id: string
          Names: string[]
          Image: string
          State: string
          Status: string
          Created: number
        }[]
      >('/containers/json?all=true')
      return {
        containers: list.map((c) => ({
          id: c.Id,
          name: c.Names[0]?.replace(/^\//, '') ?? c.Id.slice(0, 12),
          image: c.Image,
          state: c.State,
          status: c.Status,
          created: c.Created * 1000,
        })),
      }
    },
  })

  fastify.post('/prune', {
    schema: DockerPruneSchema,
    ...guard,
    handler: async (req) => {
      await requireDocker()
      const { type } = req.body as {
        type: 'dangling' | 'images' | 'containers' | 'volumes' | 'buildcache'
      }
      if (type === 'dangling' || type === 'images') {
        const filters =
          type === 'dangling' ? { dangling: { true: true } } : { dangling: { false: true } }
        const res = await dockerApi<{ ImagesDeleted?: { Deleted?: string }[]; SpaceReclaimed: number }>(
          `/images/prune?filters=${encodeURIComponent(JSON.stringify(filters))}`,
          'POST'
        )
        return {
          reclaimed: res.SpaceReclaimed ?? 0,
          detail: (res.ImagesDeleted ?? []).map((d) => d.Deleted ?? '').filter(Boolean),
        }
      }
      if (type === 'containers') {
        const res = await dockerApi<{ ContainersDeleted?: string[]; SpaceReclaimed: number }>(
          '/containers/prune',
          'POST'
        )
        return { reclaimed: res.SpaceReclaimed ?? 0, detail: res.ContainersDeleted ?? [] }
      }
      if (type === 'volumes') {
        const res = await dockerApi<{ VolumesDeleted?: string[]; SpaceReclaimed: number }>(
          '/volumes/prune',
          'POST'
        )
        return { reclaimed: res.SpaceReclaimed ?? 0, detail: res.VolumesDeleted ?? [] }
      }
      const res = await dockerApi<{ CachesDeleted?: string[]; SpaceReclaimed: number }>(
        '/build/prune',
        'POST'
      )
      return { reclaimed: res.SpaceReclaimed ?? 0, detail: res.CachesDeleted ?? [] }
    },
  })

  fastify.delete('/images/:id', {
    schema: DockerImageDeleteSchema,
    ...guard,
    handler: async (req) => {
      await requireDocker()
      const { id } = req.params as { id: string }
      await dockerApi(`/images/${encodeURIComponent(id)}?force=true`, 'DELETE')
      return { ok: true }
    },
  })

  fastify.get('/containers/:id/logs', {
    schema: DockerLogsSchema,
    ...guard,
    handler: async (req) => {
      await requireDocker()
      const { id } = req.params as { id: string }
      const { tail = 200 } = req.query as { tail?: number }
      return { logs: await dockerLogs(id, Math.min(tail, 2000)) }
    },
  })
}

export default dockerRoutes
