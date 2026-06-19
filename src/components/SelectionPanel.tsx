import { useMemo, useState } from 'react'
import { Check, Copy, Trash2, ShieldCheck, Lock } from 'lucide-react'
import { useTreeStore } from '@/store/treeStore'
import {
  computeCheckStates,
  getEffectiveChecked,
  countCoveredEmployees,
  type PermState,
} from '@/lib/treeUtils'
import {
  NODE_TYPE_LABEL,
  PERMISSION_LABEL,
  type NodeType,
  type TreeNode,
  type PermissionLevel,
} from '@shared/types'
import { NODE_VISUAL } from '@/lib/nodeVisual'
import { cn } from '@/lib/utils'

const TYPE_ORDER: NodeType[] = [
  'department',
  'sub_department',
  'team',
  'employee',
]

function ChipRow({ node, perm }: { node: TreeNode; perm: PermState | undefined }) {
  const v = NODE_VISUAL[node.nodeType]
  return (
    <div className="flex items-center gap-2 rounded-lg bg-panel2/60 px-2.5 py-1.5 ring-1 ring-inset ring-lineSoft">
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', v.dot)} />
      <span className="min-w-0 truncate text-[12px] text-ink">{node.name}</span>
      {node.code && (
        <span className="ml-auto shrink-0 font-mono text-[10px] text-faint">
          {node.code}
        </span>
      )}
      {perm && (
        <span
          className={cn(
            'flex items-center gap-0.5 shrink-0 rounded px-1.5',
            perm.level === 'admin'
              ? 'text-jade'
              : perm.level === 'write'
                ? 'text-amber-soft'
                : 'text-muted',
          )}
          title={perm.isInherited ? '继承权限' : '显式设置'}
        >
          {perm.isInherited && <Lock className="h-2.5 w-2.5" />}
          <span className="font-mono text-[10px]">{PERMISSION_LABEL[perm.level]}</span>
        </span>
      )}
    </div>
  )
}

function Group({
  type,
  nodes,
  permStates,
}: {
  type: NodeType
  nodes: TreeNode[]
  permStates: Map<number, PermState>
}) {
  if (nodes.length === 0) return null
  const v = NODE_VISUAL[type]
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 px-0.5">
        <span className={cn('h-1.5 w-1.5 rounded-full', v.dot)} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {NODE_TYPE_LABEL[type]}
        </span>
        <span className="tnum font-mono text-[10px] text-faint">
          {nodes.length}
        </span>
        <span className="ml-2 h-px flex-1 bg-lineSoft" />
      </div>
      <div className="space-y-1">
        {nodes.map((n) => (
          <ChipRow key={n.id} node={n} perm={permStates.get(n.id)} />
        ))}
      </div>
    </div>
  )
}

export function SelectionPanel() {
  const flat = useTreeStore((s) => s.flat)
  const checked = useTreeStore((s) => s.checked)
  const permStates = useTreeStore((s) => s.permStates)
  const clearChecked = useTreeStore((s) => s.clearChecked)
  const [copied, setCopied] = useState(false)

  const states = useMemo(
    () => (flat ? computeCheckStates(checked, flat) : null),
    [flat, checked],
  )
  const effective = useMemo(
    () => (states && flat ? getEffectiveChecked(states, flat) : []),
    [states, flat],
  )
  const covered = useMemo(
    () => (states && flat ? countCoveredEmployees(states, flat) : 0),
    [states, flat],
  )

  const grouped = useMemo(() => {
    const g: Record<NodeType, TreeNode[]> = {
      department: [],
      sub_department: [],
      team: [],
      employee: [],
    }
    for (const n of effective) g[n.nodeType].push(n)
    return g
  }, [effective])

  const handleCopy = async () => {
    const text = effective
      .map((n) => {
        const p = permStates.get(n.id)
        const permLabel = p ? ` [${PERMISSION_LABEL[p.level]}${p.isInherited ? '·继承' : ''}]` : ''
        return `${NODE_TYPE_LABEL[n.nodeType]}｜${n.name}${n.code ? ` (${n.code})` : ''}${permLabel}`
      })
      .join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore clipboard errors */
    }
  }

  const permSummary = useMemo(() => {
    const counts: Record<PermissionLevel, number> = { read: 0, write: 0, admin: 0 }
    for (const n of effective) {
      const p = permStates.get(n.id)
      if (p) counts[p.level]++
    }
    return counts
  }, [effective, permStates])

  const hasSelection = effective.length > 0

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel/60 shadow-panel">
      <div className="flex items-center justify-between gap-2 border-b border-lineSoft px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-jade" strokeWidth={1.9} />
          <h2 className="text-[13px] font-semibold text-ink">选中概览</h2>
          <span className="tnum rounded-full bg-panel3 px-1.5 py-0.5 font-mono text-[10px] text-muted ring-1 ring-inset ring-line">
            {effective.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!hasSelection}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium ring-1 ring-inset transition-colors',
              hasSelection
                ? 'text-muted ring-line hover:bg-panel2 hover:text-ink'
                : 'cursor-not-allowed text-faint ring-lineSoft opacity-50',
            )}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-jade" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {copied ? '已复制' : '复制'}
            </span>
          </button>
          <button
            type="button"
            onClick={clearChecked}
            disabled={!hasSelection}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium ring-1 ring-inset transition-colors',
              hasSelection
                ? 'text-ember/80 ring-ember/20 hover:bg-ember/10'
                : 'cursor-not-allowed text-faint ring-lineSoft opacity-50',
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">清空</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {hasSelection ? (
          <div className="space-y-4">
            {TYPE_ORDER.map((t) => (
              <Group key={t} type={t} nodes={grouped[t]} permStates={permStates} />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-panel2 ring-1 ring-inset ring-line">
              <ShieldCheck className="h-5 w-5 text-faint" strokeWidth={1.6} />
            </div>
            <p className="text-[12px] text-muted">尚未勾选任何节点</p>
            <p className="font-mono text-[10px] text-faint">
              勾选部门将自动联动其下全部子节点
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-lineSoft px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
            覆盖员工
          </span>
          <span className="tnum font-mono text-[12px] text-jade-soft">
            {covered} 人
          </span>
        </div>
        {hasSelection && (
          <div className="mt-2 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
              权限分布
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-faint" />
                读取 {permSummary.read}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-amber-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                写入 {permSummary.write}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-jade">
                <span className="h-1.5 w-1.5 rounded-full bg-jade" />
                管理 {permSummary.admin}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
