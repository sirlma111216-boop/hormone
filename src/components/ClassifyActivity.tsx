import { useMemo, useState } from 'react'
import { shuffle } from '../lib/util'
import { Feedback, HintBox } from './ui'

export interface ClassifyCard {
  id: string
  label: string
  bucketId: string
}
export interface Bucket {
  id: string
  label: string
  icon?: string
  accent?: string // tailwind 색 계열
}

/**
 * 카드 분류 활동 (터치/마우스/키보드 지원).
 * 1) 보관함에서 카드를 클릭해 "선택"한다.
 * 2) 상자를 클릭해 넣는다. 맞으면 상자에 고정, 틀리면 흔들림+단계 힌트.
 */
export function ClassifyActivity({
  buckets,
  cards,
  hints = [],
  onSolved,
  solved: solvedProp,
}: {
  buckets: Bucket[]
  cards: ClassifyCard[]
  hints?: string[]
  onSolved: () => void
  solved?: boolean
}) {
  const ordered = useMemo(() => shuffle(cards), [cards])
  const [placed, setPlaced] = useState<Record<string, string>>({}) // cardId -> bucketId
  const [selected, setSelected] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [shakeBucket, setShakeBucket] = useState<string | null>(null)
  const [solved, setSolved] = useState(!!solvedProp)

  const pool = ordered.filter((c) => !placed[c.id])

  const placeInto = (bucketId: string) => {
    if (!selected || solved) return
    const card = cards.find((c) => c.id === selected)!
    if (card.bucketId === bucketId) {
      const next = { ...placed, [card.id]: bucketId }
      setPlaced(next)
      setSelected(null)
      if (Object.keys(next).length === cards.length) {
        setSolved(true)
        onSolved()
      }
    } else {
      setAttempt((a) => a + 1)
      setShakeBucket(bucketId)
      setTimeout(() => setShakeBucket(null), 450)
    }
  }

  return (
    <div>
      {/* 보관함 */}
      <div className="mb-4">
        <p className="mb-1.5 text-xs font-bold text-slate-500">
          카드 보관함 — 카드를 누른 뒤, 아래 상자를 눌러 분류
        </p>
        <div className="flex flex-wrap gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 min-h-[52px]">
          {pool.length === 0 && (
            <span className="text-sm text-slate-400">모든 카드를 분류했어요.</span>
          )}
          {pool.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              className={
                'rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition active:scale-95 ' +
                (selected === c.id
                  ? 'border-[#111111] bg-[#f5f5f5] text-[#111111] ring-2 ring-[#111111]/15'
                  : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#111111] hover:bg-[#f5f5f5]')
              }
            >
              {selected === c.id && <span aria-hidden className="mr-1">👉</span>}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 상자들 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {buckets.map((b) => {
          const items = cards.filter((c) => placed[c.id] === b.id)
          return (
            <button
              key={b.id}
              onClick={() => placeInto(b.id)}
              disabled={!selected || solved}
              className={
                'flex flex-col rounded-2xl border-2 border-dashed p-3 text-left transition ' +
                (shakeBucket === b.id ? 'animate-shake ' : '') +
                (selected && !solved
                  ? 'border-[#111111] bg-[#f5f5f5] cursor-pointer '
                  : 'border-slate-200 bg-white ') +
                'min-h-[130px]'
              }
            >
              <span className="mb-2 flex items-center gap-1.5 text-sm font-extrabold text-slate-700">
                <span aria-hidden>{b.icon}</span> {b.label}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {items.map((c) => (
                  <span
                    key={c.id}
                    className="animate-pop rounded-lg bg-emerald-100 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200"
                  >
                    ✓ {c.label}
                  </span>
                ))}
                {items.length === 0 && (
                  <span className="text-xs text-slate-400">여기로 분류</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {!solved && <HintBox hints={hints} attempt={attempt} />}
      {solved && <Feedback type="success">모든 카드를 바르게 분류했어요!</Feedback>}
    </div>
  )
}
