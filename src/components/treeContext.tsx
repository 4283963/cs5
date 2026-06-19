import { createContext, useContext } from 'react'
import type { CheckState, FlatTree } from '@/lib/treeUtils'

export interface TreeCtxValue {
  flat: FlatTree
  states: Map<number, CheckState>
  query: string
  visibleIds: Set<number> | null
  matchedIds: Set<number>
  expanded: Set<number>
  isSearching: boolean
  onToggleCheck: (id: number) => void
  onToggleExpand: (id: number) => void
}

export const TreeCtx = createContext<TreeCtxValue | null>(null)

export function useTreeCtx(): TreeCtxValue {
  const ctx = useContext(TreeCtx)
  if (!ctx) throw new Error('useTreeCtx 必须在 PermissionTree 内部使用')
  return ctx
}
