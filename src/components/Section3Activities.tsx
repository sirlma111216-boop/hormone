import { StepFlow } from './StepFlow'
import { SingleChoice } from './ui'
import { FillBlankActivity } from './FillBlankActivity'
import { HomeostasisLoop } from './HomeostasisLoop'

/* 활동 3-4 되돌림 화살표 완성 */
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
