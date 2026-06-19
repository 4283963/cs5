import { Lock, Unlock, RotateCcw, Shield } from 'lucide-react'
import { PERMISSION_LABEL, type PermissionLevel } from '@shared/types'
import { type PermState } from '@/lib/treeUtils'
import { cn } from '@/lib/utils'

interface Props {
  state: PermState
  onSelect: (level: PermissionLevel) => void
  onUnlock: () => void
  onReset: () => void
  accent?: 'jade' | 'amber'
}

const LEVEL_COLORS: Record<PermissionLevel, string> = {
  read: 'text-muted',
  write: 'text-amber-soft',
  admin: 'text-jade',
}

export function PermDropdown({ state, onSelect, onUnlock, onReset, accent = 'jade' }: Props) {
  const disabled = state.isInherited

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          'group relative flex items-center gap-1.5 rounded-md px-2 py-0.5 ring-1 ring-inset transition-colors',
          disabled
            ? 'bg-panel2/60 ring-line/60'
            : accent === 'amber'
              ? 'bg-amber/5 ring-amber/30 hover:bg-amber/10'
              : 'bg-jade/5 ring-jade/30 hover:bg-jade/10',
        )}
      >
        <Shield
          className={cn(
            'h-3 w-3',
            disabled ? 'text-faint' : LEVEL_COLORS[state.level],
          )}
        />
        <select
          value={state.level}
          disabled={disabled}
          onChange={(e) => onSelect(e.target.value as PermissionLevel)}
          className={cn(
            'cursor-pointer appearance-none bg-transparent py-0.5 pr-4 text-[11px] font-medium outline-none',
            disabled ? 'text-faint cursor-not-allowed' : 'text-ink',
          )}
          aria-label="权限级别"
        >
          {(['read', 'write', 'admin'] as PermissionLevel[]).map((lvl) => (
            <option key={lvl} value={lvl}>
              {PERMISSION_LABEL[lvl]}
            </option>
          ))}
        </select>
        {disabled && (
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2">
            <Lock className="h-3 w-3 text-faint" />
          </span>
        )}
      </div>

      {state.isInherited ? (
        <button
          type="button"
          onClick={onUnlock}
          className="flex h-6 w-6 items-center justify-center rounded-md text-faint ring-1 ring-inset ring-line/60 transition-colors hover:text-ink hover:ring-line"
          title="解锁，单独设置该节点权限"
        >
          <Unlock className="h-3 w-3" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onReset}
          className="flex h-6 w-6 items-center justify-center rounded-md text-faint ring-1 ring-inset ring-line/60 transition-colors hover:text-ink hover:ring-line"
          title="重置为继承父节点权限"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
