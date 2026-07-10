import { useState, type ReactNode } from 'react'

/* ---------- 기본 카드 (흰 캔버스 + 헤어라인, 12px) ---------- */
export function Panel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={
        'rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e5e7eb] ' +
        className
      }
    >
      {children}
    </div>
  )
}

/* ---------- 버튼 (near-black primary, 8px) ---------- */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        'rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ' +
        'bg-[#111111] hover:bg-[#242424] active:scale-[0.98] ' +
        'disabled:cursor-not-allowed disabled:bg-[#e5e7eb] disabled:text-[#6b7280] ' +
        className
      }
    >
      {children}
    </button>
  )
}

export function GhostButton({
  children,
  onClick,
  active,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={
        'rounded-lg border px-5 py-2.5 text-sm font-semibold transition active:scale-[0.98] ' +
        (active
          ? 'border-[#111111] bg-[#f5f5f5] text-[#111111] '
          : 'border-[#e5e7eb] bg-white text-[#111111] hover:border-[#111111] hover:bg-[#f5f5f5] ') +
        className
      }
    >
      {children}
    </button>
  )
}

/* ---------- 완료 배지 (시맨틱 success) ---------- */
export function DoneBadge({ label = '완료' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      <span aria-hidden>✓</span> {label}
    </span>
  )
}

/* ---------- 성공/실패 피드백 (색+아이콘+문구 병기, 접근성) ---------- */
export function Feedback({
  type,
  children,
}: {
  type: 'success' | 'hint' | 'rebut'
  children: ReactNode
}) {
  const style =
    type === 'success'
      ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
      : type === 'rebut'
        ? 'bg-orange-50 text-orange-800 ring-orange-200'
        : 'bg-amber-50 text-amber-800 ring-amber-200'
  const icon = type === 'success' ? '🎉' : type === 'rebut' ? '🔎' : '💡'
  const role = type === 'success' ? 'status' : 'alert'
  return (
    <div
      role={role}
      className={`animate-pop mt-3 flex items-start gap-2 rounded-lg px-3.5 py-3 text-sm font-medium ring-1 ${style}`}
    >
      <span aria-hidden className="text-base leading-5">
        {icon}
      </span>
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}

/* ---------- 단계적 힌트 표시 ---------- */
export function HintBox({ hints, attempt }: { hints: string[]; attempt: number }) {
  if (attempt < 1 || hints.length === 0) return null
  const idx = Math.min(attempt - 1, hints.length - 1)
  return (
    <Feedback type="hint">
      <span className="font-semibold">힌트{attempt >= 2 ? ' (자세히)' : ''}:</span>{' '}
      {hints[idx]}
    </Feedback>
  )
}

/* ---------- 단일 선택 (예측/이유 고르기 공용) ---------- */
export interface ChoiceOption {
  id: string
  label: string
  correct?: boolean
  rebut?: string
}

export function SingleChoice({
  prompt,
  options,
  hints = [],
  revealText,
  onSolved,
  solvedInit = false,
}: {
  prompt: ReactNode
  options: ChoiceOption[]
  hints?: string[]
  revealText?: ReactNode
  onSolved: () => void
  solvedInit?: boolean
}) {
  const [solved, setSolved] = useState(solvedInit)
  const [attempt, setAttempt] = useState(0)
  const [wrongId, setWrongId] = useState<string | null>(null)
  const [shakeId, setShakeId] = useState<string | null>(null)

  const pick = (opt: ChoiceOption) => {
    if (solved) return
    if (opt.correct) {
      setSolved(true)
      setWrongId(null)
      onSolved()
    } else {
      setAttempt((a) => a + 1)
      setWrongId(opt.id)
      setShakeId(opt.id)
      setTimeout(() => setShakeId(null), 450)
    }
  }

  const wrongOpt = options.find((o) => o.id === wrongId)

  return (
    <div>
      <p className="mb-3 font-semibold text-[#111111]">{prompt}</p>
      <div className="grid gap-2.5">
        {options.map((o) => {
          const isSolvedCorrect = solved && o.correct
          const isWrong = !solved && wrongId === o.id
          return (
            <button
              key={o.id}
              onClick={() => pick(o)}
              disabled={solved}
              className={
                'flex items-center gap-2.5 rounded-lg border px-4 py-3 text-left text-sm font-medium transition ' +
                (shakeId === o.id ? 'animate-shake ' : '') +
                (isSolvedCorrect
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800 '
                  : isWrong
                    ? 'border-orange-400 bg-orange-50 text-orange-800 '
                    : solved
                      ? 'border-[#f3f4f6] bg-[#f8f9fa] text-[#9ca3af] '
                      : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#111111] hover:bg-[#f5f5f5] ')
              }
            >
              <span
                aria-hidden
                className={
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ' +
                  (isSolvedCorrect
                    ? 'bg-emerald-500 text-white'
                    : isWrong
                      ? 'bg-orange-500 text-white'
                      : 'bg-[#e5e7eb] text-[#6b7280]')
                }
              >
                {isSolvedCorrect ? '✓' : isWrong ? '✕' : ''}
              </span>
              {o.label}
            </button>
          )
        })}
      </div>

      {!solved && wrongOpt?.rebut && <Feedback type="rebut">{wrongOpt.rebut}</Feedback>}
      {!solved && !wrongOpt?.rebut && <HintBox hints={hints} attempt={attempt} />}
      {solved && revealText && <Feedback type="success">{revealText}</Feedback>}
    </div>
  )
}

/* ---------- 이미지 or 교과서형 SVG 대체 ---------- */
export function ImageOrFallback({
  src,
  alt,
  fallback,
  className = '',
}: {
  src: string
  alt: string
  fallback: ReactNode
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <div className={className}>{fallback}</div>
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={'w-full rounded-xl object-contain ' + className}
    />
  )
}

/* ---------- 활동 완료 표시줄 ---------- */
export function ActivityDoneBar() {
  return (
    <div className="animate-pop mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
      <span aria-hidden>🏅</span> 이 활동을 완료했어요! 위쪽 목록에서 다음 활동으로 넘어가세요.
    </div>
  )
}
