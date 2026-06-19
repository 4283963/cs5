import type { PoolConnection } from 'mysql2/promise'
import { SEED_ROWS } from './seed'

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS org_nodes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  parent_id BIGINT UNSIGNED NULL,
  node_type VARCHAR(20) NOT NULL COMMENT 'department/sub_department/team/employee',
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NULL,
  title VARCHAR(100) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_parent (parent_id),
  KEY idx_type (node_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

export async function ensureSchema(conn: PoolConnection): Promise<void> {
  await conn.query(CREATE_TABLE_SQL)
}

export async function seedIfEmpty(conn: PoolConnection): Promise<void> {
  const [rows] = await conn.query('SELECT COUNT(*) AS cnt FROM org_nodes')
  const count = (rows as { cnt: number }[])[0]?.cnt ?? 0
  if (count > 0) return
  const values = SEED_ROWS.map((r) => [
    r.id,
    r.parent_id,
    r.node_type,
    r.name,
    r.code,
    r.title,
    r.sort_order,
  ])
  await conn.query(
    'INSERT INTO org_nodes (id, parent_id, node_type, name, code, title, sort_order) VALUES ?',
    [values],
  )
}
