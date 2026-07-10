import { NerveHormoneFallback } from './diagrams'
import { ImageOrFallback } from './ui'

/** 신경·호르몬 비교 참고 도식(활동 1-3 상단) */
export function NerveHormoneNote() {
  return (
    <div className="mb-4">
      <ImageOrFallback
        src="/assets/hormone_vs_nerve.png"
        alt="호르몬과 신경 작용 비교"
        fallback={<NerveHormoneFallback />}
      />
    </div>
  )
}

/** 작은 참고 문구 박스 */
export function RefNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
      <span aria-hidden>📎</span> {children}
    </p>
  )
}
