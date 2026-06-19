import { ChevronRight } from 'lucide-react'
import type { TreeNode } from '@shared/types'
import { useTreeCtx } from './treeContext'
import { NodeCheckbox } from './NodeCheckbox'
import { NodeIcon } from './NodeIcon'
import { TypeBadge } from './TypeBadge'
import { Highlight } from './Highlight'
import { PermDropdown } from './PermDropdown'
import { NODE_VISUAL } from '@/lib/nodeVisual'
import { cn } from '@/lib/utils'

export function TreeNodeRow({ node }: { node: TreeNode }) {
  const {
    states,
    permStates,
    query,
    visibleIds,
    matchedIds,
    expanded,
    isSearching,
    onToggleCheck,
    onToggleExpand,
    onSetPermission,
    onUnlockPermission,
    onResetPermission,
  } = useTreeCtx()

  const visible = visibleIds ? visibleIds.has(node.id) : true
  if (!visible) return null

  const hasChildren = node.children.length > 0
  const isExpanded = expanded.has(node.id)
  const state = states.get(node.id) ?? 'unchecked'
  const permState = permStates.get(node.id)
  const v = NODE_VISUAL[node.nodeType]
  const isMatched = matchedIds.has(node.id)
  const showPerm = state !== 'unchecked' && permState

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-2 rounded-lg px-2 py-[7px] transition-colors',
          isMatched ? 'bg-amber/[0.06]' : 'hover:bg-panel2',
        )}
      >
        <button
          type="button"
          onClick={() => hasChildren && onToggleExpand(node.id)}
          disabled={!hasChildren}
          aria-label={isExpanded ? '折叠' : '展开'}
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors',
            hasChildren ? 'cursor-pointer text-faint hover:text-ink' : 'opacity-0',
          )}
        >
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200',
              isExpanded && 'rotate-90',
            )}
            strokeWidth={2.2}
          />
        </button>

        <NodeCheckbox
          state={state}
          accent={v.accent}
          onChange={() => onToggleCheck(node.id)}
        />

        <NodeIcon type={node.nodeType} />

        <span className="min-w-0 max-w-[280px] truncate text-[13px] font-medium text-ink">
          <Highlight text={node.name} query={isSearching ? query : ''} />
        </span>

        {node.code && (
          <span className="hidden shrink-0 font-mono text-[11px] text-faint sm:inline">
            {node.code}
          </span>
        )}
        {node.title && (
          <span className="hidden shrink-0 truncate text-[11px] italic text-muted md:inline">
            {node.title}
          </span>
        )}

        <span className="ml-auto shrink-0">
          <TypeBadge type={node.nodeType} />
        </span>

        {showPerm && permState && (
          <div className="shrink-0 pl-1">
            <PermDropdown
              state={permState}
              accent={v.accent}
              onSelect={(level) => onSetPermission(node.id, level, true)}
              onUnlock={() => onUnlockPermission(node.id)}
              onReset={() => onResetPermission(node.id)}
            />
          </div>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-children pl-5">
          {node.children.map((child) => (
            <TreeNodeRow key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  )
}
