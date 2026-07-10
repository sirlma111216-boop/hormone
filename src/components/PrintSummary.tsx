import type { ReactNode, CSSProperties } from 'react'
import { HORMONES } from '../data/hormones'
import { SECTIONS } from '../data/sections'
import { TEXTBOOK_IMAGES } from '../data/textbook'
import { useProgress } from '../store'
import {
  NerveHormoneFallback,
  GlucoseLoopFallback,
  TempControlFallback,
} from './diagrams'

const UNIT = 'Ⅳ. 자극과 반응 · 몸의 기능을 조절하는 호르몬 / 항상성'
const INK = '#111111'
const LINE = '#d4d4d4'

/* ---------- 시트 골격 ---------- */
function Sheet({ subtitle, children }: { subtitle: string; children: ReactNode }) {
  return (
    <div
      className="print-sheet"
      style={{
        border: `1.5px solid ${INK}`,
        borderRadius: 14,
        background: '#fff',
        overflow: 'hidden',
        color: '#1f2937',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '18px 22px 16px',
          borderBottom: `2px solid ${INK}`,
        }}
      >
        <div>
          <div style={{ fontSize: '10.5pt', color: '#6b7280', letterSpacing: '-0.01em' }}>{UNIT}</div>
          <h1
            style={{
              margin: '4px 0 0',
              fontSize: '19pt',
              fontWeight: 700,
              color: INK,
              letterSpacing: '-0.03em',
            }}
          >
            {subtitle}
          </h1>
          <div style={{ width: 46, height: 4, background: INK, borderRadius: 2, marginTop: 8 }} />
        </div>
        <div
          style={{
            border: `1px solid ${LINE}`,
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: '10.5pt',
            color: '#374151',
            whiteSpace: 'nowrap',
            lineHeight: 1.9,
          }}
        >
          <div>학번 ________ 이름 ________</div>
          <div>학습 완료 : ☐</div>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ padding: '16px 22px 20px' }}>{children}</div>
    </div>
  )
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: '13pt',
        fontWeight: 700,
        color: INK,
        margin: '16px 0 8px',
        letterSpacing: '-0.02em',
      }}
    >
      <span style={{ width: 8, height: 8, background: INK, borderRadius: 2, display: 'inline-block' }} />
      {children}
    </h3>
  )
}

function Concept({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${LINE}`,
        borderRadius: 10,
        background: '#fafafa',
        padding: '11px 14px',
        fontSize: '11pt',
        lineHeight: 1.6,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  )
}

const th: CSSProperties = {
  border: `1px solid ${INK}`,
  padding: '7px 9px',
  background: '#f2f2f2',
  textAlign: 'left',
  fontWeight: 700,
  fontSize: '10.5pt',
}
const td: CSSProperties = {
  border: `1px solid ${INK}`,
  padding: '7px 9px',
  fontSize: '10.5pt',
  verticalAlign: 'top',
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <table
      className="pg-avoid"
      style={{ width: '100%', borderCollapse: 'collapse', margin: '4px 0 6px' }}
    >
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} style={th}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} style={td}>
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ---------- 그림 ---------- */
function Figure({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <figure
      className="pg-avoid"
      style={{
        flex: '1 1 240px',
        minWidth: 0,
        margin: 0,
        border: `1px solid ${LINE}`,
        borderRadius: 10,
        padding: 8,
        background: '#fff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>{children}</div>
      <figcaption style={{ marginTop: 6, textAlign: 'center', fontSize: '9.5pt', color: '#6b7280' }}>
        {caption}
      </figcaption>
    </figure>
  )
}

function FigureRow({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>{children}</div>
}

function TextbookImg({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 6 }}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}

function DoneList({ sectionId }: { sectionId: string }) {
  const { isDone } = useProgress()
  const sec = SECTIONS.find((s) => s.id === sectionId)!
  return (
    <div
      style={{
        marginTop: 14,
        border: `1px dashed ${LINE}`,
        borderRadius: 10,
        padding: '10px 14px',
        fontSize: '10.5pt',
      }}
    >
      <b style={{ color: INK }}>오늘 완성한 탐구</b>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px', marginTop: 4 }}>
        {sec.activities.map((a) => (
          <span key={a.id} style={{ whiteSpace: 'nowrap' }}>
            {isDone(a.id) ? '☑' : '☐'} {a.title}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- 구역별 시트 ---------- */
function Section1Sheet() {
  return (
    <Sheet subtitle="정리본 1 · 항상성과 호르몬">
      <H3>핵심 개념</H3>
      <Concept>
        <b>항상성</b> : 몸 안팎의 환경이 변해도 몸의 상태를 <b>일정</b>하게 유지하려는 성질.
      </Concept>
      <Concept>
        <b>호르몬</b> : 내분비샘에서 만들어져 <b>혈액</b>을 통해 이동하고, <b>특정 세포·기관</b>에 작용해 몸의 기능을 조절하는 물질.
      </Concept>
      <Concept>
        <b>호르몬 이동 경로</b> : 내분비샘에서 생성 → 혈액으로 분비 → 온몸으로 이동 → 특정 세포·기관에 작용 → 몸의 기능 조절
      </Concept>

      <H3>신경과 호르몬 비교</H3>
      <Table
        head={['구분', '신경', '호르몬']}
        rows={[
          ['전달 방법', '뉴런을 통해 전달', '혈액을 통해 전달'],
          ['전달 속도', '빠름', '비교적 느림'],
          ['작용 범위', '비교적 좁음', '넓음'],
          ['효과 지속', '비교적 짧음', '비교적 오래'],
          ['중요한 때', '자극에 빠르게 반응할 때', '기능을 지속적으로 조절할 때'],
        ]}
      />

      <H3>학습 그림</H3>
      <FigureRow>
        <Figure caption="신경 vs 호르몬 작용 비교">
          <NerveHormoneFallback />
        </Figure>
        <Figure caption="교과서: 항상성과 호르몬">
          <TextbookImg src={TEXTBOOK_IMAGES.section1[0].src} alt="구역 1 교과서 그림" />
        </Figure>
      </FigureRow>

      <DoneList sectionId="section1" />
    </Sheet>
  )
}

function Section2Sheet() {
  return (
    <Sheet subtitle="정리본 2 · 호르몬의 종류와 기능">
      <H3>내분비샘 · 호르몬 · 기능</H3>
      <Table head={['내분비샘', '호르몬', '기능']} rows={HORMONES.map((h) => [h.gland, h.hormone, h.function])} />

      <H3>호르몬 과다·결핍 시 나타나는 문제</H3>
      <Table
        head={['호르몬', '이상 시 문제(예시)']}
        rows={[
          ['성장 호르몬', '부족 → 소인증 / 과다 → 거인증'],
          ['티록신', '과다 → 물질대사 항진 / 부족 → 물질대사 저하'],
          ['인슐린', '부족·작용 저하 → 혈당량 조절 곤란(당뇨병)'],
          ['성호르몬', '이상 → 2차 성징·생식 기능 조절 문제'],
        ]}
      />
      <Concept>
        ▶ <b>호르몬은 너무 많거나 너무 적어도</b> 몸의 기능 조절에 문제가 생길 수 있다.
        <span style={{ color: '#6b7280', fontSize: '9.5pt' }}> (학습용 개념 예시이며 실제 진단이 아님)</span>
      </Concept>

      <H3>학습 그림</H3>
      <FigureRow>
        <Figure caption="교과서: 호르몬의 종류와 기능">
          <TextbookImg src={TEXTBOOK_IMAGES.section2[0].src} alt="구역 2 교과서 그림 1" />
        </Figure>
        <Figure caption="교과서: 과다증과 결핍증">
          <TextbookImg src={TEXTBOOK_IMAGES.section2[1].src} alt="구역 2 교과서 그림 2" />
        </Figure>
      </FigureRow>

      <DoneList sectionId="section2" />
    </Sheet>
  )
}

function Section3Sheet() {
  return (
    <Sheet subtitle="정리본 3 · 항상성 유지 방법(체온·혈당량)">
      <H3>체온 조절 (정상 약 37 ℃)</H3>
      <Table
        head={['구분', '더울 때', '추울 때']}
        rows={[
          ['피부 혈관(신경)', '확장 → 열 방출 증가', '수축 → 열 방출 감소'],
          ['땀·떨림(신경)', '땀 분비 증가', '몸 떨림 → 열 발생 증가'],
          ['호르몬', '—', '갑상샘 티록신 증가 → 세포 호흡·열 발생 증가'],
          ['결과', '체온 하강 → 정상', '체온 상승 → 정상'],
        ]}
      />
      <Concept>▶ 체온 조절은 <b>신경의 작용</b>과 <b>호르몬의 작용</b>이 함께 일어난다.</Concept>

      <H3>혈당량 조절 (정상 혈액 100 mL당 70~90 mg)</H3>
      <Table
        head={['구분', '식사 후(혈당 높음)', '공복·운동 후(혈당 낮음)']}
        rows={[
          ['호르몬', '인슐린', '글루카곤'],
          ['작용', '세포 포도당 흡수·간에 글리코젠 저장', '간의 글리코젠을 포도당으로 분해·방출'],
          ['결과', '혈당량 감소 → 정상', '혈당량 증가 → 정상'],
        ]}
      />
      <Concept>
        <b>공통 원리</b> : 정상 범위에서 벗어남 → 감지 → (신경·호르몬) 조절 작용 → 정상 범위로 회복
      </Concept>

      <H3>학습 그림</H3>
      <FigureRow>
        <Figure caption="체온 조절(신경/호르몬 구분)">
          <TempControlFallback />
        </Figure>
        <Figure caption="혈당량 조절 순환 고리">
          <GlucoseLoopFallback />
        </Figure>
      </FigureRow>
      <FigureRow>
        <Figure caption="교과서: 체온 조절">
          <TextbookImg src={TEXTBOOK_IMAGES.section3[0].src} alt="구역 3 교과서 그림 1" />
        </Figure>
        <Figure caption="교과서: 혈당량 조절">
          <TextbookImg src={TEXTBOOK_IMAGES.section3[1].src} alt="구역 3 교과서 그림 2" />
        </Figure>
      </FigureRow>

      <DoneList sectionId="section3" />
    </Sheet>
  )
}

/* ---------- 내보내기 ---------- */
function Sheets({ target }: { target: string }) {
  const gap = { marginBottom: 20 }
  return (
    <>
      {(target === 'section1' || target === 'all') && <div style={gap}><Section1Sheet /></div>}
      {(target === 'section2' || target === 'all') && (
        <div style={gap} className={target === 'all' ? 'page-break' : ''}>
          <Section2Sheet />
        </div>
      )}
      {(target === 'section3' || target === 'all') && (
        <div style={gap} className={target === 'all' ? 'page-break' : ''}>
          <Section3Sheet />
        </div>
      )}
    </>
  )
}

/** 화면 미리보기용 (모달 안에 표시) */
export function PrintPreview({ target }: { target: string | null }) {
  if (!target) return null
  return (
    <div className="print-preview-body">
      <Sheets target={target} />
    </div>
  )
}

/** 실제 인쇄용 (화면에서는 숨김, 인쇄 시에만 표시) */
export function PrintSummary({ target }: { target: string | null }) {
  if (!target) return null
  return (
    <div className="print-area hidden">
      <Sheets target={target} />
    </div>
  )
}
