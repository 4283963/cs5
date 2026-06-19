export function TreeSkeleton() {
  return (
    <div className="space-y-1 py-3">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-2 px-2 py-1.5"
          style={{ paddingLeft: `${8 + (i % 4) * 20}px` }}
        >
          <div className="h-[15px] w-[15px] rounded-[4px] bg-panel2" />
          <div className="h-6 w-6 rounded-md bg-panel2" />
          <div
            className="h-3 rounded bg-panel2"
            style={{ width: `${70 + ((i * 37) % 110)}px` }}
          />
          <div className="ml-auto h-3 w-10 rounded bg-panel2/60" />
        </div>
      ))}
    </div>
  )
}
