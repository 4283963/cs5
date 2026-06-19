import { useMemo } from 'react'
import { AlertTriangle, RefreshCw, SearchX } from 'lucide-react'
import { useTreeStore } from '@/store/treeStore'
import {
  computeCheckStates,
  computeSearch,
  type CheckState,
  type FlatTree,
} from '@/lib/treeUtils'
import type { TreeNode } from '@shared/types'
import { TreeNodeRow } from './TreeNodeRow'
import { TreeSkeleton } from './TreeSkeleton'
import { TreeCtx, type TreeCtxValue } from './treeContext'

export function PermissionTree() {
  const flat = useTreeStore((s) => s.flat)
  const status = useTreeStore((s) => s.status)
  const error = useTreeStore((s) => s.error)
  const checked = useTreeStore((s) => s.checked)
  const expanded = useTreeStore((s) => s.expanded)
  const permStates = useTreeStore((s) => s.permStates)
  const query = useTreeStore((s) => s.query)
  const toggleCheck = useTreeStore((s) => s.toggleCheck)
  const toggleExpand = useTreeStore((s) => s.toggleExpand)
  const setPermission = useTreeStore((s) => s.setPermission)
  const unlockPermission = useTreeStore((s) => s.unlockPermission)
  const resetPermission = useTreeStore((s) => s.resetPermission)
  const load = useTreeStore((s) => s.load)

  const states = useMemo(
    () => (flat ? computeCheckStates(checked, flat) : null),
    [flat, checked],
  )
  const search = useMemo(
    () => (flat ? computeSearch(query, flat) : null),
    [query, flat],
  )

  if (status === 'idle' || status === 'loading') {
    return <TreeSkeleton />
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <AlertTriangle className="h-8 w-8 text-ember" />
        <p className="max-w-xs text-sm text-muted">
          {error || '组织树加载失败，请检查后端服务是否启动'}
        </p>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-lg bg-jade/10 px-3 py-1.5 text-xs font-medium text-jade ring-1 ring-inset ring-jade/30 transition-colors hover:bg-jade/20"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          重新加载
        </button>
      </div>
    )
  }

  if (!flat || !states) return null

  const isSearching = !!query.trim()
  const effectiveExpanded = search?.expanded ?? expanded
  const visibleIds = search?.visibleIds ?? null
  const matchedIds = search?.matchedIds ?? new Set<number>()

  if (isSearching && visibleIds !== null && visibleIds.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
        <SearchX className="h-7 w-7 text-faint" />
        <p className="text-sm text-muted">
          未找到匹配「{query.trim()}」的节点
        </p>
      </div>
    )
  }

  const ctxValue: TreeCtxValue = {
    flat,
    states,
    permStates,
    query,
    visibleIds,
    matchedIds,
    expanded: effectiveExpanded,
    isSearching,
    onToggleCheck: toggleCheck,
    onToggleExpand: toggleExpand,
    onSetPermission: setPermission,
    onUnlockPermission: unlockPermission,
    onResetPermission: resetPermission,
  }

  return (
    <TreeCtx.Provider value={ctxValue}>
      <div className="py-1">
        {flat.roots.map((node: TreeNode) => (
          <TreeNodeRow key={node.id} node={node} />
        ))}
      </div>
    </TreeCtx.Provider>
  )
}
