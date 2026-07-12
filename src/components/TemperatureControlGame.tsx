import { useEffect, useReducer, useRef } from 'react'
import { shuffle } from '../lib/util'

/* ===== 실시간 체온 조절 게임 =====
 * 시작하면 환경이 체온을 랜덤하게 올리거나 내린다.
 * 아래 조절 카드(혈관 확장/수축·땀·떨림·티록신)를 눌러 정상 범위(36.5~37.5℃)로 유지.
 * 정상 범위 안에서 누적 30초를 버티면 성공 → 정리 표.
 */

interface Card {
  id: string
  label: string
  icon: string
  kind: '신경' | '호르몬'
  delta: number // 한 번 누를 때 체온 변화(℃). 음수=낮춤, 양수=높임
}

const CARDS: Card[] = [
  { id: 'vasodil', label: '피부 혈관 확장', icon: '🌊', kind: '신경', delta: -0.33 },
  { id: 'sweat', label: '땀 분비 증가', icon: '💧', kind: '신경', delta: -0.33 },
  { id: 'vasocon', label: '피부 혈관 수축', icon: '🧤', kind: '신경', delta: 0.33 },
  { id: 'shiver', label: '몸 떨림', icon: '🥶', kind: '신경', delta: 0.33 },
  { id: 'thyroxine', label: '티록신 분비 증가', icon: '🔥', kind: '호르몬', delta: 0.33 },
]

const LOW = 36.5
const HIGH = 37.5
const MIN = 34.5
const MAX = 39.5
const TARGET = 30 // 누적 안정 목표(초)

type Phase = 'ready' | 'playing' | 'won'

interface Game {
  temp: number
  envDir: number // +면 더워짐(체온↑), -면 추워짐(체온↓)
  envRate: number // ℃/s
  envUntil: number
  stable: number // 누적 안정 시간(초)
  elapsed: number
  last: number
  phase: Phase
}

function freshGame(phase: Phase): Game {
  return { temp: 37, envDir: 0, envRate: 0, envUntil: 0, stable: 0, elapsed: 0, last: 0, phase }
}

export function TemperatureControlGame({ onDone, done }: { onDone: () => void; done: boolean }) {
  const cards = useRef(shuffle(CARDS)).current
  const g = useRef<Game>(freshGame(done ? 'won' : 'ready'))
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

    // 환경 갱신
    if (s.elapsed >= s.envUntil) {
      s.envDir = Math.random() < 0.5 ? 1 : -1
      s.envRate = 0.2 + Math.random() * 0.25 // 0.20~0.45 ℃/s
      s.envUntil = s.elapsed + 2.6 + Math.random() * 2
    }
    s.temp += s.envDir * s.envRate * dt + (Math.random() - 0.5) * 0.01
    if (s.temp < MIN) s.temp = MIN
    if (s.temp > MAX) s.temp = MAX

    const inBand = s.temp >= LOW && s.temp <= HIGH
    if (inBand) s.stable += dt
    s.elapsed += dt

    if (s.stable >= TARGET) {
      s.phase = 'won'
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
    s.temp = Math.max(MIN, Math.min(MAX, s.temp + delta))
    render()
  }

  const s = g.current
  const pct = ((s.temp - MIN) / (MAX - MIN)) * 100
  const bandLeft = ((LOW - MIN) / (MAX - MIN)) * 100
  const bandRight = ((HIGH - MIN) / (MAX - MIN)) * 100
  const inBand = s.temp >= LOW && s.temp <= HIGH
  const tempColor = inBand ? 'text-emerald-600' : s.temp > HIGH ? 'text-orange-500' : 'text-sky-500'

  return (
    <div>
      {/* 체온 현황표 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-xs font-bold text-slate-500">🌡️ 체온 현황</span>
          <span className={'text-2xl font-extrabold tabular-nums ' + tempColor}>
            {s.temp.toFixed(1)} ℃
          </span>
        </div>
        <div className="relative h-5 rounded-full bg-gradient-to-r from-sky-100 via-emerald-100 to-orange-100">
          {/* 정상 범위 */}
          <div
            className="absolute top-0 h-5 rounded bg-emerald-300/50 ring-1 ring-emerald-400"
            style={{ left: `${bandLeft}%`, width: `${bandRight - bandLeft}%` }}
          />
          {/* 마커 */}
          <div
            className="absolute top-1/2 h-7 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            style={{ left: `${pct}%`, background: inBand ? '#10b981' : s.temp > HIGH ? '#f97316' : '#0ea5e9' }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>{MIN}℃</span>
          <span className="font-bold text-emerald-600">정상 36.5~37.5℃</span>
          <span>{MAX}℃</span>
        </div>

        {/* 안정 유지 progress */}
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
            <span>정상 범위 유지</span>
            <span className="text-emerald-600">{s.stable.toFixed(1)} / {TARGET}초</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100">
            <div
              className="h-2.5 rounded-full bg-emerald-500 transition-[width] duration-100"
              style={{ width: `${Math.min(100, (s.stable / TARGET) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 환경 신호 */}
      {s.phase === 'playing' && (
        <div
          className={
            'animate-pop mt-3 rounded-xl px-4 py-2.5 text-center text-sm font-bold ring-1 ' +
            (s.envDir > 0
              ? 'bg-orange-50 text-orange-700 ring-orange-200'
              : 'bg-sky-50 text-sky-700 ring-sky-200')
          }
        >
          {s.envDir > 0
            ? '☀️ 더워지고 있어요! (체온 ↑) → 체온을 낮추는 반응을 쓰세요'
            : '❄️ 추워지고 있어요! (체온 ↓) → 체온을 높이는 반응을 쓰세요'}
        </div>
      )}

      {/* 시작 전 / 성공 후 */}
      {s.phase === 'ready' && (
        <div className="mt-4 text-center">
          <p className="mb-3 text-sm text-slate-600">
            시작하면 환경이 체온을 올리거나 내려요. 아래 <b>조절 카드</b>를 눌러 체온을
            <b> 정상 범위(초록 띠)</b>에 <b>30초</b> 동안 유지해 보세요!
          </p>
          <button
            onClick={start}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            🚀 관제 시작
          </button>
        </div>
      )}

      {/* 조절 카드 */}
      {s.phase === 'playing' && (
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {cards.map((c) => {
            const lower = c.delta < 0
            return (
              <button
                key={c.id}
                onClick={() => tap(c.delta)}
                className={
                  'flex flex-col items-center gap-0.5 rounded-xl border-2 px-2 py-3 text-center transition active:scale-95 ' +
                  (lower
                    ? 'border-sky-200 bg-sky-50 text-sky-800 hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-md'
                    : 'border-orange-200 bg-orange-50 text-orange-800 hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md')
                }
              >
                <span className="text-xl" aria-hidden>{c.icon}</span>
                <span className="text-xs font-bold leading-tight">{c.label}</span>
                <span
                  className={
                    'mt-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ' +
                    (lower ? 'bg-sky-500 text-white' : 'bg-orange-500 text-white')
                  }
                >
                  체온 {lower ? '↓' : '↑'} · {c.kind}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {s.phase === 'won' && <WonSummary onReplay={start} />}
    </div>
  )
}

function WonSummary({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="mt-4">
      <div className="rounded-2xl bg-emerald-600 p-5 text-center text-white">
        <div className="animate-float text-4xl">🌡️🏅</div>
        <p className="font-display mt-2 text-lg font-bold">체온 조절 성공!</p>
        <p className="mt-1 text-sm text-emerald-50">
          정상 범위(약 37℃)를 30초간 잘 유지했어요. 몸도 이렇게 신경과 호르몬으로 체온을 지킨답니다.
        </p>
      </div>

      <h3 className="mt-4 mb-2 flex items-center gap-2 text-sm font-extrabold text-[#111111]">
        <span className="h-2 w-2 rounded bg-[#111111]" /> 정리 · 체온 조절
      </h3>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-left text-xs">
              <th className="px-3 py-2">상황</th>
              <th className="px-3 py-2">몸의 조절 반응</th>
              <th className="px-3 py-2">구분</th>
            </tr>
          </thead>
          <tbody className="[&_td]:border-t [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2">
            <tr>
              <td className="font-bold text-orange-600">더울 때<br />(체온 ↑)</td>
              <td>피부 혈관 확장 · 땀 분비 증가 → 열 방출 ↑ → 체온 ↓</td>
              <td>신경</td>
            </tr>
            <tr>
              <td className="font-bold text-sky-600" rowSpan={2}>추울 때<br />(체온 ↓)</td>
              <td>피부 혈관 수축 · 몸 떨림 → 열 방출 ↓ · 열 발생 ↑</td>
              <td>신경</td>
            </tr>
            <tr>
              <td>티록신 분비 증가 → 세포 호흡 촉진 → 열 발생 ↑</td>
              <td>호르몬</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm font-semibold text-emerald-700">
        ▶ 체온 조절은 신경의 작용과 호르몬의 작용이 함께 일어난다.
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
