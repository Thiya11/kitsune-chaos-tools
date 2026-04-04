export function ToolSkeleton() {
  return (
    <div className="flex min-h-screen animate-pulse flex-col bg-zinc-950">
      {/* Header skeleton */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="h-5 w-24 rounded bg-zinc-800" />
          <div className="h-5 w-48 rounded bg-zinc-800" />
        </div>
      </div>
      {/* Body skeleton */}
      <div className="flex flex-1">
        <div className="w-80 border-r border-zinc-800 p-5 space-y-4">
          <div className="h-32 rounded-xl bg-zinc-800/50" />
          <div className="h-48 rounded-xl bg-zinc-800/50" />
          <div className="h-24 rounded-xl bg-zinc-800/50" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="h-80 w-full max-w-lg rounded-xl bg-zinc-800/30" />
        </div>
      </div>
    </div>
  )
}
