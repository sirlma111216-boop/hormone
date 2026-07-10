import { useMemo, useState } from 'react'
import { GLAND_POSITIONS } from '../data/hormones'
import { BodySilhouette } from './diagrams'
import { Feedback, HintBox } from './ui'
import { MatchingActivity } from './MatchingActivity'
import { shuffle } from '../lib/util'
import { RefNote } from './shared'

/* 활동 2-1 몸속 호르몬 지도 (예측 배치 → 스스로 채점) */
export function Activity21({ onDone, done }: { onDone: () => void; done: boolean }) {
  const labels = useMemo(() => shuffle(GLAND_POSITIONS.map((g) => g.gland)), [])
  const [placed, setPlaced] = useState<Record<string, string>>({}) // spotId -> gland
  const [sel, setSel] = useState<string | null>(null)
  const [hintSpot, setHintSpot] = useState<string | null>(null)
  const [shake, setShake] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [solved, setSolved] = useState(done)

  const usedLabels = Object.values(placed)
  const remaining = labels.filter((l) => !usedLabels.includes(l))

  const clickSpot = (spot: (typeof GLAND_POSITIONS)[number]) => {
    if (solved) return
    if (!sel) {
      // 라벨 미선택 시: 힌트로 그 샘의 호르몬을 알려줌(스스로 채점 보조)
      setHintSpot(spot.id)
      return
    }
    if (sel === spot.gland) {
      const next = { ...placed, [spot.id]: sel }
      setPlaced(next)
      setSel(null)
      setHintSpot(null)
      if (Object.keys(next).length === GLAND_POSITIONS.length) {
        setSolved(true)
        onDone()
      }
    } else {
      setAttempt((a) => a + 1)
      setShake(spot.id)
      setHintSpot(spot.id)
      setTimeout(() => setShake(null), 450)
    }
  }

  return (
    <div>
      <RefNote>
        내분비샘 위치 그림(<code>/assets/endocrine_glands.png</code>)이 있으면 참고하고, 없으면 아래
        몸 도식에 라벨을 배치해요. 위치가 헷갈리면 <b>스팟(●)을 눌러</b> 그 샘의 호르몬 힌트를 볼 수
        있어요.
      </RefNote>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,240px)_1fr] sm:items-start">
        {/* 몸 도식 */}
        <div className="mx-auto">
          <div className="relative">
            <BodySilhouette>
              {GLAND_POSITIONS.map((g) => {
                const label = placed[g.id]
                return (
                  <g key={g.id}>
                    <circle
                      cx={(g.x / 100) * 200}
                      cy={(g.y / 100) * 340}
                      r={label ? 9 : 7}
                      fill={label ? '#10b981' : '#111111'}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </g>
                )
              })}
            </BodySilhouette>
          </div>
          {/* 스팟 버튼(접근성: 실제 클릭 대상) */}
          <div className="mt-2 grid grid-cols-1 gap-1.5">
            {GLAND_POSITIONS.map((g) => {
              const label = placed[g.id]
              return (
                <button
                  key={g.id}
                  onClick={() => clickSpot(g)}
                  disabled={solved}
                  className={
                    'flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ' +
                    (shake === g.id ? 'animate-shake ' : '') +
                    (label
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#111111] hover:bg-[#f5f5f5]')
                  }
                >
                  <span>
                    <span aria-hidden className="mr-1">●</span>
                    {label ? `✓ ${label}` : `위치 ${GLAND_POSITIONS.indexOf(g) + 1}`}
                  </span>
                  {hintSpot === g.id && !label && (
                    <span className="text-xs font-semibold text-[#111111]">💡 {g.hormone} 분비</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 라벨 */}
        <div>
          <p className="mb-1.5 text-xs font-bold text-slate-500">
            내분비샘 라벨 — 누른 뒤 왼쪽에서 알맞은 위치를 클릭
          </p>
          <div className="flex flex-wrap gap-2">
            {remaining.map((l) => (
              <button
                key={l}
                onClick={() => setSel(sel === l ? null : l)}
                disabled={solved}
                className={
                  'rounded-xl border px-4 py-2.5 text-sm font-semibold transition active:scale-95 ' +
                  (sel === l
                    ? 'border-[#111111] bg-[#f5f5f5] text-[#111111] ring-2 ring-[#111111]/15'
                    : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#111111] hover:bg-[#f5f5f5]')
                }
              >
                {sel === l && <span aria-hidden className="mr-1">👉</span>}
                {l}
              </button>
            ))}
            {remaining.length === 0 && (
              <span className="text-sm text-slate-400">라벨을 모두 배치했어요.</span>
            )}
          </div>
          {!solved && <HintBox hints={['그 위치의 샘이 분비하는 호르몬을 떠올려 보세요.', '스팟을 누르면 호르몬 힌트가 나와요. 힌트를 보고 라벨을 맞춰 보세요.']} attempt={attempt} />}
          {solved && <Feedback type="success">내분비샘 위치를 모두 완성했어요!</Feedback>}
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
          '뇌하수체=성장, 갑상샘=물질대사, 이자=혈당, 정소/난소=2차 성징.',
        ]}
        pairs={[
          { id: 'p1', left: '뇌하수체 · 성장 호르몬', right: '몸의 성장을 촉진한다.' },
          { id: 'p2', left: '갑상샘 · 티록신', right: '세포 호흡을 촉진하고 물질대사를 조절한다.' },
          { id: 'p3', left: '이자 · 인슐린', right: '혈당량을 낮춘다.' },
          { id: 'p4', left: '이자 · 글루카곤', right: '혈당량을 높인다.' },
          { id: 'p5', left: '정소 · 남성 호르몬', right: '남자의 2차 성징 발달에 관여한다.' },
          { id: 'p6', left: '난소 · 여성 호르몬', right: '여자의 2차 성징 발달에 관여한다.' },
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
