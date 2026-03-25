import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import Fastify from 'fastify'

const require = createRequire(`${process.cwd()}/services/fastify/test/routes/dify-customer.route.test.ts`)
const appPlugin = require('../../api/app.js').default as typeof import('../../src/app.js').default

async function build() {
  const app = Fastify()
  await app.register(appPlugin)
  await app.ready()
  return app
}

test('/dify/customer selects highest-score customer ids for tokenized input', async () => {
  const app = await build()

  try {
    const res = await app.inject({
      method: 'POST',
      url: '/dify/customer',
      payload: {
        customerName: '中油物业',
        htmlStr: `<select><option value="6001">6001-中油阳光</option></select>`,
        htmlStrAll: `
          <select class="cascadingselect-parent">
            <option value="7001">7001-中油阳光</option>
            <option value="17714">714-阳光物业</option>
          </select>
          <select class="cascadingselect-child">
            <option value="9001">中油阳光子项</option>
            <option value="21057">默认子项</option>
          </select>
        `,
      },
    })

    assert.equal(res.statusCode, 200)
    assert.deepEqual(JSON.parse(res.payload), {
      isSaaS: true,
      customerNameId: '6001',
      customerInfoId: '7001',
      customerInfoIdAlias: '9001',
    })
  } finally {
    await app.close()
  }
})

test('/dify/customer keeps exact includes matches working', async () => {
  const app = await build()

  try {
    const res = await app.inject({
      method: 'POST',
      url: '/dify/customer',
      payload: {
        customerName: '714-中油阳光',
        htmlStr: `<select><option value="14169">714-中油阳光</option></select>`,
        htmlStrAll: `
          <select class="cascadingselect-parent">
            <option value="17714">714-中油阳光</option>
          </select>
          <select class="cascadingselect-child">
            <option value="21057">714-中油阳光</option>
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
  } finally {
    await app.close()
  }
})
