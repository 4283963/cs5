import type { ApiResponse, TreeNode } from '@shared/types'

export async function fetchOrgTree(): Promise<TreeNode[]> {
  const res = await fetch('/api/auth/tree')
  if (!res.ok) {
    throw new Error(`加载组织树失败：HTTP ${res.status}`)
  }
  const json: ApiResponse<TreeNode[]> = await res.json()
  if (json.code !== 0) {
    throw new Error(json.message || '加载组织树失败')
  }
  return json.data
}

export type DbMode = 'mysql' | 'mock'

export async function fetchStatus(): Promise<DbMode> {
  try {
    const res = await fetch('/api/auth/status')
    if (!res.ok) return 'mock'
    const json: ApiResponse<{ db: DbMode }> = await res.json()
    return json.data?.db ?? 'mock'
  } catch {
    return 'mock'
  }
}
