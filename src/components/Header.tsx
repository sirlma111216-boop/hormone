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
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
        {/* 좌: 로고/제목 */}
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

        {/* 우: (위) labbitory 버튼 → (아래) 진행률 + 처음부터 */}
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <a
            href="https://labbitory.com/grade3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 self-end rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            🧫 labbitory.com <span aria-hidden>↗</span>
          </a>

          <div className="flex items-center gap-3">
            <div className="min-w-[160px] flex-1">
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

            <button
              onClick={reset}
              className="shrink-0 rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-xs font-semibold text-[#374151] transition hover:border-[#111111] hover:bg-[#f5f5f5]"
            >
              ↺ 처음부터
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
