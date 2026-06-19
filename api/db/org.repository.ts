import type { RowDataPacket } from 'mysql2'
import { getPool } from './pool'
import { getDbMode } from './index'
import { SEED_ROWS } from './seed'
import type { OrgRow } from '@shared/types'

const SELECT_SQL =
  'SELECT id, parent_id, node_type, name, code, title, sort_order FROM org_nodes ORDER BY sort_order, id'

export async function findAllOrgNodes(): Promise<OrgRow[]> {
  if (getDbMode() !== 'mysql') {
    return SEED_ROWS
  }
  const pool = getPool()
  if (!pool) return SEED_ROWS
  try {
    const [rows] = await pool.query<RowDataPacket[]>(SELECT_SQL)
    return rows as unknown as OrgRow[]
  } catch (err) {
    console.warn(
      '[org.repository] 查询 MySQL 失败，降级为内存种子数据：',
      (err as Error).message,
    )
    return SEED_ROWS
  }
}
