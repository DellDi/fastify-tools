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

async function injectCustomer(
  app: Awaited<ReturnType<typeof build>>,
  payload: Record<string, unknown>,
) {
  return app.inject({
    method: 'POST',
    url: '/dify/customer',
    payload,
  })
}

test('/dify/customer selects highest-score customer ids for tokenized input', async () => {
  const app = await build()

  try {
    const res = await injectCustomer(app, {
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
    const res = await injectCustomer(app, {
      customerName: '714-中油阳光',
      htmlStr: `
        <select>
          <option value="14169">714-中油阳光</option>
          <option value="14170">714-中油阳光物业</option>
        </select>
      `,
      htmlStrAll: `
        <select class="cascadingselect-parent">
          <option value="17714">714-中油阳光</option>
          <option value="17715">714-中油阳光物业</option>
        </select>
        <select class="cascadingselect-child">
          <option value="21057">714-中油阳光</option>
          <option value="21058">714-中油阳光物业</option>
        </select>
      `,
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

test('/dify/customer keeps fallback behavior for omitted customerName', async () => {
  const app = await build()

  try {
    const res = await injectCustomer(app, {
      htmlStr: `<select><option value="14169">714-中油阳光</option></select>`,
      htmlStrAll: `
        <select class="cascadingselect-parent">
          <option value="17714">714-中油阳光</option>
        </select>
        <select class="cascadingselect-child">
          <option value="21057">默认子项</option>
        </select>
      `,
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

test('/dify/customer keeps fallback behavior for blank or noise-only customerName', async () => {
  const app = await build()

  try {
    const blankResponse = await injectCustomer(app, {
      customerName: '',
      htmlStr: `<select><option value="14169">714-中油阳光</option></select>`,
      htmlStrAll: `
        <select class="cascadingselect-parent">
          <option value="17714">714-中油阳光</option>
        </select>
        <select class="cascadingselect-child">
          <option value="21057">默认子项</option>
        </select>
      `,
    })

    assert.equal(blankResponse.statusCode, 200)
    assert.deepEqual(JSON.parse(blankResponse.payload), {
      isSaaS: false,
      customerNameId: '14169',
      customerInfoId: '17714',
      customerInfoIdAlias: '21057',
    })

    const noiseResponse = await injectCustomer(app, {
      customerName: '  -- / ,  123 ',
      htmlStr: `<select><option value="14169">714-中油阳光</option></select>`,
      htmlStrAll: `
        <select class="cascadingselect-parent">
          <option value="17714">714-中油阳光</option>
        </select>
        <select class="cascadingselect-child">
          <option value="21057">默认子项</option>
        </select>
      `,
    })

    assert.equal(noiseResponse.statusCode, 200)
    assert.deepEqual(JSON.parse(noiseResponse.payload), {
      isSaaS: false,
      customerNameId: '14169',
      customerInfoId: '17714',
      customerInfoIdAlias: '21057',
    })
  } finally {
    await app.close()
  }
})
