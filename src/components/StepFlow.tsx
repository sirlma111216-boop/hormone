import { useState, type ReactNode } from 'react'

export interface Step {
  title: string
  hint?: string // 단계 안내(짧게)
  render: (onSolved: () => void, done: boolean) => ReactNode
}

/**
 * 여러 단계를 순서대로 여는 흐름. 이전 단계를 풀어야 다음 단계가 열린다.
 * 마지막 단계까지 풀면 onAllDone 호출 → 활동 완료.
 */
export function StepFlow({
  steps,
  onAllDone,
  initiallyComplete = false,
}: {
  steps: Step[]
  onAllDone: () => void
  initiallyComplete?: boolean
}) {
  const [cur, setCur] = useState(initiallyComplete ? steps.length : 0)

  const solveStep = (i: number) => {
    if (i !== cur) return
    const next = i + 1
    setCur(next)
    if (next >= steps.length) onAllDone()
  }

  return (
    <ol className="space-y-4">
      {steps.map((s, i) => {
        const locked = i > cur
        const done = i < cur
        if (locked) {
          return (
            <li
              key={i}
              className="flex items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-400"
            >
              <span aria-hidden>🔒</span>
              <span className="font-semibold">{i + 1}. {s.title}</span>
              <span className="text-xs">— 앞 단계를 완료하면 열려요</span>
            </li>
          )
        }
        return (
          <li
            key={i}
            className={
              'rounded-2xl border p-4 ' +
              (done ? 'border-emerald-200 bg-emerald-50/40' : 'border-[#e5e7eb] bg-white')
            }
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold text-white ' +
                  (done ? 'bg-emerald-500' : 'bg-[#111111]')
                }
              >
                {done ? '✓' : i + 1}
              </span>
              <span className="text-sm font-extrabold text-slate-800">{s.title}</span>
            </div>
            {s.hint && !done && (
              <p className="mb-3 text-xs text-slate-500">{s.hint}</p>
            )}
            {s.render(() => solveStep(i), done)}
          </li>
        )
      })}
    </ol>
  )
}
