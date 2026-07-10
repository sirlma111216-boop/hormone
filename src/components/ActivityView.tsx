import { useEffect, useState } from 'react'
import { SECTIONS, ALL_ACTIVITY_IDS, getSection } from '../data/sections'
import { useProgress } from '../store'
import { ACTIVITY_COMPONENTS } from './registry'
import { Panel } from './ui'
import { TextbookViewer } from './TextbookViewer'
import { TEXTBOOK_IMAGES } from '../data/textbook'

export function ActivityView({
  activityId,
  onHome,
  onOpenActivity,
}: {
  activityId: string
  onHome: () => void
  onOpenActivity: (id: string) => void
}) {
  const { isDone, completeActivity } = useProgress()
  const meta = SECTIONS.flatMap((s) => s.activities).find((a) => a.id === activityId)!
  const section = getSection(meta.section)
  const Comp = ACTIVITY_COMPONENTS[activityId]
  const done = isDone(activityId)

  const idx = ALL_ACTIVITY_IDS.indexOf(activityId)
  const nextId = ALL_ACTIVITY_IDS[idx + 1]
  const nextMeta = nextId
    ? SECTIONS.flatMap((s) => s.activities).find((a) => a.id === nextId)
    : undefined
  const nextInSameSection = nextMeta && nextMeta.section === meta.section

  const [showTextbook, setShowTextbook] = useState(false)
  const textbookImages = TEXTBOOK_IMAGES[meta.section]

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [activityId])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onHome}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#111111] hover:underline"
        >
          ← 미션 대시보드로
        </button>
        {textbookImages.length > 0 && (
          <button
            onClick={() => setShowTextbook(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3.5 py-2 text-sm font-semibold text-[#111111] transition hover:border-[#111111] hover:bg-[#f5f5f5] active:scale-[0.98]"
          >
            📖 교과서 확인하기
          </button>
        )}
      </div>

      <Panel className="p-6 sm:p-8">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-medium text-[#6b7280]">
          <span>{section.title}</span>
          <span className="text-[#d1d5db]">|</span>
          <span>활동 {activityId}</span>
          {done && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 ring-1 ring-emerald-200">
              ✓ 완료
            </span>
          )}
        </div>
        <h1 className="font-display mb-1 flex items-center gap-2 text-2xl font-semibold text-[#111111]">
          <span aria-hidden>{meta.icon}</span> {meta.title}
        </h1>
        <p className="mb-5 text-sm text-[#6b7280]">{meta.subtitle}</p>

        <p className="mb-5 rounded-lg bg-[#f8f9fa] px-3.5 py-2.5 text-xs text-[#6b7280] ring-1 ring-[#f3f4f6]">
          💡 카드는 <b className="text-[#374151]">클릭(터치)해서 선택 → 자리를 클릭</b>해 배치할 수 있어요. 색뿐 아니라 아이콘·문구로도
          정답/오답을 알려줘요.
        </p>

        <Comp onDone={() => completeActivity(activityId)} done={done} />

        {done && (
          <div className="animate-pop mt-6 flex flex-wrap items-center gap-3 border-t border-[#f3f4f6] pt-5">
            <span className="text-sm font-semibold text-emerald-600">🏅 활동 완료!</span>
            {nextInSameSection ? (
              <button
                onClick={() => onOpenActivity(nextId!)}
                className="rounded-lg bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#242424] active:scale-95"
              >
                다음 활동: {nextMeta!.title} →
              </button>
            ) : (
              <button
                onClick={onHome}
                className="rounded-lg bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#242424] active:scale-95"
              >
                대시보드로 돌아가기 →
              </button>
            )}
          </div>
        )}
      </Panel>

      {showTextbook && (
        <TextbookViewer
          images={textbookImages}
          title={`${section.title} 교과서`}
          onClose={() => setShowTextbook(false)}
        />
      )}
    </div>
  )
}
