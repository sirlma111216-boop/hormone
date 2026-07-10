import { StepFlow } from './StepFlow'
import { SingleChoice } from './ui'
import { FillBlankActivity } from './FillBlankActivity'
import { SortSequenceActivity } from './SortSequenceActivity'
import { HomeostasisLoop } from './HomeostasisLoop'
import { GlucoseLoopFallback } from './diagrams'
import { ImageOrFallback } from './ui'
import {
  HOT_SEQUENCE,
  COLD_SEQUENCE,
  GLUCOSE_AFTER_MEAL,
  GLUCOSE_LOW,
} from '../data/homeostasis'
import { RefNote } from './shared'

/* 활동 3-2 체온 조절 순서 배열 */
export function Activity32({ onDone, done }: { onDone: () => void; done: boolean }) {
  return (
    <div>
      <p className="mb-3 text-sm text-slate-600">
        더울 때와 추울 때, 두 조절 경로를 순서대로 완성해요.
      </p>
      <StepFlow
        onAllDone={onDone}
        initiallyComplete={done}
        steps={[
          {
            title: '☀️ 더울 때 경로 배열',
            render: (solve, d) => (
              <SortSequenceActivity
                solved={d}
                onSolved={solve}
                correctOrder={HOT_SEQUENCE}
                hints={[
                  '자극 → 체온 변화 → 뇌 감지 → 몸의 반응 → 열 방출/발생 → 체온 회복 순서예요.',
                  '더울 때는 혈관 확장·땀 분비로 열을 “방출”해 체온을 낮춰요.',
                ]}
              />
            ),
          },
          {
            title: '❄️ 추울 때 경로 배열',
            render: (solve, d) => (
              <SortSequenceActivity
                solved={d}
                onSolved={solve}
                correctOrder={COLD_SEQUENCE}
                hints={[
                  '추울 때는 혈관 수축·몸 떨림·티록신 증가로 열을 “지키고 만들어” 체온을 올려요.',
                  '열 방출 감소 + 열 발생 증가 → 체온 상승 → 정상 체온.',
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  )
}

/* 활동 3-3 혈당량 조절 실험실 */
export function Activity33({ onDone, done }: { onDone: () => void; done: boolean }) {
  return (
    <div>
      <RefNote>
        정상 혈당량은 <b>혈액 100 mL당 70~90 mg</b>. 이자에서 나오는 인슐린과 글루카곤이 서로 반대로
        작용해 혈당량을 조절해요.
      </RefNote>
      <div className="mb-4">
        <ImageOrFallback
          src="/assets/blood_glucose_control.png"
          alt="혈당량 조절 과정"
          fallback={<GlucoseLoopFallback />}
        />
      </div>
      <StepFlow
        onAllDone={onDone}
        initiallyComplete={done}
        steps={[
          {
            title: '① 식사 후 — 필요한 호르몬 예측',
            render: (solve, d) => (
              <SingleChoice
                solvedInit={d}
                onSolved={solve}
                prompt="식사 후 혈당량이 높아졌어요. 어떤 호르몬이 필요할까요?"
                revealText="혈당량이 높을 때는 인슐린이 분비되어 혈당량을 낮춰요."
                options={[
                  { id: 'a', correct: true, label: '인슐린' },
                  { id: 'b', label: '글루카곤', rebut: '글루카곤은 혈당량을 “높이는” 호르몬이에요. 지금은 낮춰야 해요.' },
                  { id: 'c', label: '티록신', rebut: '티록신은 물질대사·체온과 관련돼요. 혈당량 조절은 인슐린/글루카곤이에요.' },
                ]}
              />
            ),
          },
          {
            title: '② 식사 후 — 조절 과정 배열 (함정 카드 주의)',
            render: (solve, d) => (
              <SortSequenceActivity
                solved={d}
                onSolved={solve}
                correctOrder={GLUCOSE_AFTER_MEAL}
                trap={{
                  label: '인슐린이 포도당을 없앤다.',
                  rebut:
                    '인슐린은 포도당을 없애는 게 아니라, 세포가 흡수하거나 간에 글리코젠으로 저장하도록 도와 혈당량을 낮춰요.',
                }}
                hints={[
                  '식사 → 흡수 → 혈당 증가 → 인슐린 → 세포 흡수·간 저장 → 혈당 감소 → 정상.',
                  '인슐린은 포도당을 “없애는” 게 아니라 흡수·저장을 “돕는” 거예요.',
                ]}
              />
            ),
          },
          {
            title: '③ 공복·운동 후 — 필요한 호르몬 예측',
            render: (solve, d) => (
              <SingleChoice
                solvedInit={d}
                onSolved={solve}
                prompt="공복·운동 후 혈당량이 낮아졌어요. 어떤 호르몬이 필요할까요?"
                revealText="혈당량이 낮을 때는 글루카곤이 분비되어 혈당량을 높여요."
                options={[
                  { id: 'a', correct: true, label: '글루카곤' },
                  { id: 'b', label: '인슐린', rebut: '인슐린은 혈당량을 “낮추는” 호르몬이에요. 지금은 높여야 해요.' },
                  { id: 'c', label: '성장 호르몬', rebut: '성장 호르몬은 성장과 관련돼요. 혈당을 높이는 건 글루카곤이에요.' },
                ]}
              />
            ),
          },
          {
            title: '④ 공복·운동 후 — 조절 과정 배열',
            render: (solve, d) => (
              <SortSequenceActivity
                solved={d}
                onSolved={solve}
                correctOrder={GLUCOSE_LOW}
                hints={[
                  '혈당 감소 → 글루카곤 → 간의 글리코젠 분해 → 포도당 방출 → 혈당 증가 → 정상.',
                  '글루카곤은 간에 저장된 글리코젠을 포도당으로 “분해”해 혈당량을 높여요.',
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  )
}

/* 활동 3-5 되돌림 화살표 완성 */
export function Activity35({ onDone, done }: { onDone: () => void; done: boolean }) {
  return (
    <div>
      <p className="mb-3 text-sm text-slate-600">
        체온 조절과 혈당량 조절의 공통 원리를 정리해요.
      </p>
      <div className="mb-4">
        <HomeostasisLoop lit={4} />
      </div>
      <StepFlow
        onAllDone={onDone}
        initiallyComplete={done}
        steps={[
          {
            title: '빈칸 채우기 — 항상성의 정의',
            render: (solve, d) => (
              <FillBlankActivity
                solved={d}
                onSolved={solve}
                before="항상성은 몸의 상태가 정상 범위에서 벗어났을 때, 신경과 호르몬의 작용으로 다시 "
                after=" 범위로 되돌리는 과정이다."
                options={['정상', '최대', '바깥']}
                answer="정상"
                hint="게이지가 돌아가는 목표 지점을 떠올려 보세요."
              />
            ),
          },
          {
            title: '이유 고르기 — 공통 원리',
            render: (solve, d) => (
              <SingleChoice
                solvedInit={d}
                onSolved={solve}
                prompt="체온 조절과 혈당량 조절의 공통 원리로 가장 알맞은 것은?"
                revealText="정상 범위에서 벗어나면 다시 정상 범위로 되돌린다 — 이것이 항상성의 공통 원리예요."
                options={[
                  { id: 'a', correct: true, label: '정상 범위에서 벗어나면 다시 정상 범위로 되돌린다.' },
                  { id: 'b', label: '환경과 완전히 같아진다.', rebut: '환경과 같아지는 게 아니라, 몸의 정상 범위로 되돌려요.' },
                  { id: 'c', label: '한 번 변하면 그대로 유지된다.', rebut: '그대로 두면 위험해요. 몸은 다시 정상으로 되돌려요.' },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  )
}
