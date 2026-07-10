import { useMemo, useState } from 'react'
import { shuffle } from '../lib/util'
import { Feedback, HintBox } from './ui'

export interface MatchPair {
  id: string
  left: string
  right: string
}

/**
 * 두 열 짝 맞추기 (터치/마우스/키보드).
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
  const [solved, setSolved] = useState(!!solvedProp)

  const tryMatch = (rightId: string) => {
    if (!selLeft || solved) return
    if (selLeft === rightId) {
      const next = { ...matched, [rightId]: true }
      setMatched(next)
      setSelLeft(null)
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
                        ? 'border-[#111111] bg-[#f5f5f5] text-[#111111] ring-2 ring-[#111111]/15'
                        : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#111111] hover:bg-[#f5f5f5]',
                  )}
                >
                  {done && <span aria-hidden className="mr-1">✓</span>}
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
                        : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#111111] hover:bg-[#f5f5f5]',
                    ) + (shake === p.id ? ' animate-shake' : '')
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

      {!solved && (
        <p className="mt-2 text-xs text-slate-400">
          {selLeft ? '오른쪽에서 짝을 고르세요.' : '왼쪽 카드를 먼저 고르세요.'}
        </p>
      )}
      {!solved && <HintBox hints={hints} attempt={attempt} />}
      {solved && <Feedback type="success">모든 짝을 완성했어요! 호르몬 도감이 채워졌어요.</Feedback>}
    </div>
  )
}
