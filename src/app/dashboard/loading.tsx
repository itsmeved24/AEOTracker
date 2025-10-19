export default function DashboardLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="h-10 w-48 rounded-xl bg-muted/50 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-card/60 border border-border shadow-sm h-40 animate-pulse" />
        ))}
      </div>
    </div>
  )
}


