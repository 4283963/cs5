import { createContext, useContext } from 'react'
import type { CheckState, FlatTree, PermState } from '@/lib/treeUtils'
import type { PermissionLevel } from '@shared/types'

export interface TreeCtxValue {
  flat: FlatTree
  states: Map<number, CheckState>
  permStates: Map<number, PermState>
  query: string
  visibleIds: Set<number> | null
  matchedIds: Set<number>
  expanded: Set<number>
  isSearching: boolean
  onToggleCheck: (id: number) => void
  onToggleExpand: (id: number) => void
  onSetPermission: (id: number, level: PermissionLevel, cascade?: boolean) => void
  onUnlockPermission: (id: number) => void
  onResetPermission: (id: number) => void
}

export const TreeCtx = createContext<TreeCtxValue | null>(null)

export function useTreeCtx(): TreeCtxValue {
  const ctx = useContext(TreeCtx)
  if (!ctx) throw new Error('useTreeCtx 必须在 PermissionTree 内部使用')
  return ctx
}
