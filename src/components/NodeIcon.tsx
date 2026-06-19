import type { NodeType } from '@shared/types'
import { NODE_VISUAL } from '@/lib/nodeVisual'
import { cn } from '@/lib/utils'

export function NodeIcon({ type }: { type: NodeType }) {
  const v = NODE_VISUAL[type]
  const Icon = v.icon
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-panel2 ring-1 ring-inset ring-lineSoft">
      <Icon className={cn('h-3.5 w-3.5', v.iconColor)} strokeWidth={1.75} />
    </span>
  )
}
