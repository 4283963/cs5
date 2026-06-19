import { useEffect, useRef } from 'react'
import type { CheckState } from '@/lib/treeUtils'
import type { Accent } from '@/lib/nodeVisual'
import { cn } from '@/lib/utils'

interface Props {
  state: CheckState
  accent: Accent
  onChange: () => void
}

export function NodeCheckbox({ state, accent, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = state === 'indeterminate'
    }
  }, [state])

  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        'h-[15px] w-[15px] shrink-0 rounded-[4px]',
        accent === 'amber' ? 'amber-check' : 'jade-check',
      )}
      checked={state === 'checked'}
      onChange={onChange}
      aria-label="选择该节点"
    />
  )
}
