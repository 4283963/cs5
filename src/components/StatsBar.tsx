import { useMemo } from 'react'
import { useTreeStore } from '@/store/treeStore'
import {
  computeCheckStates,
  getEffectiveChecked,
  countCoveredEmployees,
} from '@/lib/treeUtils'
import { cn } from '@/lib/utils'

interface StatTileProps {
  label: string
  value: number
  accent?: boolean
  hint?: string
}

function StatTile({ label, value, accent, hint }: StatTileProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border px-4 py-3.5 shadow-panel',
        accent && value > 0
          ? 'border-jade/30 bg-jade/[0.06]'
          : 'border-line bg-panel/70',
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          {label}
        </span>
        {accent && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              value > 0 ? 'bg-jade animate-pulseDot' : 'bg-line',
            )}
          />
        )}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span
          className={cn(
            'tnum font-serif text-[34px] leading-none',
            accent && value > 0 ? 'text-jade-soft' : 'text-ink',
          )}
        >
          {value}
        </span>
        {hint && (
          <span className="font-mono text-[10px] text-faint">{hint}</span>
        )}
      </div>
    </div>
  )
}

export function StatsBar() {
  const flat = useTreeStore((s) => s.flat)
  const checked = useTreeStore((s) => s.checked)

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

  if (!flat) return null

  const deptCount = flat.counts.department + flat.counts.sub_department

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatTile label="节点总数" value={flat.total} />
      <StatTile label="部门" value={deptCount} hint="含子部门" />
      <StatTile label="小组" value={flat.counts.team} />
      <StatTile label="员工" value={flat.counts.employee} />
      <StatTile
        label="已勾选"
        value={effective.length}
        accent
        hint={`覆盖 ${covered} 人`}
      />
    </div>
  )
}
