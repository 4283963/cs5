import { NODE_TYPE_LABEL, type NodeType } from '@shared/types'
import { NODE_VISUAL } from '@/lib/nodeVisual'
import { cn } from '@/lib/utils'

export function TypeBadge({ type }: { type: NodeType }) {
  const v = NODE_VISUAL[type]
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 font-mono text-[10px] leading-none',
        v.badge,
      )}
    >
      {NODE_TYPE_LABEL[type]}
    </span>
  )
}
