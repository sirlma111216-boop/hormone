import { StepFlow } from './StepFlow'
import { SingleChoice, ImageOrFallback } from './ui'
import { FillBlankActivity } from './FillBlankActivity'
import { TempControlFallback, GlucoseLoopFallback } from './diagrams'

/* 활동 3-1 체온·혈당 조절 그림 정리 (교과서 그림 확인 → 간단 확인 문제) */
export function Section3Review({ onDone, done }: { onDone: () => void; done: boolean }) {
  return (
    <div>
      <p className="mb-3 text-sm text-slate-600">
        아래 <b>교과서 그림 두 장</b>으로 체온 조절과 혈당량 조절을 확인해요. 그림을 보고 아래 확인
        문제를 풀면 완료돼요!
      </p>

      {/* 그림 1 · 체온 조절 */}
      <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <figcaption className="border-b border-slate-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
          🌡️ 체온 조절 과정 (더울 때 · 추울 때)
        </figcaption>
        <div className="p-2">
          <ImageOrFallback
            src="/assets/temperature_control.png"
            alt="체온 조절 과정 그림"
            fallback={<TempControlFallback />}
          />
        </div>
        <p className="px-4 pb-3 text-center text-xs text-slate-400">
          분홍 화살표 = 신경의 작용, 초록 화살표 = 호르몬의 작용
        </p>
      </figure>

      {/* 그림 2 · 혈당량 조절 */}
      <figure className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <figcaption className="border-b border-slate-100 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
          🩸 혈당량 조절 과정 (인슐린 · 글루카곤)
        </figcaption>
        <div className="p-2">
          <ImageOrFallback
            src="/assets/blood_glucose_control.png"
            alt="혈당량 조절 과정 그림"
            fallback={<GlucoseLoopFallback />}
          />
        </div>
        <p className="px-4 pb-3 text-center text-xs text-slate-400">
          정상 혈당량 : 혈액 100 mL당 70~90 mg
        </p>
      </figure>

      <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#111111]">
        <span className="h-2 w-2 rounded bg-[#111111]" /> 그림에서 확인하기
      </h3>

      <StepFlow
        onAllDone={onDone}
        initiallyComplete={done}
        steps={[
          {
            title: '① 더울 때 (체온 그림)',
            render: (solve, d) => (
              <FillBlankActivity
                solved={d}
                onSolved={solve}
                before="더울 때는 피부 혈관이 "
                after=" 되고 땀 분비가 늘어, 몸 밖으로 나가는 열이 증가해 체온이 낮아져요."
                options={['확장', '수축']}
                answer="확장"
                hint="더울 때는 열을 내보내야 하니 혈관이 넓어져요."
              />
            ),
          },
          {
            title: '② 추울 때 (체온 그림)',
            render: (solve, d) => (
              <SingleChoice
                solvedInit={d}
                onSolved={solve}
                prompt="추울 때 갑상샘에서 분비가 늘어, 세포 호흡을 촉진해 열 발생을 늘리는 호르몬은?"
                revealText="추울 때는 티록신 분비가 늘어 열 발생량을 높여요. (호르몬의 작용)"
                options={[
                  { id: 'a', correct: true, label: '티록신' },
                  { id: 'b', label: '인슐린', rebut: '인슐린은 혈당을 낮추는 호르몬이에요. 체온과 관련해 열을 늘리는 건 티록신이에요.' },
                  { id: 'c', label: '글루카곤', rebut: '글루카곤은 혈당을 높이는 호르몬이에요. 열 발생은 티록신이 담당해요.' },
                ]}
              />
            ),
          },
          {
            title: '③ 식사 후 (혈당 그림)',
            render: (solve, d) => (
              <SingleChoice
                solvedInit={d}
                onSolved={solve}
                prompt="식사 후 혈당량이 높아지면, 이자에서 분비되어 혈당량을 낮추는 호르몬은?"
                revealText="혈당량이 높으면 인슐린이 분비되어 세포 흡수·간 저장으로 혈당량을 낮춰요."
                options={[
                  { id: 'a', correct: true, label: '인슐린' },
                  { id: 'b', label: '글루카곤', rebut: '글루카곤은 혈당량을 높이는 호르몬이에요. 지금은 낮춰야 해요.' },
                  { id: 'c', label: '티록신', rebut: '티록신은 물질대사·체온과 관련돼요. 혈당 조절은 인슐린/글루카곤이에요.' },
                ]}
              />
            ),
          },
          {
            title: '④ 공복·운동 후 (혈당 그림)',
            render: (solve, d) => (
              <SingleChoice
                solvedInit={d}
                onSolved={solve}
                prompt="공복·운동 후 혈당량이 낮아지면, 이자에서 분비되어 혈당량을 높이는 호르몬은?"
                revealText="혈당량이 낮으면 글루카곤이 분비되어 간의 글리코젠을 분해해 혈당량을 높여요."
                options={[
                  { id: 'a', correct: true, label: '글루카곤' },
                  { id: 'b', label: '인슐린', rebut: '인슐린은 혈당량을 낮추는 호르몬이에요. 지금은 높여야 해요.' },
                  { id: 'c', label: '아드레날린', rebut: '혈당량을 올리는 데는 부신의 아드레날린도 관여하지만, 이자에서 나오는 대표 호르몬은 글루카곤이에요.' },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  )
}
