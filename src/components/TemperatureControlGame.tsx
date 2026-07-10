import { useState } from 'react'
import { HOT_REACTIONS, COLD_REACTIONS, type ReactionCard } from '../data/homeostasis'
import { Feedback } from './ui'
import { RefNote } from './shared'

interface Round {
  key: 'hot' | 'cold'
  title: string
  cards: ReactionCard[]
  tempLabel: string
  tempColor: string
}

const ROUNDS: Round[] = [
  { key: 'hot', title: '☀️ 더운 상황', cards: HOT_REACTIONS, tempLabel: '체온 ↑ (정상보다 높음)', tempColor: 'bg-orange-400' },
  { key: 'cold', title: '❄️ 추운 상황', cards: COLD_REACTIONS, tempLabel: '체온 ↓ (정상보다 낮음)', tempColor: 'bg-sky-400' },
]

export function TemperatureControlGame({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [round, setRound] = useState(done ? ROUNDS.length : 0)
  const [tags, setTags] = useState<Record<string, ReactionCard['kind']>>({})
  const [pending, setPending] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ type: 'rebut' | 'hint'; text: string } | null>(null)
  const [shake, setShake] = useState<string | null>(null)

  if (done || round >= ROUNDS.length) {
    return (
      <Feedback type="success">
        더울 때는 열을 내보내고, 추울 때는 열을 지키고 만들어요. 신경과 호르몬이 함께 작용한다는 걸
        확인했어요!
      </Feedback>
    )
  }

  const r = ROUNDS[round]
  const correctCards = r.cards.filter((c) => c.correct)
  const taggedCount = correctCards.filter((c) => tags[c.id]).length
  const roundComplete = taggedCount === correctCards.length

  const flash = (id: string) => {
    setShake(id)
    setTimeout(() => setShake(null), 450)
  }

  const tapCard = (c: ReactionCard) => {
    if (tags[c.id]) return
    if (!c.correct) {
      flash(c.id)
      setMsg({
        type: 'rebut',
        text: `'${c.label}' 은(는) ${r.key === 'hot' ? '더울' : '추울'} 때의 반응이 아니에요. 반대 상황의 반응이랍니다.`,
      })
      return
    }
    setPending(c.id)
    setMsg(null)
  }

  const chooseKind = (kind: ReactionCard['kind']) => {
    const c = r.cards.find((x) => x.id === pending)!
    if (kind === c.kind) {
      const nextTags = { ...tags, [c.id]: kind }
      setTags(nextTags)
      setPending(null)
      setMsg(null)
    } else {
      setMsg({
        type: 'hint',
        text:
          kind === '신경'
            ? '혈관·땀·떨림처럼 빠른 반응은 신경이지만, 갑상샘·티록신·세포 호흡은 호르몬의 작용이에요.'
            : '티록신·세포 호흡은 호르몬이지만, 혈관·땀·떨림은 신경의 작용이에요.',
      })
    }
  }

  const nextRound = () => {
    const n = round + 1
    setRound(n)
    setTags({})
    setPending(null)
    setMsg(null)
    if (n >= ROUNDS.length) onDone()
  }

  return (
    <div>
      <RefNote>
        정상 체온은 약 <b>37 ℃</b>. 체온 조절은 <b>신경의 작용</b>과 <b>호르몬의 작용</b>이 함께
        일어나요. (티록신에 의한 체온 조절은 특히 어린아이에게서 두드러집니다.)
      </RefNote>

      {/* 게이지 */}
      <div className="mb-4 rounded-xl bg-white p-3 ring-1 ring-slate-200">
        <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>{r.title}</span>
          <span>{r.tempLabel}</span>
        </div>
        <div className="relative h-3 rounded-full bg-slate-100">
          <div className="absolute left-1/2 top-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-emerald-500" />
          <div
            className={`absolute top-0 h-3 rounded-full ${r.tempColor} ${r.key === 'hot' ? 'left-1/2 right-2' : 'left-2 right-1/2'}`}
          />
        </div>
        <p className="mt-1 text-center text-[11px] text-slate-400">
          가운데 초록선 = 정상 체온(37 ℃). 알맞은 반응을 골라 정상으로 되돌려요.
        </p>
      </div>

      <p className="mb-2 text-sm font-bold text-slate-600">
        이 상황에 알맞은 몸의 반응을 모두 골라, 신경 / 호르몬으로 태그하세요. ({taggedCount}/
        {correctCards.length})
      </p>

      <div className="flex flex-wrap gap-2">
        {r.cards.map((c) => {
          const tagged = tags[c.id]
          return (
            <button
              key={c.id}
              onClick={() => tapCard(c)}
              disabled={!!tagged}
              className={
                'rounded-xl border px-3 py-2.5 text-sm font-medium transition active:scale-95 ' +
                (shake === c.id ? 'animate-shake ' : '') +
                (tagged
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                  : pending === c.id
                    ? 'border-violet-500 bg-violet-100 text-violet-900 ring-2 ring-violet-200 shadow-md'
                    : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md')
              }
            >
              {tagged && <span aria-hidden className="mr-1">✓</span>}
              {c.label}
              {tagged && (
                <span
                  className={
                    'ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold ' +
                    (tagged === '신경' ? 'bg-[#111111] text-white' : 'bg-amber-500 text-white')
                  }
                >
                  {tagged === '신경' ? '⚡신경' : '🩸호르몬'}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 태그 선택 */}
      {pending && (
        <div className="animate-pop mt-3 rounded-xl bg-[#f5f5f5] p-3 ring-1 ring-[#e5e7eb]">
          <p className="mb-2 text-sm font-semibold text-[#111111]">
            이 반응은 신경의 작용일까요, 호르몬의 작용일까요?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => chooseKind('신경')}
              className="rounded-lg border border-[#111111] bg-white px-4 py-2 text-sm font-semibold text-[#111111] hover:bg-[#f5f5f5]"
            >
              ⚡ 신경의 작용
            </button>
            <button
              onClick={() => chooseKind('호르몬')}
              className="rounded-lg border border-amber-400 bg-white px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-50"
            >
              🩸 호르몬의 작용
            </button>
          </div>
        </div>
      )}

      {msg && <Feedback type={msg.type}>{msg.text}</Feedback>}

      {roundComplete && (
        <div className="animate-pop">
          <Feedback type="success">
            {r.key === 'hot'
              ? '더울 때: 피부 혈관 확장·땀 분비로 열을 내보내 체온을 낮춰요.'
              : '추울 때: 혈관 수축(신경)으로 열을 지키고, 떨림·티록신(호르몬)으로 열을 만들어요.'}
          </Feedback>
          <button
            onClick={nextRound}
            className="mt-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            {round === ROUNDS.length - 1 ? '체온 조절 완료 ✅' : '다음: 추운 상황 →'}
          </button>
        </div>
      )}
    </div>
  )
}
