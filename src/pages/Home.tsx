import { useEffect } from 'react'
import { Database, RefreshCw, Network } from 'lucide-react'
import { useTreeStore } from '@/store/treeStore'
import { StatsBar } from '@/components/StatsBar'
import { TreeToolbar } from '@/components/TreeToolbar'
import { PermissionTree } from '@/components/PermissionTree'
import { SelectionPanel } from '@/components/SelectionPanel'
import { cn } from '@/lib/utils'

function DbStatusPill({ mode }: { mode: string }) {
  const isMysql = mode === 'mysql'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] ring-1 ring-inset',
        isMysql
          ? 'bg-jade/10 text-jade-soft ring-jade/25'
          : 'bg-amber/10 text-amber-soft ring-amber/25',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isMysql ? 'bg-jade animate-pulseDot' : 'bg-amber',
        )}
      />
      {isMysql ? 'MySQL' : mode === 'mock' ? '内存模式' : '连接中'}
    </span>
  )
}

function Header({
  dbMode,
  onRefresh,
  refreshing,
}: {
  dbMode: string
  onRefresh: () => void
  refreshing: boolean
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jade/10 ring-1 ring-inset ring-jade/30">
          <Network className="h-5 w-5 text-jade" strokeWidth={1.8} />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            ORG · ACCESS CONTROL
          </p>
          <h1 className="font-serif text-[40px] leading-none text-ink">
            组织权限树
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">
            无限层级嵌套 · 父子联动勾选 · 实时选中统计
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DbStatusPill mode={dbMode} />
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg bg-panel2 px-3 py-1.5 text-[12px] font-medium text-muted ring-1 ring-inset ring-line transition-colors hover:text-ink disabled:opacity-50"
        >
          <RefreshCw
            className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')}
          />
          <span className="hidden sm:inline">刷新</span>
        </button>
      </div>
    </header>
  )
}

export default function Home() {
  const load = useTreeStore((s) => s.load)
  const status = useTreeStore((s) => s.status)
  const dbMode = useTreeStore((s) => s.dbMode)

  useEffect(() => {
    void load()
  }, [load])

  const refreshing = status === 'loading'

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Header dbMode={dbMode} onRefresh={() => void load()} refreshing={refreshing} />

      <div className="mt-6">
        <StatsBar />
      </div>

      <main className="mt-5 grid gap-5 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="flex h-[72vh] min-h-[460px] flex-col overflow-hidden rounded-2xl border border-line bg-panel/60 shadow-panel lg:h-[660px]">
            <TreeToolbar />
            <div className="relative flex-1 overflow-y-auto px-2 pb-4">
              <PermissionTree />
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="h-[72vh] min-h-[460px] lg:h-[660px]">
            <SelectionPanel />
          </div>
        </aside>
      </main>

      <footer className="mt-6 flex items-center justify-between gap-2 border-t border-lineSoft pt-4">
        <p className="font-mono text-[10px] text-faint">
          GET /api/auth/tree · 递归构建无限层级组织架构
        </p>
        <p className="flex items-center gap-1.5 font-mono text-[10px] text-faint">
          <Database className="h-3 w-3" />
          org_nodes · parent_id 自引用
        </p>
      </footer>
    </div>
  )
}
