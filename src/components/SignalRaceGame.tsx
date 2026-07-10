import { useState } from 'react'
import { Feedback } from './ui'

type Transport = 'nerve' | 'hormone' | 'both'
type Tag = 'fast' | 'slow' | 'bothtag'

interface Mission {
  id: string
  text: string
  transport: Transport
  tag: Tag
  explain: string
}

const MISSIONS: Mission[] = [
  {
    id: 'm1',
    text: '뜨거운 냄비를 만져서 손을 빨리 뗀다.',
    transport: 'nerve',
    tag: 'fast',
    explain: '위험을 피하려면 순간적으로 빨라야 해요. 신경(뉴런)이 빠르게 신호를 전달해요.',
  },
  {
    id: 'm2',
    text: '식사 후 혈당량을 천천히 정상으로 되돌린다.',
    transport: 'hormone',
    tag: 'slow',
    explain: '혈당량은 시간을 두고 꾸준히 조절해야 해요. 호르몬(인슐린)이 오래 작용해요.',
  },
  {
    id: 'm3',
    text: '몸의 성장을 조절한다.',
    transport: 'hormone',
    tag: 'slow',
    explain: '성장은 오랜 기간 지속적으로 조절돼요. 성장 호르몬 같은 호르몬이 담당해요.',
  },
  {
    id: 'm4',
    text: '공이 날아올 때 눈을 빠르게 감는다.',
    transport: 'nerve',
    tag: 'fast',
    explain: '순간 반응이 필요하죠. 신경이 빠르게 명령을 전달해요.',
  },
  {
    id: 'm5',
    text: '체온을 일정하게 유지한다.',
    transport: 'both',
    tag: 'bothtag',
    explain: '체온 조절은 신경(혈관·땀·떨림)과 호르몬(티록신)이 함께 작용해요.',
  },
]

const TRANSPORTS: { id: Transport; label: string }[] = [
  { id: 'nerve', label: '신경이 주로 적합' },
  { id: 'hormone', label: '호르몬이 주로 적합' },
  { id: 'both', label: '둘 다 관여' },
]
const TAGS: { id: Tag; label: string }[] = [
  { id: 'fast', label: '⚡ 빠름 필요' },
  { id: 'slow', label: '⏳ 지속 필요' },
  { id: 'bothtag', label: '⚡+⏳ 둘 다 필요' },
]

export function SignalRaceGame({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [idx, setIdx] = useState(done ? MISSIONS.length : 0)
  const [pickedTransport, setPickedTransport] = useState<Transport | null>(null)
  const [wrong, setWrong] = useState<string | null>(null)
  const [shake, setShake] = useState<string | null>(null)
  const [solvedThis, setSolvedThis] = useState(false)

  if (done || idx >= MISSIONS.length) {
    return (
      <Feedback type="success">
        신호 배송 완료! 속도가 필요하면 신경, 지속이 필요하면 호르몬 — 판단 기준을 익혔어요. 🏁
      </Feedback>
    )
  }

  const m = MISSIONS[idx]

  const advance = () => {
    setPickedTransport(null)
    setWrong(null)
    setSolvedThis(false)
    const next = idx + 1
    setIdx(next)
    if (next >= MISSIONS.length) onDone()
  }

  const chooseTransport = (t: Transport) => {
    if (t === m.transport) {
      setPickedTransport(t)
      setWrong(null)
    } else {
      setWrong(t)
      setShake(t)
      setTimeout(() => setShake(null), 450)
    }
  }
  const chooseTag = (tag: Tag) => {
    if (tag === m.tag) {
      setSolvedThis(true)
      setWrong(null)
    } else {
      setWrong(tag)
      setShake(tag)
      setTimeout(() => setShake(null), 450)
    }
  }

  return (
    <div>
      {/* 레이스 트랙 진행 */}
      <div className="mb-3 flex items-center gap-1.5">
        {MISSIONS.map((mm, i) => (
          <div
            key={mm.id}
            className={
              'h-2 flex-1 rounded-full ' +
              (i < idx ? 'bg-emerald-400' : i === idx ? 'bg-[#111111]' : 'bg-[#e5e7eb]')
            }
          />
        ))}
        <span className="ml-1 text-xs font-bold text-slate-500">
          {idx + 1}/{MISSIONS.length}
        </span>
      </div>

      <div className="rounded-xl bg-[#f5f5f5] p-4 ring-1 ring-[#e5e7eb]">
        <p className="text-sm font-semibold text-[#6b7280]">🚚 미션 {idx + 1}</p>
        <p className="mt-1 text-base font-semibold text-slate-800">{m.text}</p>
      </div>

      {/* 1단계 전달 방식 */}
      <p className="mt-4 mb-2 text-sm font-bold text-slate-600">1) 어떤 전달 방식이 알맞을까?</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {TRANSPORTS.map((t) => {
          const picked = pickedTransport === t.id
          return (
            <button
              key={t.id}
              disabled={!!pickedTransport}
              onClick={() => chooseTransport(t.id)}
              className={
                'rounded-xl border px-3 py-3 text-sm font-semibold transition active:scale-95 ' +
                (shake === t.id ? 'animate-shake ' : '') +
                (picked
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : !pickedTransport && wrong === t.id
                    ? 'border-orange-400 bg-orange-50 text-orange-700'
                    : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#111111] hover:bg-[#f5f5f5]')
              }
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* 2단계 근거 태그 */}
      {pickedTransport && (
        <div className="animate-pop">
          <p className="mt-4 mb-2 text-sm font-bold text-slate-600">
            2) 왜 그렇게 판단했나요? (근거 태그)
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {TAGS.map((tag) => (
              <button
                key={tag.id}
                disabled={solvedThis}
                onClick={() => chooseTag(tag.id)}
                className={
                  'rounded-xl border px-3 py-3 text-sm font-semibold transition active:scale-95 ' +
                  (shake === tag.id ? 'animate-shake ' : '') +
                  (wrong === tag.id
                    ? 'border-orange-400 bg-orange-50 text-orange-700'
                    : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#111111] hover:bg-[#f5f5f5]')
                }
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {wrong && !pickedTransport && (
        <Feedback type="hint">
          '속도가 필요한가, 지속이 필요한가'를 기준으로 다시 판단해 보세요.
        </Feedback>
      )}

      {solvedThis && (
        <div className="animate-pop">
          <Feedback type="success">{m.explain}</Feedback>
          <button
            onClick={advance}
            className="mt-2 rounded-lg bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#242424] active:scale-95"
          >
            {idx === MISSIONS.length - 1 ? '레이스 완주하기 🏁' : '다음 미션 →'}
          </button>
        </div>
      )}

      <details className="mt-3">
        <summary className="cursor-pointer text-xs text-slate-400">
          도움말: 속도 vs 지속 기준
        </summary>
        <p className="mt-1 text-xs text-slate-500">
          급하고 짧게 끝나는 일은 신경(⚡), 천천히 오래 조절하는 일은 호르몬(⏳). 둘 다 필요하면 함께
          작용해요.
        </p>
      </details>
    </div>
  )
}
