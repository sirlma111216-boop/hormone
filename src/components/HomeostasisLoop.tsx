/**
 * 항상성 되돌림 화살표 고리: 벗어남 → 감지 → 조절 → 회복
 * lit 개수만큼 단계에 불이 들어온다.
 */
const STAGES = [
  { key: 'out', label: '정상에서 벗어남', icon: '⚠️' },
  { key: 'sense', label: '감지', icon: '👁️' },
  { key: 'control', label: '조절 작용', icon: '⚙️' },
  { key: 'recover', label: '정상으로 회복', icon: '✅' },
]

export function HomeostasisLoop({ lit = 0 }: { lit?: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
      {STAGES.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div
            className={
              'flex min-w-[92px] flex-col items-center gap-1 rounded-xl border px-3 py-2 text-center transition ' +
              (i < lit
                ? 'animate-pop border-emerald-400 bg-emerald-100 text-emerald-800 shadow'
                : 'border-slate-200 bg-white text-slate-400')
            }
          >
            <span className="text-lg" aria-hidden>
              {s.icon}
            </span>
            <span className="text-xs font-bold">{s.label}</span>
          </div>
          {i < STAGES.length - 1 && (
            <span
              aria-hidden
              className={i < lit ? 'text-emerald-500' : 'text-slate-300'}
            >
              ➜
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
