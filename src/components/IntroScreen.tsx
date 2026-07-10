import { useProgress } from '../store'
import { ImageOrFallback, Panel } from './ui'
import { SaunaFallback } from './diagrams'

const PREDICTIONS = [
  '몸이 환경에 맞게 조절하기 때문이다.',
  '몸이 주변 온도와 완전히 같아지기 때문이다.',
  '몸속 기관이 아무 변화도 하지 않기 때문이다.',
]
const CORRECT = 0

export function IntroScreen({ onGoSection1 }: { onGoSection1: () => void }) {
  const { state, setIntroPrediction, confirmIntro, isSectionComplete } = useProgress()
  const picked = state.introPrediction
  const section1Done = isSectionComplete('section1')
  const showConfirm = picked !== null && section1Done && !state.introConfirmed

  return (
    <Panel className="mb-6 overflow-hidden">
      <div className="grid gap-6 p-6 sm:grid-cols-[minmax(0,280px)_1fr] sm:items-center sm:p-8">
        <ImageOrFallback src="/assets/sauna_intro.png" alt="찜질방 체온 유지" fallback={<SaunaFallback />} />
        <div>
          <span className="inline-block rounded-full bg-[#f5f5f5] px-3 py-1 text-xs font-semibold text-[#111111]">
            도입 미션 · 예측으로 시작
          </span>
          <h2 className="font-display mt-3 text-2xl font-semibold leading-tight text-[#111111] sm:text-[28px]">
            뜨거운 방에 들어가도, 추운 방에 들어가도 우리 몸은 왜 37 ℃ 근처를 유지하려고 할까?
          </h2>

          {picked === null ? (
            <div className="mt-4 grid gap-2.5">
              {PREDICTIONS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setIntroPrediction(i)}
                  className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-left text-sm font-medium text-[#374151] transition hover:border-[#111111] hover:bg-[#f5f5f5] active:scale-[0.98]"
                >
                  {p}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <div className="rounded-lg bg-[#f5f5f5] px-4 py-3 text-sm">
                <span className="font-semibold text-[#111111]">내 첫 예측 :</span>{' '}
                <span className="text-[#374151]">{PREDICTIONS[picked]}</span>
              </div>

              {!section1Done && (
                <div className="mt-4">
                  <p className="text-sm text-[#374151]">
                    정답을 바로 알려주지 않을게요. <b className="text-[#111111]">정말 그럴까? 직접 확인해 보자!</b> 분류 1을
                    완료하면 이 예측으로 돌아와 스스로 확인할 수 있어요.
                  </p>
                  <button
                    onClick={onGoSection1}
                    className="mt-4 rounded-lg bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#242424] active:scale-95"
                  >
                    분류 1로 확인하러 가기 →
                  </button>
                </div>
              )}

              {showConfirm && (
                <div className="animate-pop mt-4 rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-200">
                  <p className="text-sm font-semibold text-emerald-800">🔎 내 첫 예측이 맞았을까?</p>
                  <p className="mt-1 text-sm text-[#374151]">
                    항상성은 <b>환경이 변해도 몸의 상태를 일정하게 조절</b>하려는 성질이에요.
                    {picked === CORRECT ? (
                      <span className="font-semibold text-emerald-700"> 첫 예측이 정확했어요! 🎉</span>
                    ) : (
                      <span className="font-semibold text-orange-600">
                        {' '}첫 예측과 조금 달랐죠? 이제 '환경에 맞게 조절한다'가 맞다는 걸 알게 됐어요.
                      </span>
                    )}
                  </p>
                  <button
                    onClick={confirmIntro}
                    className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    확인했어요
                  </button>
                </div>
              )}

              {section1Done && state.introConfirmed && (
                <p className="mt-3 text-sm text-emerald-600">✓ 예측–확인 완료! 다음 분류로 나아가요.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Panel>
  )
}
