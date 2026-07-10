import { useState } from 'react'
import { SECTIONS } from './data/sections'
import { Header } from './components/Header'
import { IntroScreen } from './components/IntroScreen'
import { SectionDashboard } from './components/SectionDashboard'
import { ActivityView } from './components/ActivityView'
import { PrintSummary, PrintPreview } from './components/PrintSummary'

type View = { type: 'home' } | { type: 'activity'; id: string }

export default function App() {
  const [view, setView] = useState<View>({ type: 'home' })
  const [printTarget, setPrintTarget] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const goHome = () => setView({ type: 'home' })
  const openActivity = (id: string) => setView({ type: 'activity', id })

  const requestPrint = (target: string) => {
    setPrintTarget(target)
    setShowModal(true)
  }
  const doPrint = () => {
    setShowModal(false)
    window.setTimeout(() => window.print(), 80)
  }

  return (
    <div className="min-h-screen">
      <Header onHome={goHome} />

      <main className="no-print">
        {view.type === 'home' ? (
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <IntroScreen onGoSection1={() => openActivity('1-1')} />

            <div className="mt-4 grid gap-6">
              {SECTIONS.map((s) => (
                <SectionDashboard
                  key={s.id}
                  section={s}
                  onOpenActivity={openActivity}
                  onPrint={requestPrint}
                />
              ))}
            </div>
          </div>
        ) : (
          <ActivityView
            activityId={view.id}
            onHome={goHome}
            onOpenActivity={openActivity}
          />
        )}
      </main>

      {/* 정리본 미리보기 + 인쇄 모달 */}
      {showModal && (
        <div className="no-print fixed inset-0 z-40 flex items-stretch justify-center bg-black/50 p-2 sm:items-center sm:p-6">
          <div className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-[#e5e7eb]">
            {/* 헤더 */}
            <div className="flex items-center justify-between gap-2 border-b border-[#e5e7eb] px-4 py-3 sm:px-5">
              <h3 className="font-display flex items-center gap-2 text-base font-semibold text-[#111111]">
                <span aria-hidden>📄</span> 정리본 미리보기
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={doPrint}
                  className="rounded-lg bg-[#111111] px-4 py-2 text-sm font-semibold text-white hover:bg-[#242424] active:scale-95"
                >
                  🖨️ 인쇄하기
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm font-semibold text-[#374151] hover:border-[#111111] hover:bg-[#f5f5f5]"
                >
                  ✕ 닫기
                </button>
              </div>
            </div>

            {/* 미리보기 본문 */}
            <div className="flex-1 overflow-y-auto bg-[#f1f3f5] p-3 sm:p-6">
              <div className="mx-auto max-w-2xl">
                <PrintPreview target={printTarget} />
              </div>
            </div>

            {/* 안내 */}
            <div className="border-t border-[#e5e7eb] px-4 py-2.5 text-xs text-[#6b7280] sm:px-5">
              🖨️ <b>인쇄하기</b>를 누르면 인쇄 창이 열려요. <b>프린터</b> 또는 <b>OneNote로 보내기</b>를
              선택하면 됩니다. (위 미리보기 그대로 인쇄됩니다.)
            </div>
          </div>
        </div>
      )}

      {/* 인쇄 전용 영역 (화면 숨김, 인쇄 시에만 표시) */}
      <PrintSummary target={printTarget} />
    </div>
  )
}
