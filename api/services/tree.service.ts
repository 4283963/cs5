import { findAllOrgNodes } from '../db/org.repository'
import type { OrgRow, TreeNode } from '@shared/types'

export function rowsToTree(rows: OrgRow[]): TreeNode[] {
  const nodeMap = new Map<number, TreeNode>()
  for (const row of rows) {
    nodeMap.set(row.id, {
      id: row.id,
      parentId: row.parent_id,
      nodeType: row.node_type,
      name: row.name,
      code: row.code,
      title: row.title,
      sortOrder: row.sort_order,
      children: [],
    })
  }

  const childrenByParent = new Map<number | null, TreeNode[]>()
  for (const row of rows) {
    const list = childrenByParent.get(row.parent_id) ?? []
    list.push(nodeMap.get(row.id)!)
    childrenByParent.set(row.parent_id, list)
  }

  for (const list of childrenByParent.values()) {
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
  }

  for (const node of nodeMap.values()) {
    node.children = childrenByParent.get(node.id) ?? []
  }

  return childrenByParent.get(null) ?? []
}

export async function buildOrgTree(): Promise<TreeNode[]> {
  const rows = await findAllOrgNodes()
  return rowsToTree(rows)
}
