export type SectionId = 'section1' | 'section2' | 'section3'

export interface ActivityMeta {
  id: string // 예: '1-1'
  section: SectionId
  title: string
  subtitle: string
  icon: string // 이모지
}

export interface SectionMeta {
  id: SectionId
  order: number
  title: string
  goal: string[]
  color: string // tailwind 색 계열 키
  activities: ActivityMeta[]
}

export interface ProgressState {
  // 활동 완료 여부: { '1-1': true, ... }
  done: Record<string, boolean>
  // 도입 예측 선택(0,1,2) — 아직 안 했으면 null
  introPrediction: number | null
  introConfirmed: boolean
}
