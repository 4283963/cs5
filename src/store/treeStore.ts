import { create } from 'zustand'
import type { TreeNode, PermissionLevel } from '@shared/types'
import { fetchOrgTree, fetchStatus, type DbMode } from '@/lib/api'
import {
  buildFlatTree,
  defaultExpanded,
  toggleCheckedSet,
  allExpandableIds,
  computePermStates,
  setPermWithDescendants,
  clearPermAndInherit,
  type FlatTree,
  type PermState,
} from '@/lib/treeUtils'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface TreeState {
  tree: TreeNode[]
  flat: FlatTree | null
  status: Status
  error: string | null
  dbMode: DbMode | 'unknown'
  checked: Set<number>
  expanded: Set<number>
  query: string
  explicitPerms: Map<number, PermissionLevel>
  permStates: Map<number, PermState>
  load: () => Promise<void>
  toggleCheck: (id: number) => void
  toggleExpand: (id: number) => void
  expandAll: () => void
  collapseAll: () => void
  checkAll: () => void
  clearChecked: () => void
  setQuery: (q: string) => void
  setPermission: (id: number, level: PermissionLevel, cascade?: boolean) => void
  unlockPermission: (id: number) => void
  resetPermission: (id: number) => void
}

export const useTreeStore = create<TreeState>((set, get) => ({
  tree: [],
  flat: null,
  status: 'idle',
  error: null,
  dbMode: 'unknown',
  checked: new Set(),
  expanded: new Set(),
  query: '',
  explicitPerms: new Map(),
  permStates: new Map(),

  load: async () => {
    set({ status: 'loading', error: null })
    try {
      const tree = await fetchOrgTree()
      const flat = buildFlatTree(tree)
      let dbMode: DbMode | 'unknown' = 'unknown'
      try {
        dbMode = await fetchStatus()
      } catch {
        dbMode = 'unknown'
      }
      set({
        tree,
        flat,
        status: 'success',
        expanded: defaultExpanded(flat),
        dbMode,
        explicitPerms: new Map(),
        permStates: computePermStates(new Map(), flat),
      })
    } catch (e) {
      set({ status: 'error', error: (e as Error).message })
    }
  },

  toggleCheck: (id) => {
    const { flat, checked } = get()
    if (!flat) return
    set({ checked: toggleCheckedSet(id, checked, flat) })
  },

  toggleExpand: (id) => {
    const next = new Set(get().expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    set({ expanded: next })
  },

  expandAll: () => {
    const { flat } = get()
    if (!flat) return
    set({ expanded: allExpandableIds(flat) })
  },

  collapseAll: () => set({ expanded: new Set() }),

  checkAll: () => {
    const { flat } = get()
    if (!flat) return
    const next = new Set<number>()
    for (const n of flat.allNodes) next.add(n.id)
    set({ checked: next })
  },

  clearChecked: () => set({ checked: new Set() }),

  setQuery: (q) => set({ query: q }),

  setPermission: (id, level, cascade = true) => {
    const { flat, explicitPerms } = get()
    if (!flat) return
    const next = cascade
      ? setPermWithDescendants(id, level, flat, explicitPerms)
      : (() => {
          const m = new Map(explicitPerms)
          m.set(id, level)
          return m
        })()
    set({ explicitPerms: next, permStates: computePermStates(next, flat) })
  },

  unlockPermission: (id) => {
    const { flat, explicitPerms, permStates } = get()
    if (!flat) return
    const state = permStates.get(id)
    if (!state || !state.isInherited) return
    const next = new Map(explicitPerms)
    next.set(id, state.level)
    set({ explicitPerms: next, permStates: computePermStates(next, flat) })
  },

  resetPermission: (id) => {
    const { flat, explicitPerms } = get()
    if (!flat) return
    const next = clearPermAndInherit(id, flat, explicitPerms)
    set({ explicitPerms: next, permStates: computePermStates(next, flat) })
  },
}))
