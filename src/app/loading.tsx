export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-background/60 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 blur-xl rounded-full bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 animate-pulse" />
        <div className="relative w-14 h-14 rounded-2xl border-2 border-transparent bg-gradient-to-br from-blue-600 to-purple-600 p-[2px] shadow-2xl">
          <div className="w-full h-full rounded-[0.6rem] bg-background grid place-items-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    </div>
  )
}


