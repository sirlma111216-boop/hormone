import { useEffect, useState } from 'react'
import { GLAND_POSITIONS } from '../data/hormones'
import { BodySilhouette } from './diagrams'
import { Feedback, ImageOrFallback } from './ui'
import { MatchingActivity } from './MatchingActivity'
import { RefNote } from './shared'

/* 활동 2-1 몸속 호르몬 지도 (탐구·학습형: 내분비샘을 눌러 특징·호르몬 알아보기) */
export function Activity21({ onDone, done }: { onDone: () => void; done: boolean }) {
  const total = GLAND_POSITIONS.length
  const [selected, setSelected] = useState<string | null>(null)
  const [explored, setExplored] = useState<Set<string>>(() =>
    done ? new Set(GLAND_POSITIONS.map((g) => g.id)) : new Set(),
  )

  const open = (id: string) => {
    setSelected(id)
    setExplored((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const allExplored = explored.size === total

  useEffect(() => {
    if (allExplored) onDone()
  }, [allExplored, onDone])

  const current = GLAND_POSITIONS.find((g) => g.id === selected) ?? null

  return (
    <div>
      <RefNote>
        각 <b>내분비샘(●)</b>을 눌러 그 샘의 <b>특징</b>과 <b>분비하는 호르몬</b>을 알아보세요. 6곳을
        모두 살펴보면 완료돼요!
      </RefNote>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,300px)_1fr] sm:items-start">
        {/* 그림 + 마커 */}
        <div className="mx-auto w-full max-w-[300px]">
          <div className="relative">
            <ImageOrFallback
              src="/assets/endocrine_glands.png"
              alt="내분비샘 위치 그림"
              fallback={<BodySilhouette />}
            />
            {GLAND_POSITIONS.map((g, i) => {
              const isExplored = explored.has(g.id)
              const isSel = selected === g.id
              return (
                <button
                  key={g.id}
                  onClick={() => open(g.id)}
                  style={{ left: `${g.x}%`, top: `${g.y}%` }}
                  aria-label={`${g.gland} 알아보기`}
                  className={
                    'absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-md transition ' +
                    (isSel ? 'z-10 scale-125 ring-4 ring-violet-300 ' : 'hover:scale-110 ') +
                    (isExplored ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse')
                  }
                >
                  {isExplored ? '✓' : i + 1}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">
            살펴본 내분비샘 : <b className="text-violet-700">{explored.size}</b> / {total}
          </p>
        </div>

        {/* 정보 패널 */}
        <div>
          {/* 내분비샘 칩 (누르면 정보 표시) */}
          <div className="mb-3 flex flex-wrap gap-2">
            {GLAND_POSITIONS.map((g) => {
              const isExplored = explored.has(g.id)
              const isSel = selected === g.id
              return (
                <button
                  key={g.id}
                  onClick={() => open(g.id)}
                  className={
                    'rounded-xl border px-3 py-1.5 text-sm font-semibold transition active:scale-95 ' +
                    (isSel
                      ? 'border-violet-500 bg-violet-100 text-violet-900 ring-2 ring-violet-200 shadow-md'
                      : isExplored
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md')
                  }
                >
                  {isExplored && <span aria-hidden className="mr-0.5">✓</span>}
                  {g.gland}
                </button>
              )
            })}
          </div>

          {current ? (
            <div className="animate-pop rounded-xl border border-violet-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white shadow">
                  {GLAND_POSITIONS.indexOf(current) + 1}
                </span>
                <h3 className="text-lg font-extrabold text-[#111111]">{current.gland}</h3>
              </div>

              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <b className="text-[#111111]">특징 ·</b> {current.characteristic}
              </p>

              <p className="mt-3 mb-1.5 text-xs font-bold text-violet-700">분비하는 호르몬</p>
              <div className="grid gap-2">
                {current.hormones.map((h) => (
                  <div
                    key={h.name}
                    className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-violet-50 px-3 py-2 ring-1 ring-violet-100"
                  >
                    <span className="rounded-md bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">
                      {h.name}
                    </span>
                    <span className="text-sm text-slate-700">{h.function}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center text-sm text-slate-400">
              👈 왼쪽 그림에서 내분비샘(●)이나 위 이름을 눌러 알아보세요.
            </div>
          )}

          {allExplored && (
            <Feedback type="success">
              6개 내분비샘을 모두 살펴봤어요! 각 샘의 위치·특징과 분비 호르몬을 잘 정리했어요.
            </Feedback>
          )}
        </div>
      </div>
    </div>
  )
}

/* 활동 2-2 호르몬 3단 짝 맞추기 */
export function Activity22({ onDone, done }: { onDone: () => void; done: boolean }) {
  return (
    <div>
      <p className="mb-3 text-sm text-slate-600">
        <b>내분비샘 · 호르몬</b>을 그 <b>기능</b>과 짝지어, 하나의 호르몬 도감 카드로 완성해요.
      </p>
      <MatchingActivity
        solved={done}
        onSolved={onDone}
        leftTitle="내분비샘 · 호르몬"
        rightTitle="기능"
        hints={[
          '혈당량을 낮추는지 높이는지부터 구분해 보세요(인슐린 vs 글루카곤).',
          '뇌하수체=성장, 갑상샘=물질대사, 부신=혈당·심장, 이자=혈당, 정소/난소=2차 성징.',
        ]}
        pairs={[
          { id: 'p1', left: '뇌하수체 · 성장 호르몬', right: '몸의 성장을 촉진한다.' },
          { id: 'p2', left: '갑상샘 · 티록신', right: '세포 호흡을 촉진하고 물질대사를 조절한다.' },
          { id: 'p3', left: '부신 · 아드레날린', right: '혈당량을 높이고 심장 박동을 빠르게 한다.' },
          { id: 'p4', left: '이자 · 인슐린', right: '혈당량을 낮춘다.' },
          { id: 'p5', left: '이자 · 글루카곤', right: '혈당량을 높인다.' },
          { id: 'p6', left: '정소 · 남성 호르몬', right: '남자의 2차 성징 발달에 관여한다.' },
          { id: 'p7', left: '난소 · 여성 호르몬', right: '여자의 2차 성징 발달에 관여한다.' },
        ]}
      />
    </div>
  )
}

/* 활동 2-3 과다·결핍 병원 매칭 */
export function Activity23({ onDone, done }: { onDone: () => void; done: boolean }) {
  return (
    <div>
      <p className="mb-2 text-xs text-slate-400">
        ※ 아래 내용은 중학교 과학 개념 학습용 예시이며 실제 진단이 아닙니다.
      </p>
      <p className="mb-3 text-sm text-slate-600">증상·상황을 관련 호르몬 이상과 짝지어요.</p>
      <MatchingActivity
        solved={done}
        onSolved={onDone}
        leftTitle="증상 · 상황"
        rightTitle="관련 호르몬 이상"
        hints={[
          '성장이면 성장 호르몬, 물질대사면 티록신, 혈당이면 인슐린을 떠올려요.',
          '“부족/과다” 방향까지 맞춰 보세요.',
        ]}
        pairs={[
          { id: 'a1', left: '성장기에 키가 잘 자라지 않는다(소인증).', right: '성장 호르몬 부족' },
          { id: 'a2', left: '성장기에 지나치게 크게 자란다(거인증).', right: '성장 호르몬 과다' },
          { id: 'a3', left: '혈당량 조절이 어렵다(당뇨병).', right: '인슐린 분비·작용 부족' },
          { id: 'a4', left: '물질대사가 지나치게 활발하다.', right: '티록신 과다(기능 항진)' },
          { id: 'a5', left: '물질대사가 지나치게 느리다.', right: '티록신 부족(기능 저하)' },
          { id: 'a6', left: '2차 성징·생식 기능 조절에 문제가 있다.', right: '성호르몬 이상' },
        ]}
      />
    </div>
  )
}
