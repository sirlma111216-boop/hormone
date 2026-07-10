import { useEffect, useMemo, useRef, useState } from 'react'
import { BALANCE_SITUATIONS, type BalanceSituation } from '../data/homeostasis'
import { HomeostasisLoop } from './HomeostasisLoop'
import { Feedback, HintBox } from './ui'
import { shuffle } from '../lib/util'

function Gauge({
  type,
  direction,
  recovered,
}: {
  type: string
  direction: 'high' | 'low'
  recovered: boolean
}) {
  // 마커 위치: 회복되면 중앙(정상), 아니면 높음/낮음
  const pos = recovered ? 50 : direction === 'high' ? 85 : 15
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
        <span>낮음</span>
        <span>{type} · 정상 범위</span>
        <span>높음</span>
      </div>
      <div className="relative h-4 rounded-full bg-gradient-to-r from-sky-200 via-emerald-200 to-orange-200">
        {/* 정상 범위 표시 */}
        <div className="absolute left-[38%] right-[38%] top-0 h-4 rounded bg-emerald-300/60 ring-1 ring-emerald-400" />
        <div
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#111111] shadow transition-all duration-700"
          style={{ left: `${pos}%` }}
          aria-label={recovered ? '정상 범위로 회복' : direction === 'high' ? '정상보다 높음' : '정상보다 낮음'}
        />
      </div>
      <p className="mt-1 text-center text-[11px] text-slate-400">
        {recovered ? '✅ 정상 범위로 회복!' : '⚠️ 정상 범위에서 벗어남 — 알맞은 조절 반응을 고르세요.'}
      </p>
    </div>
  )
}

export function BalanceGame({ onDone, done }: { onDone: () => void; done: boolean }) {
  const order = useMemo<BalanceSituation[]>(() => shuffle(BALANCE_SITUATIONS), [])
  const [pos, setPos] = useState(done ? order.length : 0)
  const [phase, setPhase] = useState<'answering' | 'solved'>('answering')
  const [attempt, setAttempt] = useState(0)
  const [wrong, setWrong] = useState<string | null>(null)
  const [shake, setShake] = useState<string | null>(null)
  const [lit, setLit] = useState(0)
  const [pressure, setPressure] = useState(0)
  const [nudge, setNudge] = useState(false)
  const timers = useRef<number[]>([])

  const complete = done || pos >= order.length
  const s = complete ? null : order[pos]

  // 압박 타이머(가벼운 긴장 요소, 실패는 없음)
  useEffect(() => {
    if (complete || phase !== 'answering') return
    const t = window.setInterval(() => {
      setPressure((p) => {
        if (p >= 100) {
          setNudge(true)
          return 55
        }
        return p + 5
      })
    }, 500)
    return () => window.clearInterval(t)
  }, [complete, phase, pos])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  if (complete) {
    return (
      <div className="rounded-xl bg-emerald-600 p-6 text-center text-white">
        <div className="animate-float text-4xl">🎮🏅</div>
        <p className="font-display mt-2 text-lg font-semibold">항상성 관제 미션 성공!</p>
        <p className="mt-1 text-sm text-emerald-50">
          벗어남 → 감지 → 조절 → 회복. 몸속 균형을 스스로 되돌리는 원리를 몸으로 익혔어요.
        </p>
      </div>
    )
  }

  const choose = (opt: { label: string; correct: boolean }) => {
    if (phase !== 'answering') return
    if (opt.correct) {
      setPhase('solved')
      setWrong(null)
      setNudge(false)
      // 되돌림 고리에 단계별로 불이 들어옴
      ;[1, 2, 3, 4].forEach((n, i) => {
        const t = window.setTimeout(() => setLit(n), 250 * (i + 1))
        timers.current.push(t)
      })
    } else {
      setAttempt((a) => a + 1)
      setWrong(opt.label)
      setShake(opt.label)
      setTimeout(() => setShake(null), 450)
    }
  }

  const next = () => {
    const n = pos + 1
    setPos(n)
    setPhase('answering')
    setAttempt(0)
    setWrong(null)
    setLit(0)
    setPressure(0)
    setNudge(false)
    if (n >= order.length) onDone()
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-1.5">
        {order.map((o, i) => (
          <div
            key={o.id}
            className={
              'h-2 flex-1 rounded-full ' +
              (i < pos ? 'bg-emerald-400' : i === pos ? 'bg-[#111111]' : 'bg-[#e5e7eb]')
            }
          />
        ))}
        <span className="ml-1 text-xs font-bold text-slate-500">{pos + 1}/{order.length}</span>
      </div>

      {/* 상황 */}
      <div className="rounded-xl bg-[#f5f5f5] p-4 ring-1 ring-[#e5e7eb]">
        <p className="text-xs font-semibold text-[#6b7280]">상황 카드 · {s!.gauge} 조절</p>
        <p className="mt-1 text-base font-semibold text-slate-800">{s!.text}</p>
      </div>

      {/* 게이지 */}
      <div className="my-4 rounded-xl bg-white p-3 ring-1 ring-slate-200">
        <Gauge type={s!.gauge} direction={s!.direction} recovered={phase === 'solved'} />
      </div>

      {/* 압박 바 */}
      {phase === 'answering' && (
        <div className="mb-3">
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div
              className={'h-1.5 rounded-full transition-all ' + (pressure > 70 ? 'bg-orange-400' : 'bg-[#9ca3af]')}
              style={{ width: `${pressure}%` }}
            />
          </div>
          {nudge && (
            <p className="mt-1 text-xs text-orange-500">몸이 힘들어해요! 얼른 조절 반응을 골라 주세요.</p>
          )}
        </div>
      )}

      {/* 선택지 */}
      <div className="grid gap-2">
        {s!.options.map((o) => (
          <button
            key={o.label}
            disabled={phase === 'solved'}
            onClick={() => choose(o)}
            className={
              'rounded-xl border px-4 py-3 text-left text-sm font-medium transition active:scale-[0.98] ' +
              (shake === o.label ? 'animate-shake ' : '') +
              (phase === 'solved' && o.correct
                ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : wrong === o.label && phase === 'answering'
                  ? 'border-orange-400 bg-orange-50 text-orange-700'
                  : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#111111] hover:bg-[#f5f5f5] disabled:opacity-60')
            }
          >
            {o.label}
          </button>
        ))}
      </div>

      {phase === 'answering' && <HintBox hints={s!.hints} attempt={attempt} />}

      {/* 되돌림 시각화 */}
      {phase === 'solved' && (
        <div className="animate-pop mt-4">
          <HomeostasisLoop lit={lit} />
          <Feedback type="success">{s!.explain}</Feedback>
          <button
            onClick={next}
            className="mt-2 rounded-lg bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#242424] active:scale-95"
          >
            {pos === order.length - 1 ? '미션 완수 🏅' : '다음 상황 →'}
          </button>
        </div>
      )}
    </div>
  )
}
