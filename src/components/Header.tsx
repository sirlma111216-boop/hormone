import { useProgress } from '../store'

export function Header({ onHome }: { onHome: () => void }) {
  const { completedCount, totalActivities, resetAll } = useProgress()
  const pct = Math.round((completedCount / totalActivities) * 100)

  const reset = () => {
    if (confirm('정말 처음부터 다시 시작할까요? 저장된 진행 상황이 모두 지워집니다.')) {
      resetAll()
      onHome()
    }
  }

  return (
    <header className="no-print sticky top-0 z-20 border-b border-[#e5e7eb] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 sm:px-6">
        <button onClick={onHome} className="flex items-center gap-2 text-left">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#111111] text-sm text-white">
            🧪
          </span>
          <span>
            <span className="font-display block text-[15px] font-semibold leading-tight text-[#111111] sm:text-base">
              몸속 균형 조절 실험실
            </span>
            <span className="block text-[11px] text-[#6b7280]">
              항상성과 호르몬 · 몸속 균형 관제사
            </span>
          </span>
        </button>

        <div className="ml-auto flex min-w-[180px] flex-1 items-center gap-3 sm:max-w-xs">
          <div className="flex-1">
            <div className="mb-1 flex justify-between text-[11px] font-medium text-[#6b7280]">
              <span>전체 진행률</span>
              <span className="text-[#111111]">
                {completedCount}/{totalActivities} · {pct}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#f5f5f5]">
              <div
                className="h-2 rounded-full bg-[#111111] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={reset}
          className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-xs font-semibold text-[#374151] transition hover:border-[#111111] hover:bg-[#f5f5f5]"
        >
          ↺ 처음부터
        </button>
      </div>
    </header>
  )
}
