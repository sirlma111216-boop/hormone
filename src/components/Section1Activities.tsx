import { StepFlow } from './StepFlow'
import { SingleChoice } from './ui'
import { FillBlankActivity } from './FillBlankActivity'
import { SortSequenceActivity } from './SortSequenceActivity'
import { ClassifyActivity } from './ClassifyActivity'
import { NerveHormoneNote } from './shared'

function ChipRow({ items }: { items: string[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-lg bg-[#f5f5f5] px-3 py-2 text-sm font-medium text-[#374151] ring-1 ring-[#e5e7eb]"
        >
          {t}
        </span>
      ))}
    </div>
  )
}

/* 활동 1-1 항상성 탐정 */
export function Activity11({ onDone, done }: { onDone: () => void; done: boolean }) {
  return (
    <div>
      <p className="mb-2 text-sm text-slate-600">아래 네 상황을 살펴보고, 공통점을 찾아봐요.</p>
      <ChipRow
        items={[
          '더울 때 땀이 난다',
          '추울 때 몸이 떨린다',
          '식사 후 높아진 혈당량이 다시 낮아진다',
          '운동 후 낮아진 혈당량이 다시 올라간다',
        ]}
      />
      <StepFlow
        onAllDone={onDone}
        initiallyComplete={done}
        steps={[
          {
            title: '예측하기 — 네 상황의 공통점은?',
            render: (solve, d) => (
              <SingleChoice
                solvedInit={d}
                onSolved={solve}
                prompt="네 상황에 공통으로 담긴 몸의 반응은 무엇일까요?"
                revealText="맞아요! 항상성은 몸의 상태를 일정하게 유지하려는 성질이에요."
                hints={[
                  "네 상황 모두 '다시 원래 상태로 되돌아온다'는 점을 떠올려 보세요.",
                  '환경을 따라가는 게 아니라, 몸 상태를 일정하게 지키는 거예요.',
                ]}
                options={[
                  { id: 'a', correct: true, label: '몸속 상태를 일정하게 유지하려는 반응이다.' },
                  {
                    id: 'b',
                    label: '몸이 외부 환경과 완전히 같아지는 반응이다.',
                    rebut:
                      '환경과 같아진다면 더울 때 체온이 계속 올라야 해요. 몸은 오히려 원래 상태로 되돌리죠.',
                  },
                  {
                    id: 'c',
                    label: '몸이 아무 일도 하지 않는 상태이다.',
                    rebut: '땀, 떨림처럼 몸은 분명히 반응하고 있어요.',
                  },
                ]}
              />
            ),
          },
          {
            title: '개념 완성 — 빈칸 채우기',
            render: (solve, d) => (
              <FillBlankActivity
                solved={d}
                onSolved={solve}
                before="항상성은 몸 안팎의 환경이 변해도 몸의 상태를 "
                after=" 하게 유지하려는 성질이다."
                options={['일정', '똑같', '제각각']}
                answer="일정"
                hint="환경이 변해도 몸 상태는 '한결같이' 유지돼요."
              />
            ),
          },
          {
            title: '이유 고르기',
            render: (solve, d) => (
              <SingleChoice
                solvedInit={d}
                onSolved={solve}
                prompt="네 상황이 모두 '다시 원래대로' 돌아오는 이유로 가장 알맞은 것은?"
                revealText="정상 범위를 벗어나면 다시 정상으로 되돌리는 것 — 이게 항상성의 핵심이에요."
                options={[
                  { id: 'a', correct: true, label: '정상 범위에서 벗어난 값을 다시 되돌리기 때문' },
                  {
                    id: 'b',
                    label: '환경과 같아지려 하기 때문',
                    rebut: '환경과 같아지는 게 아니라, 정상 범위로 되돌아오는 거예요.',
                  },
                  { id: 'c', label: '우연히 그런 것', rebut: '네 상황 모두 그런 걸 보면 우연이 아니겠죠?' },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  )
}

/* 활동 1-2 호르몬 이동 경로 완성 */
export function Activity12({ onDone, done }: { onDone: () => void; done: boolean }) {
  return (
    <div>
      <p className="mb-3 text-sm text-slate-600">
        호르몬이 만들어져서 몸의 기능을 조절하기까지, 순서를 완성해 봐요. (함정 카드가 섞여 있어요!)
      </p>
      <StepFlow
        onAllDone={onDone}
        initiallyComplete={done}
        steps={[
          {
            title: '호르몬 이동 경로 배열하기',
            hint: "함정 카드('온몸의 모든 세포에 작용한다')를 넣으면 반증하고 되돌려줘요.",
            render: (solve, d) => (
              <SortSequenceActivity
                solved={d}
                onSolved={solve}
                correctOrder={[
                  '내분비샘에서 호르몬이 만들어진다.',
                  '호르몬이 혈액으로 분비된다.',
                  '혈관을 따라 온몸으로 이동한다.',
                  '특정 세포나 기관에 작용한다.',
                  '몸의 기능이 조절된다.',
                ]}
                trap={{
                  label: '온몸의 모든 세포에 작용한다.',
                  rebut:
                    '호르몬은 온몸으로 이동하지만, 아무 세포에나 작용하는 게 아니라 특정 세포·기관에만 작용해요.',
                }}
                hints={[
                  '먼저 어디에서 호르몬이 만들어질까요? 시작점을 떠올려 보세요.',
                  '만들어짐 → 혈액으로 분비 → 이동 → 특정 세포·기관 작용 → 기능 조절 순서예요.',
                ]}
              />
            ),
          },
          {
            title: '이유 고르기 — 호르몬은 어디에 작용할까?',
            render: (solve, d) => (
              <SingleChoice
                solvedInit={d}
                onSolved={solve}
                prompt="호르몬은 혈액을 타고 온몸으로 이동한 뒤, 어디에 작용할까요?"
                revealText="호르몬은 내분비샘에서 만들어져 혈액을 통해 이동하고, 특정 세포나 기관에 신호를 전달해 몸의 기능을 조절해요."
                options={[
                  { id: 'a', correct: true, label: '특정 세포나 기관에만 작용한다.' },
                  {
                    id: 'b',
                    label: '온몸의 모든 세포에 똑같이 작용한다.',
                    rebut: '이동은 온몸으로 하지만, 작용은 특정 세포·기관에만 해요.',
                  },
                  { id: 'c', label: '아무 곳에도 작용하지 않는다.', rebut: '작용하지 않으면 몸의 기능을 조절할 수 없겠죠.' },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  )
}

/* 활동 1-3 신경 vs 호르몬 분류 */
export function Activity13({ onDone, done }: { onDone: () => void; done: boolean }) {
  return (
    <div>
      <NerveHormoneNote />
      <StepFlow
        onAllDone={onDone}
        initiallyComplete={done}
        steps={[
          {
            title: '카드를 신경 / 호르몬 상자로 분류하기',
            render: (solve, d) => (
              <ClassifyActivity
                solved={d}
                onSolved={solve}
                buckets={[
                  { id: 'nerve', label: '신경', icon: '⚡' },
                  { id: 'hormone', label: '호르몬', icon: '🩸' },
                ]}
                hints={[
                  "'무엇을 통해' 신호가 전달되는지 떠올려 보세요 — 뉴런인가요, 혈액인가요?",
                  '신경=뉴런·빠름·좁음·짧음, 호르몬=혈액·느림·넓음·오래.',
                ]}
                cards={[
                  { id: 'n1', label: '뉴런을 통해 신호 전달', bucketId: 'nerve' },
                  { id: 'n2', label: '빠르게 전달됨', bucketId: 'nerve' },
                  { id: 'n3', label: '효과가 비교적 짧게 나타남', bucketId: 'nerve' },
                  { id: 'n4', label: '작용 범위가 비교적 좁음', bucketId: 'nerve' },
                  { id: 'n5', label: '자극에 빠르게 반응할 때 중요함', bucketId: 'nerve' },
                  { id: 'h1', label: '혈액을 통해 신호 전달', bucketId: 'hormone' },
                  { id: 'h2', label: '신경보다 천천히 전달됨', bucketId: 'hormone' },
                  { id: 'h3', label: '효과가 비교적 오래 지속됨', bucketId: 'hormone' },
                  { id: 'h4', label: '작용 범위가 넓음', bucketId: 'hormone' },
                  { id: 'h5', label: '몸의 기능을 지속적으로 조절할 때 중요함', bucketId: 'hormone' },
                ]}
              />
            ),
          },
          {
            title: '이유 고르기',
            render: (solve, d) => (
              <SingleChoice
                solvedInit={d}
                onSolved={solve}
                prompt="호르몬의 효과가 오래 지속되는 이유로 가장 알맞은 것은?"
                revealText="호르몬은 혈액을 타고 온몸으로 퍼져 작용하기 때문에 효과가 넓고 오래 지속돼요."
                options={[
                  { id: 'a', correct: true, label: '혈액을 타고 온몸으로 퍼져 작용하기 때문' },
                  { id: 'b', label: '뉴런이 빠르기 때문', rebut: '뉴런은 신경의 특징이에요. 호르몬은 혈액을 이용해요.' },
                  { id: 'c', label: '신경이 없기 때문', rebut: '신경이 없어서가 아니라, 혈액을 통해 넓게 퍼지기 때문이에요.' },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  )
}
