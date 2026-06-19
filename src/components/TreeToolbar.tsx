import {
  ChevronsDownUp,
  ChevronsUpDown,
  CheckCheck,
  Eraser,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useTreeStore } from '@/store/treeStore'
import { cn } from '@/lib/utils'

interface ToolButtonProps {
  onClick: () => void
  icon: LucideIcon
  label: string
  accent?: boolean
}

function ToolButton({ onClick, icon: Icon, label, accent }: ToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium ring-1 ring-inset transition-colors',
        accent
          ? 'text-jade ring-jade/25 hover:bg-jade/10'
          : 'text-muted ring-line hover:bg-panel2 hover:text-ink',
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

export function TreeToolbar() {
  const query = useTreeStore((s) => s.query)
  const setQuery = useTreeStore((s) => s.setQuery)
  const expandAll = useTreeStore((s) => s.expandAll)
  const collapseAll = useTreeStore((s) => s.collapseAll)
  const checkAll = useTreeStore((s) => s.checkAll)
  const clearChecked = useTreeStore((s) => s.clearChecked)

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-lineSoft px-3 py-2.5">
      <div className="relative min-w-[180px] flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索 部门 / 小组 / 员工 / 编码"
          className="h-8 w-full rounded-lg bg-panel2 pl-8 pr-7 font-mono text-[12px] text-ink placeholder:text-faint ring-1 ring-inset ring-line transition-shadow focus:outline-none focus:ring-jade/40"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-ink"
            aria-label="清除搜索"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <ToolButton onClick={expandAll} icon={ChevronsUpDown} label="展开" />
        <ToolButton onClick={collapseAll} icon={ChevronsDownUp} label="折叠" />
        <span className="mx-1 h-4 w-px bg-line" />
        <ToolButton onClick={checkAll} icon={CheckCheck} label="全选" accent />
        <ToolButton onClick={clearChecked} icon={Eraser} label="清空" />
      </div>
    </div>
  )
}
