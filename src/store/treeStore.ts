import { create } from 'zustand'
import type { TreeNode } from '@shared/types'
import { fetchOrgTree, fetchStatus, type DbMode } from '@/lib/api'
import {
  buildFlatTree,
  defaultExpanded,
  toggleCheckedSet,
  allExpandableIds,
  type FlatTree,
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
  load: () => Promise<void>
  toggleCheck: (id: number) => void
  toggleExpand: (id: number) => void
  expandAll: () => void
  collapseAll: () => void
  checkAll: () => void
  clearChecked: () => void
  setQuery: (q: string) => void
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
}))
