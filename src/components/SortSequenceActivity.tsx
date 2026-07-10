import { useMemo, useState } from 'react'
import { shuffle } from '../lib/util'
import { Feedback, HintBox, PrimaryButton, GhostButton } from './ui'

interface TrapCard {
  label: string
  rebut: string
}

/**
 * 클릭(터치)으로 순서를 배열하는 활동.
 * - 위 "카드 보관함"에서 카드를 클릭하면 아래 순서줄에 차례로 놓인다.
 * - 순서줄의 카드를 클릭하면 다시 보관함으로 돌아간다.
 * - "확인"을 누르면 채점한다. 함정 카드가 들어 있으면 반증 후 되돌린다.
 */
export function SortSequenceActivity({
  correctOrder,
  trap,
  hints = [],
  onSolved,
  solved: solvedProp,
}: {
  correctOrder: string[]
  trap?: TrapCard
  hints?: string[]
  onSolved: () => void
  solved?: boolean
}) {
  const allCards = useMemo(
    () => shuffle([...correctOrder, ...(trap ? [trap.label] : [])]),
    [correctOrder, trap],
  )
  const [placed, setPlaced] = useState<string[]>([])
  const [attempt, setAttempt] = useState(0)
  const [solved, setSolved] = useState(!!solvedProp)
  const [rebut, setRebut] = useState<string | null>(null)

  const pool = allCards.filter((c) => !placed.includes(c))

  const addCard = (c: string) => {
    if (solved) return
    setRebut(null)
    setPlaced((p) => [...p, c])
  }
  const removeCard = (c: string) => {
    if (solved) return
    setRebut(null)
    setPlaced((p) => p.filter((x) => x !== c))
  }

  const check = () => {
    if (trap && placed.includes(trap.label)) {
      setRebut(trap.rebut)
      setPlaced((p) => p.filter((x) => x !== trap.label))
      setAttempt((a) => a + 1)
      return
    }
    const correct =
      placed.length === correctOrder.length &&
      placed.every((c, i) => c === correctOrder[i])
    if (correct) {
      setSolved(true)
      onSolved()
    } else {
      setAttempt((a) => a + 1)
    }
  }

  return (
    <div>
      {/* 보관함 */}
      <div className="mb-3">
        <p className="mb-1.5 text-xs font-bold text-slate-500">카드 보관함 (클릭해 아래에 배치)</p>
        <div className="flex flex-wrap gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
          {pool.length === 0 && (
            <span className="text-sm text-slate-400">모든 카드를 배치했어요.</span>
          )}
          {pool.map((c) => (
            <button
              key={c}
              onClick={() => addCard(c)}
              className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#374151] shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md active:scale-95"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 순서줄 */}
      <div className="mb-3">
        <p className="mb-1.5 text-xs font-bold text-slate-500">내가 만든 순서 (클릭하면 되돌리기)</p>
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#f8f9fa] p-3 ring-1 ring-[#e5e7eb] min-h-[56px]">
          {placed.length === 0 && (
            <span className="text-sm text-slate-400">여기에 순서대로 카드를 놓아요.</span>
          )}
          {placed.map((c, i) => (
            <span key={c} className="flex items-center gap-2">
              <button
                onClick={() => removeCard(c)}
                className={
                  'rounded-lg border px-3 py-2 text-sm font-semibold shadow-sm transition active:scale-95 ' +
                  (solved
                    ? 'border-emerald-400 bg-emerald-100 text-emerald-800'
                    : 'border-[#111111] bg-white text-[#111111] hover:bg-orange-50')
                }
              >
                <span className="mr-1 text-xs text-slate-400">{i + 1}</span>
                {c}
              </button>
              {i < placed.length - 1 && <span aria-hidden className="text-[#9ca3af]">→</span>}
            </span>
          ))}
        </div>
      </div>

      {rebut && <Feedback type="rebut">{rebut}</Feedback>}
      {!solved && !rebut && <HintBox hints={hints} attempt={attempt} />}
      {solved && <Feedback type="success">순서를 정확히 완성했어요!</Feedback>}

      {!solved && (
        <div className="mt-3 flex gap-2">
          <PrimaryButton onClick={check} disabled={placed.length === 0}>
            확인
          </PrimaryButton>
          <GhostButton onClick={() => setPlaced([])}>다시 배열</GhostButton>
        </div>
      )}
    </div>
  )
}
