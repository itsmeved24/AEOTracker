export default function ProjectLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-10 w-72 rounded-xl bg-muted/50 mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-card/60 border border-border shadow-sm animate-pulse" />
        ))}
      </div>
      <div className="rounded-2xl bg-card/60 border border-border shadow-sm h-96 animate-pulse" />
    </div>
  )
}


