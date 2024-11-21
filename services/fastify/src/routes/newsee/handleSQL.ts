// 新增mysql操作，动态执行sql语句
import { FastifyInstance } from 'fastify'

export async function handleSQL(sql: string, fastify: FastifyInstance): Promise<any> {
  const connection = await fastify.mysql.getConnection()
  // 如果sql中没有限制查询的条数，那么默认查询10条
  if (!sql.includes('limit')) {
    sql += ' limit 10'
  }
  const [rows, fields] = await connection.query(sql)
  console.log('🚀 ~ file:handleSQL.ts, line:7-----', rows, fields)
  connection.release()
  return rows
}
