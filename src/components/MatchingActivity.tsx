import { useMemo, useState } from 'react'
import { shuffle } from '../lib/util'
import { Feedback, HintBox } from './ui'

export interface MatchPair {
  id: string
  left: string
  right: string
}

/**
 * 두 열 짝 맞추기 (터치/마우스/키보드) — "호르몬 도감 완성" 테마.
 * 왼쪽 카드를 누르고 → 오른쪽 카드를 누르면 연결된다. 맞으면 한 세트로 완성.
 */
export function MatchingActivity({
  pairs,
  leftTitle,
  rightTitle,
  hints = [],
  onSolved,
  solved: solvedProp,
}: {
  pairs: MatchPair[]
  leftTitle: string
  rightTitle: string
  hints?: string[]
  onSolved: () => void
  solved?: boolean
}) {
  const lefts = useMemo(() => shuffle(pairs), [pairs])
  const rights = useMemo(() => shuffle(pairs), [pairs])
  const [matched, setMatched] = useState<Record<string, boolean>>({})
  const [selLeft, setSelLeft] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [shake, setShake] = useState<string | null>(null)
  const [pop, setPop] = useState<string | null>(null)
  const [solved, setSolved] = useState(!!solvedProp)

  const matchedCount = solved ? pairs.length : Object.keys(matched).length

  const tryMatch = (rightId: string) => {
    if (!selLeft || solved) return
    if (selLeft === rightId) {
      const next = { ...matched, [rightId]: true }
      setMatched(next)
      setSelLeft(null)
      setPop(rightId)
      setTimeout(() => setPop(null), 350)
      if (Object.keys(next).length === pairs.length) {
        setSolved(true)
        onSolved()
      }
    } else {
      setAttempt((a) => a + 1)
      setShake(rightId)
      setTimeout(() => setShake(null), 450)
    }
  }

  const btn = (base: string) =>
    'w-full rounded-xl border px-3 py-3 text-sm font-medium text-left transition active:scale-[0.98] ' + base

  return (
    <div>
      {/* 상단 안내 + 도감 진행률 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-violet-50 px-4 py-2.5 ring-1 ring-violet-200">
        <p className="text-sm font-bold text-violet-900">
          {solved
            ? '📇 호르몬 도감을 완성했어요!'
            : selLeft
              ? '② 오른쪽에서 알맞은 기능을 골라 연결하세요'
              : '① 왼쪽에서 카드를 먼저 고르세요'}
        </p>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-violet-700 ring-1 ring-violet-200">
            📇 도감 {matchedCount} / {pairs.length}
          </span>
          <div className="hidden h-2 w-24 overflow-hidden rounded-full bg-white ring-1 ring-violet-200 sm:block">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
              style={{ width: `${(matchedCount / pairs.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1.5 text-xs font-bold text-slate-500">{leftTitle}</p>
          <div className="grid gap-2">
            {lefts.map((p) => {
              const done = matched[p.id]
              const sel = selLeft === p.id
              return (
                <button
                  key={p.id}
                  disabled={done || solved}
                  onClick={() => setSelLeft(sel ? null : p.id)}
                  className={btn(
                    done
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                      : sel
                        ? 'border-violet-500 bg-violet-100 text-violet-900 ring-2 ring-violet-300 shadow-md scale-[1.02]'
                        : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md',
                  )}
                >
                  {done ? (
                    <span aria-hidden className="mr-1">✓</span>
                  ) : (
                    <span aria-hidden className="mr-1 text-violet-400">{sel ? '👉' : '📇'}</span>
                  )}
                  {p.left}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-bold text-slate-500">{rightTitle}</p>
          <div className="grid gap-2">
            {rights.map((p) => {
              const done = matched[p.id]
              return (
                <button
                  key={p.id}
                  disabled={done || solved}
                  onClick={() => tryMatch(p.id)}
                  className={
                    btn(
                      done
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                        : selLeft
                          ? 'border-violet-300 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-violet-500 hover:bg-violet-50 hover:shadow-md'
                          : 'border-slate-200 bg-white text-slate-500 shadow-sm',
                    ) +
                    (shake === p.id ? ' animate-shake' : '') +
                    (pop === p.id ? ' animate-pop' : '')
                  }
                >
                  {done && <span aria-hidden className="mr-1">✓</span>}
                  {p.right}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {!solved && <HintBox hints={hints} attempt={attempt} />}
      {solved && <Feedback type="success">모든 짝을 완성했어요! 호르몬 도감이 가득 찼어요.</Feedback>}
    </div>
  )
}
