import { getPool, forceMock } from './pool'
import { ensureSchema, seedIfEmpty } from './migrate'

export type DbMode = 'mysql' | 'mock'

let mode: DbMode | null = null

export async function initDb(): Promise<DbMode> {
  const pool = getPool()
  if (!pool) {
    mode = 'mock'
    console.log('[db] 未配置 DB_HOST 或已强制 mock，使用内存种子数据')
    return mode
  }
  try {
    const conn = await pool.getConnection()
    try {
      await ensureSchema(conn)
      await seedIfEmpty(conn)
    } finally {
      conn.release()
    }
    mode = 'mysql'
    console.log('[db] MySQL 就绪，org_nodes 表已初始化')
  } catch (err) {
    mode = 'mock'
    forceMock()
    console.warn(
      '[db] MySQL 不可用，降级为内存种子数据：',
      (err as Error).message,
    )
  }
  return mode
}

export function getDbMode(): DbMode {
  return mode ?? 'mock'
}
