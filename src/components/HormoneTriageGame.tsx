import { useState } from 'react'
import { Feedback } from './ui'

interface Opt {
  label: string
  correct?: boolean
}
interface Patient {
  id: string
  observe: string
  hormones: Opt[]
  actions: Opt[]
  dogan: string
}

const PATIENTS: Patient[] = [
  {
    id: 'p1',
    observe: '식사를 방금 마쳤고 혈당량이 정상보다 높다.',
    hormones: [{ label: '인슐린', correct: true }, { label: '글루카곤' }, { label: '티록신' }, { label: '성장 호르몬' }],
    actions: [
      { label: '세포가 포도당을 흡수하고 간이 글리코젠으로 저장하게 한다.', correct: true },
      { label: '간의 글리코젠을 포도당으로 분해해 혈당량을 높인다.' },
      { label: '몸을 떨게 하여 열을 낸다.' },
    ],
    dogan: '이자 · 인슐린 — 혈당량을 낮춘다',
  },
  {
    id: 'p2',
    observe: '성장기인데 키가 또래보다 크게 자라지 않는다.',
    hormones: [{ label: '성장 호르몬', correct: true }, { label: '인슐린' }, { label: '티록신' }, { label: '글루카곤' }],
    actions: [
      { label: '성장 호르몬이 부족한 상태로, 보충이 필요할 수 있다.', correct: true },
      { label: '혈당량을 낮추는 조치가 필요하다.' },
      { label: '땀을 내어 열을 내보낸다.' },
    ],
    dogan: '뇌하수체 · 성장 호르몬 — 몸의 성장 촉진',
  },
  {
    id: 'p3',
    observe: '늘 더위를 타고 물질대사가 지나치게 활발하다.',
    hormones: [{ label: '티록신', correct: true }, { label: '인슐린' }, { label: '성장 호르몬' }, { label: '글루카곤' }],
    actions: [
      { label: '티록신이 지나치게 많은 상태로, 분비를 정상으로 조절해야 한다.', correct: true },
      { label: '글루카곤을 늘려 혈당량을 높인다.' },
      { label: '성장 호르몬을 보충한다.' },
    ],
    dogan: '갑상샘 · 티록신 — 물질대사 조절',
  },
  {
    id: 'p4',
    observe: '식사 후 혈당량이 정상으로 잘 내려가지 않는다.',
    hormones: [{ label: '인슐린', correct: true }, { label: '글루카곤' }, { label: '티록신' }, { label: '성장 호르몬' }],
    actions: [
      { label: '인슐린의 분비·작용이 부족한 상태(당뇨병과 관련)로, 인슐린 작용을 도와야 한다.', correct: true },
      { label: '글루카곤을 늘려 혈당량을 더 높인다.' },
      { label: '피부 혈관을 확장한다.' },
    ],
    dogan: '이자 · 인슐린 — 혈당량 조절과 당뇨병',
  },
  {
    id: 'p5',
    observe: '점심 먹은 지 오래됐고 운동을 해서 혈당량이 정상보다 낮다.',
    hormones: [{ label: '글루카곤', correct: true }, { label: '인슐린' }, { label: '티록신' }, { label: '성장 호르몬' }],
    actions: [
      { label: '간의 글리코젠을 포도당으로 분해해 혈당량을 높인다.', correct: true },
      { label: '세포의 포도당 흡수를 늘려 혈당량을 낮춘다.' },
      { label: '땀 분비를 늘린다.' },
    ],
    dogan: '이자 · 글루카곤 — 혈당량을 높인다',
  },
  {
    id: 'p6',
    observe: '추위를 잘 타고 물질대사가 지나치게 느리다.',
    hormones: [{ label: '티록신', correct: true }, { label: '글루카곤' }, { label: '인슐린' }, { label: '성장 호르몬' }],
    actions: [
      { label: '티록신이 부족한 상태로, 분비를 정상으로 조절해야 한다.', correct: true },
      { label: '인슐린을 늘려 혈당량을 낮춘다.' },
      { label: '피부 혈관을 확장해 열을 내보낸다.' },
    ],
    dogan: '갑상샘 · 티록신 — 부족 시 물질대사 저하',
  },
]

export function HormoneTriageGame({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [idx, setIdx] = useState(done ? PATIENTS.length : 0)
  const [phase, setPhase] = useState<'hormone' | 'action' | 'solved'>('hormone')
  const [wrong, setWrong] = useState<string | null>(null)
  const [shake, setShake] = useState<string | null>(null)

  const complete = done || idx >= PATIENTS.length
  const collected = Math.min(idx, PATIENTS.length)

  const flash = (label: string) => {
    setWrong(label)
    setShake(label)
    setTimeout(() => setShake(null), 450)
  }

  const pickHormone = (o: Opt) => {
    if (o.correct) {
      setPhase('action')
      setWrong(null)
    } else flash(o.label)
  }
  const pickAction = (o: Opt) => {
    if (o.correct) {
      setPhase('solved')
      setWrong(null)
    } else flash(o.label)
  }
  const next = () => {
    const n = idx + 1
    setIdx(n)
    setPhase('hormone')
    setWrong(null)
    if (n >= PATIENTS.length) onDone()
  }

  return (
    <div>
      {/* 도감 진행 */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-bold text-slate-500">호르몬 도감</span>
        {PATIENTS.map((p, i) => (
          <span
            key={p.id}
            title={i < collected ? p.dogan : '미완성'}
            className={
              'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ' +
              (i < collected
                ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                : 'bg-slate-100 text-slate-300')
            }
          >
            {i < collected ? '📖' : i + 1}
          </span>
        ))}
        <span className="ml-1 text-xs text-slate-500">{collected}/{PATIENTS.length}</span>
      </div>

      {complete ? (
        <div className="rounded-xl bg-emerald-600 p-6 text-center text-white">
          <div className="animate-float text-4xl">🏆</div>
          <p className="mt-2 text-lg font-extrabold">호르몬 도감 완성 배지 획득!</p>
          <p className="mt-1 text-sm text-emerald-50">
            관찰 → 추리 → 조치. 몸 상태를 보고 호르몬을 추리하는 관제사가 되었어요.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-[#f5f5f5] p-4 ring-1 ring-[#e5e7eb]">
            <p className="text-xs font-semibold text-[#6b7280]">🚑 환자 {idx + 1} · 1단계 관찰</p>
            <p className="mt-1 text-base font-semibold text-slate-800">{PATIENTS[idx].observe}</p>
          </div>

          {/* 2단계 추리 */}
          <p className="mt-4 mb-2 text-sm font-bold text-slate-600">2단계 추리 — 관여하는 호르몬은?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PATIENTS[idx].hormones.map((o) => (
              <button
                key={o.label}
                disabled={phase !== 'hormone'}
                onClick={() => pickHormone(o)}
                className={
                  'rounded-xl border px-4 py-3 text-sm font-semibold transition active:scale-95 ' +
                  (shake === o.label ? 'animate-shake ' : '') +
                  (phase !== 'hormone' && o.correct
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                    : wrong === o.label && phase === 'hormone'
                      ? 'border-orange-400 bg-orange-50 text-orange-700'
                      : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md disabled:opacity-50')
                }
              >
                {o.label}
              </button>
            ))}
          </div>

          {/* 3단계 조치 */}
          {phase !== 'hormone' && (
            <div className="animate-pop">
              <p className="mt-4 mb-2 text-sm font-bold text-slate-600">3단계 조치 — 그 호르몬이 하는 일은?</p>
              <div className="grid gap-2">
                {PATIENTS[idx].actions.map((o) => (
                  <button
                    key={o.label}
                    disabled={phase === 'solved'}
                    onClick={() => pickAction(o)}
                    className={
                      'rounded-xl border px-4 py-3 text-left text-sm font-medium transition active:scale-[0.98] ' +
                      (shake === o.label ? 'animate-shake ' : '') +
                      (phase === 'solved' && o.correct
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : wrong === o.label && phase === 'action'
                          ? 'border-orange-400 bg-orange-50 text-orange-700'
                          : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md disabled:opacity-60')
                    }
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {wrong && phase !== 'solved' && (
            <Feedback type="hint">
              몸 상태(혈당·성장·물질대사·체온)와 방향(부족/과다, 높임/낮춤)을 다시 연결해 보세요.
            </Feedback>
          )}

          {phase === 'solved' && (
            <div className="animate-pop">
              <Feedback type="success">
                도감에 <b>{PATIENTS[idx].dogan}</b> 카드가 추가됐어요!
              </Feedback>
              <button
                onClick={next}
                className="mt-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
              >
                {idx === PATIENTS.length - 1 ? '도감 완성하기 🏆' : '다음 환자 →'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
