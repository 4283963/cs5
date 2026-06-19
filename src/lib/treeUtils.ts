import type { TreeNode, NodeType } from '@shared/types'

export type CheckState = 'checked' | 'indeterminate' | 'unchecked'

export interface FlatTree {
  roots: TreeNode[]
  nodeMap: Map<number, TreeNode>
  parentMap: Map<number, number | null>
  childrenMap: Map<number, TreeNode[]>
  descendantsMap: Map<number, number[]>
  depthMap: Map<number, number>
  allNodes: TreeNode[]
  counts: Record<NodeType, number>
  total: number
}

export function buildFlatTree(roots: TreeNode[]): FlatTree {
  const nodeMap = new Map<number, TreeNode>()
  const parentMap = new Map<number, number | null>()
  const childrenMap = new Map<number, TreeNode[]>()
  const descendantsMap = new Map<number, number[]>()
  const depthMap = new Map<number, number>()
  const allNodes: TreeNode[] = []
  const counts: Record<NodeType, number> = {
    department: 0,
    sub_department: 0,
    team: 0,
    employee: 0,
  }

  const walk = (node: TreeNode, parent: number | null, depth: number): void => {
    nodeMap.set(node.id, node)
    parentMap.set(node.id, parent)
    depthMap.set(node.id, depth)
    allNodes.push(node)
    counts[node.nodeType]++
    childrenMap.set(node.id, node.children)

    const desc: number[] = []
    for (const child of node.children) {
      walk(child, node.id, depth + 1)
      desc.push(child.id)
      for (const d of descendantsMap.get(child.id) ?? []) desc.push(d)
    }
    descendantsMap.set(node.id, desc)
  }

  for (const root of roots) walk(root, null, 0)

  return {
    roots,
    nodeMap,
    parentMap,
    childrenMap,
    descendantsMap,
    depthMap,
    allNodes,
    counts,
    total: allNodes.length,
  }
}

export function getCheckState(
  id: number,
  checked: Set<number>,
  flat: FlatTree,
): CheckState {
  const node = flat.nodeMap.get(id)
  if (!node) return 'unchecked'
  if (node.children.length === 0) {
    return checked.has(id) ? 'checked' : 'unchecked'
  }
  const childStates = node.children.map((c) => getCheckState(c.id, checked, flat))
  if (childStates.every((s) => s === 'checked')) return 'checked'
  if (childStates.some((s) => s === 'checked' || s === 'indeterminate')) {
    return 'indeterminate'
  }
  return 'unchecked'
}

export function computeCheckStates(
  checked: Set<number>,
  flat: FlatTree,
): Map<number, CheckState> {
  const result = new Map<number, CheckState>()
  const visit = (id: number): CheckState => {
    const node = flat.nodeMap.get(id)!
    let state: CheckState
    if (node.children.length === 0) {
      state = checked.has(id) ? 'checked' : 'unchecked'
    } else {
      const childStates = node.children.map((c) => visit(c.id))
      if (childStates.every((s) => s === 'checked')) state = 'checked'
      else if (childStates.some((s) => s === 'checked' || s === 'indeterminate')) {
        state = 'indeterminate'
      } else {
        state = 'unchecked'
      }
    }
    result.set(id, state)
    return state
  }
  for (const root of flat.roots) visit(root.id)
  return result
}

export function toggleCheckedSet(
  id: number,
  checked: Set<number>,
  flat: FlatTree,
): Set<number> {
  const next = new Set(checked)
  const state = getCheckState(id, checked, flat)
  const ids = [id, ...(flat.descendantsMap.get(id) ?? [])]
  if (state === 'checked') {
    for (const i of ids) next.delete(i)
  } else {
    for (const i of ids) next.add(i)
  }
  return next
}

export function getEffectiveChecked(
  states: Map<number, CheckState>,
  flat: FlatTree,
): TreeNode[] {
  const out: TreeNode[] = []
  for (const node of flat.allNodes) {
    if (states.get(node.id) !== 'checked') continue
    const parent = flat.parentMap.get(node.id) ?? null
    if (parent === null || states.get(parent) !== 'checked') {
      out.push(node)
    }
  }
  return out
}

export function countCoveredEmployees(
  states: Map<number, CheckState>,
  flat: FlatTree,
): number {
  let n = 0
  for (const node of flat.allNodes) {
    if (node.nodeType === 'employee' && states.get(node.id) === 'checked') n++
  }
  return n
}

export interface SearchResult {
  visibleIds: Set<number> | null
  expanded: Set<number> | null
  matchedIds: Set<number>
}

export function computeSearch(query: string, flat: FlatTree): SearchResult {
  const q = query.trim().toLowerCase()
  if (!q) {
    return { visibleIds: null, expanded: null, matchedIds: new Set() }
  }
  const matched = new Set<number>()
  for (const n of flat.allNodes) {
    const hay = `${n.name} ${n.code ?? ''} ${n.title ?? ''}`.toLowerCase()
    if (hay.includes(q)) matched.add(n.id)
  }
  const visible = new Set<number>(matched)
  const expanded = new Set<number>()
  for (const id of matched) {
    let p = flat.parentMap.get(id) ?? null
    while (p !== null) {
      visible.add(p)
      expanded.add(p)
      p = flat.parentMap.get(p) ?? null
    }
    expanded.add(id)
    for (const d of flat.descendantsMap.get(id) ?? []) visible.add(d)
  }
  return { visibleIds: visible, expanded, matchedIds: matched }
}

export function defaultExpanded(flat: FlatTree): Set<number> {
  const s = new Set<number>()
  for (const n of flat.allNodes) {
    if (n.children.length > 0 && (flat.depthMap.get(n.id) ?? 0) <= 1) {
      s.add(n.id)
    }
  }
  return s
}

export function allExpandableIds(flat: FlatTree): Set<number> {
  const s = new Set<number>()
  for (const n of flat.allNodes) {
    if (n.children.length > 0) s.add(n.id)
  }
  return s
}
