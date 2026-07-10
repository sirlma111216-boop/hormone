/**
 * 교과서 그림 구조를 본뜬 SVG 대체 도식.
 * 이미지 파일(public/assets)이 없을 때 이 도식이 대신 표시된다.
 */

const FallbackNote = ({ text }: { text: string }) => (
  <p className="mt-1 text-center text-[11px] text-slate-400">
    ※ 교과서 그림 대체 도식 · {text}
  </p>
)

export function SaunaFallback() {
  return (
    <div className="rounded-xl bg-gradient-to-b from-orange-50 to-cyan-50 p-3 ring-1 ring-slate-200">
      <svg viewBox="0 0 320 170" className="w-full">
        <rect x="0" y="0" width="320" height="170" rx="12" fill="#fff7ed" />
        <text x="80" y="26" textAnchor="middle" fontSize="13" fontWeight="700" fill="#c2410c">
          🔥 뜨거운 방
        </text>
        <text x="240" y="26" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0e7490">
          ❄️ 추운 방
        </text>
        {/* 몸 온도계 */}
        <g transform="translate(140,50)">
          <rect x="0" y="0" width="40" height="80" rx="20" fill="#fff" stroke="#0f766e" strokeWidth="2" />
          <circle cx="20" cy="95" r="18" fill="#14b8a6" />
          <rect x="15" y="20" width="10" height="70" rx="5" fill="#14b8a6" />
          <text x="20" y="99" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">
            37℃
          </text>
        </g>
        <text x="160" y="160" textAnchor="middle" fontSize="12" fill="#334155">
          환경이 달라져도 몸은 약 37 ℃를 유지한다
        </text>
      </svg>
      <FallbackNote text="찜질방(체온 유지)" />
    </div>
  )
}

export function NerveHormoneFallback() {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <svg viewBox="0 0 340 160" className="w-full">
        {/* 신경 */}
        <g>
          <text x="80" y="22" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f766e">
            신경 (뉴런)
          </text>
          <line x1="20" y1="55" x2="150" y2="55" stroke="#0f766e" strokeWidth="3" />
          <circle cx="20" cy="55" r="7" fill="#0f766e" />
          <polygon points="150,48 164,55 150,62" fill="#0f766e" />
          <text x="90" y="80" textAnchor="middle" fontSize="11" fill="#334155">⚡ 빠르게 · 좁게 · 짧게</text>
        </g>
        {/* 호르몬 */}
        <g>
          <text x="255" y="22" textAnchor="middle" fontSize="13" fontWeight="800" fill="#b45309">
            호르몬 (혈액)
          </text>
          <path d="M190 55 q40 -20 130 0" stroke="#d97706" strokeWidth="3" fill="none" strokeDasharray="2 5" />
          <circle cx="190" cy="55" r="7" fill="#d97706" />
          {[210, 240, 270, 300].map((cx) => (
            <circle key={cx} cx={cx} cy={49 - (cx - 210) * 0.06} r="3.5" fill="#f59e0b" />
          ))}
          <text x="255" y="80" textAnchor="middle" fontSize="11" fill="#334155">⏳ 천천히 · 넓게 · 오래</text>
        </g>
        <line x1="170" y1="35" x2="170" y2="120" stroke="#e2e8f0" strokeWidth="2" />
        <text x="80" y="120" textAnchor="middle" fontSize="10" fill="#64748b">특정 자극에 빠른 반응</text>
        <text x="255" y="120" textAnchor="middle" fontSize="10" fill="#64748b">기능을 지속적으로 조절</text>
      </svg>
      <FallbackNote text="호르몬과 신경 작용 비교" />
    </div>
  )
}

// 혈당량 조절 순환 고리 (식사→혈당 증가→이자→인슐린→간·세포→혈당 감소)
export function GlucoseLoopFallback() {
  const nodes = [
    { t: '식사', x: 160, y: 18 },
    { t: '혈당 증가', x: 268, y: 70 },
    { t: '이자→인슐린', x: 245, y: 140 },
    { t: '간·세포', x: 75, y: 140 },
    { t: '혈당 감소', x: 52, y: 70 },
  ]
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <svg viewBox="0 0 320 175" className="w-full">
        <circle cx="160" cy="88" r="66" fill="none" stroke="#99f6e4" strokeWidth="2" strokeDasharray="4 4" />
        <text x="160" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f766e">혈당량</text>
        <text x="160" y="99" textAnchor="middle" fontSize="10" fill="#0f766e">70~90 mg/100mL</text>
        {nodes.map((n) => (
          <g key={n.t}>
            <rect x={n.x - 34} y={n.y - 13} width="68" height="26" rx="8" fill="#ecfeff" stroke="#0891b2" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0e7490">
              {n.t}
            </text>
          </g>
        ))}
      </svg>
      <FallbackNote text="혈당량 조절 순환 고리" />
    </div>
  )
}

// 체온 조절: 신경/호르몬 화살표 2색 (교과서 그림 4-13/4-14 방식)
export function TempControlFallback() {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <svg viewBox="0 0 340 150" className="w-full">
        <rect x="130" y="60" width="80" height="30" rx="8" fill="#f0fdfa" stroke="#0f766e" />
        <text x="170" y="79" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f766e">뇌(감지)</text>
        {/* 신경 작용 (실선) */}
        <line x1="130" y1="75" x2="40" y2="40" stroke="#0f766e" strokeWidth="3" />
        <polygon points="40,40 52,42 46,52" fill="#0f766e" />
        <text x="60" y="28" fontSize="10" fill="#0f766e" fontWeight="700">신경의 작용 →</text>
        <text x="20" y="60" fontSize="10" fill="#334155">혈관·땀·떨림</text>
        {/* 호르몬 작용 (점선) */}
        <line x1="210" y1="75" x2="300" y2="40" stroke="#d97706" strokeWidth="3" strokeDasharray="3 4" />
        <polygon points="300,40 288,42 294,52" fill="#d97706" />
        <text x="230" y="28" fontSize="10" fill="#b45309" fontWeight="700">호르몬의 작용 ⇢</text>
        <text x="255" y="60" fontSize="10" fill="#334155">갑상샘→티록신</text>
        <text x="170" y="120" textAnchor="middle" fontSize="10" fill="#64748b">
          체온 조절은 신경과 호르몬이 함께 작용한다
        </text>
      </svg>
      <FallbackNote text="체온 조절(신경/호르몬 구분)" />
    </div>
  )
}

// 몸 실루엣 + 내분비샘 위치 표시 (지도 활동 기본 도식)
export function BodySilhouette({ children }: { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 200 340" className="w-full max-w-[240px]">
      {/* 머리 */}
      <circle cx="100" cy="34" r="24" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
      {/* 목·몸통 */}
      <path
        d="M88 56 L112 56 L118 78 L150 96 L142 190 L120 190 L118 320 L104 320 L100 210 L96 320 L82 320 L80 190 L58 190 L50 96 L82 78 Z"
        fill="#f0f9ff"
        stroke="#38bdf8"
        strokeWidth="2"
      />
      {children}
    </svg>
  )
}
