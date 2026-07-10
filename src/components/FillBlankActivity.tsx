import { useState } from 'react'
import { Feedback } from './ui'

/**
 * 빈칸 채우기 — 긴 글 없이 보기 칩을 눌러 채운다.
 */
export function FillBlankActivity({
  before,
  after,
  options,
  answer,
  hint,
  onSolved,
  solved: solvedProp,
}: {
  before: string
  after: string
  options: string[]
  answer: string
  hint?: string
  onSolved: () => void
  solved?: boolean
}) {
  const [solved, setSolved] = useState(!!solvedProp)
  const [wrong, setWrong] = useState<string | null>(null)
  const [shake, setShake] = useState<string | null>(null)

  const pick = (o: string) => {
    if (solved) return
    if (o === answer) {
      setSolved(true)
      setWrong(null)
      onSolved()
    } else {
      setWrong(o)
      setShake(o)
      setTimeout(() => setShake(null), 450)
    }
  }

  return (
    <div>
      <p className="mb-3 text-base leading-8 text-slate-800">
        {before}
        <span
          className={
            'mx-1 inline-flex min-w-[64px] justify-center rounded-lg px-2 py-0.5 font-extrabold ' +
            (solved
              ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
              : 'bg-amber-100 text-amber-600 ring-1 ring-amber-300')
          }
        >
          {solved ? answer : '____'}
        </span>
        {after}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => pick(o)}
            disabled={solved}
            className={
              'rounded-xl border px-4 py-2 text-sm font-semibold transition active:scale-95 ' +
              (shake === o ? 'animate-shake ' : '') +
              (solved && o === answer
                ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : !solved && wrong === o
                  ? 'border-orange-400 bg-orange-50 text-orange-700'
                  : solved
                    ? 'border-slate-200 bg-slate-50 text-slate-400'
                    : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md')
            }
          >
            {o}
          </button>
        ))}
      </div>
      {!solved && wrong && hint && <Feedback type="hint">{hint}</Feedback>}
      {solved && <Feedback type="success">빈칸을 완성했어요!</Feedback>}
    </div>
  )
}
