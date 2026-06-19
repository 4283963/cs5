export type NodeType = 'department' | 'sub_department' | 'team' | 'employee'

export interface OrgRow {
  id: number
  parent_id: number | null
  node_type: NodeType
  name: string
  code: string | null
  title: string | null
  sort_order: number
}

export interface TreeNode {
  id: number
  parentId: number | null
  nodeType: NodeType
  name: string
  code: string | null
  title: string | null
  sortOrder: number
  children: TreeNode[]
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export const NODE_TYPE_LABEL: Record<NodeType, string> = {
  department: '部门',
  sub_department: '子部门',
  team: '小组',
  employee: '员工',
}
