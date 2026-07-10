import type { SectionMeta } from '../types'
import { useProgress } from '../store'

export function SectionDashboard({
  section,
  onOpenActivity,
  onPrint,
}: {
  section: SectionMeta
  onOpenActivity: (id: string) => void
  onPrint: (sectionId: string) => void
}) {
  const { isDone, isSectionUnlocked, isSectionComplete } = useProgress()
  const unlocked = isSectionUnlocked(section.order)
  const complete = isSectionComplete(section.id)
  const doneCount = section.activities.filter((a) => isDone(a.id)).length

  return (
    <section
      className={
        'rounded-xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e5e7eb] ' +
        (!unlocked ? 'opacity-70' : '')
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#111111] px-2.5 py-0.5 text-xs font-semibold text-white">
              구역 {section.order}
            </span>
            {complete && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                ✓ 완료
              </span>
            )}
            {!unlocked && (
              <span className="rounded-full bg-[#f5f5f5] px-2.5 py-0.5 text-xs font-semibold text-[#898989]">
                🔒 앞 구역 완료 시 열림
              </span>
            )}
          </div>
          <h2 className="font-display mt-2 text-2xl font-semibold text-[#111111]">{section.title}</h2>
        </div>
        <div className="text-right text-xs font-semibold text-[#6b7280]">
          {doneCount}/{section.activities.length}
        </div>
      </div>

      {/* 학습 목표 */}
      <ul className="mt-2 space-y-0.5 text-[13px] text-[#6b7280]">
        {section.goal.map((g) => (
          <li key={g}>🎯 {g}</li>
        ))}
      </ul>

      {/* 진행 바 */}
      <div className="mt-4 h-1.5 w-full rounded-full bg-[#f5f5f5]">
        <div
          className="h-1.5 rounded-full bg-[#111111] transition-all"
          style={{ width: `${(doneCount / section.activities.length) * 100}%` }}
        />
      </div>

      {/* 활동 카드 */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {section.activities.map((a) => {
          const d = isDone(a.id)
          return (
            <button
              key={a.id}
              disabled={!unlocked}
              onClick={() => onOpenActivity(a.id)}
              className={
                'flex items-center gap-3 rounded-xl border p-4 text-left transition active:scale-[0.99] ' +
                (!unlocked
                  ? 'cursor-not-allowed border-[#f3f4f6] bg-[#f8f9fa]'
                  : d
                    ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300'
                    : 'border-[#e5e7eb] bg-[#f5f5f5] hover:border-[#111111] hover:bg-white')
              }
            >
              <span className="text-2xl" aria-hidden>{a.icon}</span>
              <span className="flex-1">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#111111]">
                  {a.title}
                  {d && <span className="text-emerald-500" aria-label="완료">✓</span>}
                </span>
                <span className="block text-xs text-[#6b7280]">{a.subtitle}</span>
              </span>
              <span className="text-xs font-semibold text-[#111111]">{d ? '다시 보기' : '시작 ▶'}</span>
            </button>
          )
        })}
      </div>

      {/* 인쇄 버튼 */}
      <div className="mt-5">
        <button
          disabled={!complete}
          onClick={() => onPrint(section.id)}
          className={
            'w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition ' +
            (complete
              ? 'bg-[#111111] text-white hover:bg-[#242424]'
              : 'cursor-not-allowed bg-[#e5e7eb] text-[#898989]')
          }
        >
          🖨️ 원노트 기록용 정리본 인쇄하기
          {!complete && <span className="ml-1 text-xs">(모든 활동 완료 시 열림)</span>}
        </button>
      </div>
    </section>
  )
}
