import { useEffect, useReducer, useRef } from 'react'

/* ===== 실시간 혈당량 조절 게임 =====
 * 시간-혈당량 그래프가 흐르고, 위에 이벤트 신호(식사/운동/간식/공복)가 떠서 혈당을 밀어낸다.
 * 인슐린(혈당 ↓)·글루카곤(혈당 ↑) 버튼을 다다닥 눌러 정상 범위(70~90) 중앙을 유지.
 * 결승선(약 35초)에 도달하면 별점 + 정리 표.
 */

const LOW = 70
const HIGH = 90
const MIN = 40
const MAX = 130
const RUN = 35 // 총 시간(초)
const N = 90 // 그래프 표본 개수(스크롤 창)

interface EvtDef {
  t: number
  dur: number
  dir: number // +면 혈당 상승, -면 하강
  label: string
  icon: string
}
const EVENTS: EvtDef[] = [
  { t: 3, dur: 3.5, dir: 1, label: '식사했다! 혈당 ↑', icon: '🍚' },
  { t: 8.5, dur: 3.5, dir: -1, label: '운동했다! 혈당 ↓', icon: '🏃' },
  { t: 14, dur: 3, dir: 1, label: '간식 먹었다! 혈당 ↑', icon: '🍪' },
  { t: 19, dur: 3.5, dir: -1, label: '공복이 길어졌다! 혈당 ↓', icon: '💤' },
  { t: 24, dur: 3.5, dir: 1, label: '식사했다! 혈당 ↑', icon: '🍚' },
  { t: 29, dur: 3.5, dir: -1, label: '운동했다! 혈당 ↓', icon: '🏃' },
]
const EVENT_RATE = 9 // mg/s 동안 밀어내는 정도
const TAP = 4.2 // 한 번 누를 때 mg 변화

type Phase = 'ready' | 'playing' | 'finished'

interface Game {
  glucose: number
  hist: number[]
  elapsed: number
  last: number
  sampleAcc: number
  inBand: number
  phase: Phase
}
function freshGame(phase: Phase): Game {
  return {
    glucose: 80,
    hist: Array(N).fill(80),
    elapsed: 0,
    last: 0,
    sampleAcc: 0,
    inBand: 0,
    phase,
  }
}

function activeEvent(elapsed: number): EvtDef | null {
  for (const e of EVENTS) if (elapsed >= e.t && elapsed < e.t + e.dur) return e
  return null
}

export function BloodGlucoseGame({ onDone, done }: { onDone: () => void; done: boolean }) {
  const g = useRef<Game>(freshGame(done ? 'finished' : 'ready'))
  const raf = useRef<number | undefined>(undefined)
  const [, render] = useReducer((x) => x + 1, 0)

  const stop = () => {
    if (raf.current !== undefined) cancelAnimationFrame(raf.current)
    raf.current = undefined
  }
  useEffect(() => () => stop(), [])

  const loop = (now: number) => {
    const s = g.current
    const dt = Math.min(0.05, (now - s.last) / 1000)
    s.last = now

    const ev = activeEvent(s.elapsed)
    const drift = ev ? ev.dir * EVENT_RATE : 0
    s.glucose += drift * dt + (Math.random() - 0.5) * 0.3
    if (s.glucose < MIN) s.glucose = MIN
    if (s.glucose > MAX) s.glucose = MAX

    if (s.glucose >= LOW && s.glucose <= HIGH) s.inBand += dt
    s.elapsed += dt

    // 그래프 표본 기록(약 0.12초마다)
    s.sampleAcc += dt
    if (s.sampleAcc >= 0.12) {
      s.sampleAcc = 0
      s.hist.push(s.glucose)
      if (s.hist.length > N) s.hist.shift()
    }

    if (s.elapsed >= RUN) {
      s.phase = 'finished'
      stop()
      onDone()
    }
    render()
    if (s.phase === 'playing') raf.current = requestAnimationFrame(loop)
  }

  const start = () => {
    g.current = freshGame('playing')
    g.current.last = performance.now()
    render()
    raf.current = requestAnimationFrame(loop)
  }

  const tap = (delta: number) => {
    const s = g.current
    if (s.phase !== 'playing') return
    s.glucose = Math.max(MIN, Math.min(MAX, s.glucose + delta))
    render()
  }

  const s = g.current
  const W = 300
  const H = 130
  const y = (v: number) => H - ((v - MIN) / (MAX - MIN)) * H
  const bandTop = y(HIGH)
  const bandH = y(LOW) - y(HIGH)
  const points = s.hist.map((v, i) => `${(i / (N - 1)) * W},${y(v).toFixed(1)}`).join(' ')
  const lastY = y(s.hist[s.hist.length - 1] ?? 80)
  const inBandNow = s.glucose >= LOW && s.glucose <= HIGH
  const ev = activeEvent(s.elapsed)
  const ratio = s.elapsed > 0 ? s.inBand / s.elapsed : 0

  return (
    <div>
      {/* 이벤트 신호 배너 */}
      {s.phase === 'playing' && (
        <div
          className={
            'mb-2 rounded-xl px-4 py-2.5 text-center text-sm font-bold ring-1 ' +
            (ev
              ? ev.dir > 0
                ? 'animate-pop bg-orange-50 text-orange-700 ring-orange-200'
                : 'animate-pop bg-sky-50 text-sky-700 ring-sky-200'
              : 'bg-slate-50 text-slate-500 ring-slate-200')
          }
        >
          {ev ? (
            <>
              {ev.icon} {ev.label} →{' '}
              {ev.dir > 0 ? '인슐린으로 낮추세요!' : '글루카곤으로 높이세요!'}
            </>
          ) : (
            '👀 신호를 기다리는 중… 혈당을 중앙(70~90)에 유지하세요'
          )}
        </div>
      )}

      {/* 그래프 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-1 flex items-end justify-between">
          <span className="text-xs font-bold text-slate-500">📈 혈당량 (mg / 100 mL)</span>
          <span
            className={
              'text-xl font-extrabold tabular-nums ' +
              (inBandNow ? 'text-emerald-600' : s.glucose > HIGH ? 'text-orange-500' : 'text-sky-500')
            }
          >
            {Math.round(s.glucose)}
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 150 }}>
          {/* 정상 범위 띠 */}
          <rect x="0" y={bandTop} width={W} height={bandH} fill="#d1fae5" />
          <line x1="0" y1={y(80)} x2={W} y2={y(80)} stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          {/* 혈당 곡선 */}
          <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />
          {/* 현재 점 */}
          <circle cx={W} cy={lastY} r="4.5" fill={inBandNow ? '#10b981' : s.glucose > HIGH ? '#f97316' : '#0ea5e9'} stroke="#fff" strokeWidth="1.5" />
        </svg>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>정상 70~90</span>
          <span>중앙선 80</span>
        </div>
      </div>

      {/* 진행(결승선) */}
      {s.phase !== 'ready' && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
            <span>결승선까지</span>
            <span className="text-emerald-600">정상 유지 {Math.round(ratio * 100)}%</span>
          </div>
          <div className="relative h-2.5 w-full rounded-full bg-slate-100">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-[width] duration-100"
              style={{ width: `${Math.min(100, (s.elapsed / RUN) * 100)}%` }}
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm">🏁</span>
          </div>
        </div>
      )}

      {/* 시작 전 */}
      {s.phase === 'ready' && (
        <div className="mt-4 text-center">
          <p className="mb-3 text-sm text-slate-600">
            식사·운동 같은 <b>신호</b>가 뜨면 혈당이 오르내려요. <b>인슐린(↓)</b>과{' '}
            <b>글루카곤(↑)</b> 버튼을 <b>다다닥</b> 눌러 혈당을 <b>정상 범위(초록 띠)</b>에 유지하며 결승선까지
            가 보세요!
          </p>
          <button
            onClick={start}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            🚀 실험 시작
          </button>
        </div>
      )}

      {/* 조절 버튼 */}
      {s.phase === 'playing' && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => tap(-TAP)}
            className="flex flex-col items-center gap-0.5 rounded-2xl border-2 border-sky-300 bg-sky-50 py-4 text-sky-800 shadow-sm transition active:scale-95 hover:-translate-y-0.5 hover:border-sky-500 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>💉</span>
            <span className="text-base font-extrabold">인슐린</span>
            <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[11px] font-bold text-white">혈당 ↓ 낮추기</span>
          </button>
          <button
            onClick={() => tap(TAP)}
            className="flex flex-col items-center gap-0.5 rounded-2xl border-2 border-orange-300 bg-orange-50 py-4 text-orange-800 shadow-sm transition active:scale-95 hover:-translate-y-0.5 hover:border-orange-500 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>🔺</span>
            <span className="text-base font-extrabold">글루카곤</span>
            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">혈당 ↑ 높이기</span>
          </button>
        </div>
      )}

      {s.phase === 'finished' && <FinishSummary ratio={done && s.elapsed === 0 ? 1 : ratio} onReplay={start} />}
    </div>
  )
}

function FinishSummary({ ratio, onReplay }: { ratio: number; onReplay: () => void }) {
  const stars = ratio >= 0.8 ? 3 : ratio >= 0.6 ? 2 : 1
  return (
    <div className="mt-4">
      <div className="rounded-2xl bg-emerald-600 p-5 text-center text-white">
        <div className="animate-float text-4xl">🏁🎉</div>
        <p className="font-display mt-2 text-lg font-bold">결승선 통과!</p>
        <p className="mt-1 text-2xl tracking-widest">
          {'⭐'.repeat(stars)}
          <span className="opacity-30">{'⭐'.repeat(3 - stars)}</span>
        </p>
        <p className="mt-1 text-sm text-emerald-50">
          정상 범위 유지 {Math.round(ratio * 100)}% — 인슐린과 글루카곤으로 혈당을 잘 조절했어요!
        </p>
      </div>

      <h3 className="mt-4 mb-2 flex items-center gap-2 text-sm font-extrabold text-[#111111]">
        <span className="h-2 w-2 rounded bg-[#111111]" /> 정리 · 혈당량 조절 (정상 70~90 mg/100mL)
      </h3>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-left text-xs">
              <th className="px-3 py-2">혈당량 상태</th>
              <th className="px-3 py-2">분비 호르몬</th>
              <th className="px-3 py-2">작용 → 결과</th>
            </tr>
          </thead>
          <tbody className="[&_td]:border-t [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2">
            <tr>
              <td className="font-bold text-orange-600">높을 때<br />(식사 후)</td>
              <td className="font-bold">인슐린</td>
              <td>세포의 포도당 흡수·간에 글리코젠 저장 → 혈당량 ↓</td>
            </tr>
            <tr>
              <td className="font-bold text-sky-600">낮을 때<br />(공복·운동)</td>
              <td className="font-bold">글루카곤</td>
              <td>간의 글리코젠을 포도당으로 분해·방출 → 혈당량 ↑</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm font-semibold text-emerald-700">
        ▶ 인슐린과 글루카곤은 서로 반대로 작용해 혈당량을 정상 범위로 되돌린다.
      </p>

      <button
        onClick={onReplay}
        className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#111111] hover:bg-slate-50"
      >
        ↻ 다시 도전
      </button>
    </div>
  )
}
