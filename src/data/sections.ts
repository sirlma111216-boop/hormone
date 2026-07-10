import type { SectionMeta } from '../types'

export const SECTIONS: SectionMeta[] = [
  {
    id: 'section1',
    order: 1,
    title: '분류 1 · 항상성과 호르몬',
    color: 'teal',
    goal: [
      '항상성의 뜻을 설명할 수 있다.',
      '호르몬의 뜻을 설명할 수 있다.',
      '호르몬과 신경의 차이를 비교할 수 있다.',
    ],
    activities: [
      { id: '1-1', section: 'section1', title: '항상성 탐정', subtitle: '몸속 균형 찾기', icon: '🕵️' },
      { id: '1-2', section: 'section1', title: '호르몬 이동 경로', subtitle: '순서 완성하기', icon: '🩸' },
      { id: '1-3', section: 'section1', title: '신경 vs 호르몬', subtitle: '비교 카드 분류', icon: '⚖️' },
      { id: '1-4', section: 'section1', title: '신호 배송 레이스', subtitle: '미니게임', icon: '🏁' },
    ],
  },
  {
    id: 'section2',
    order: 2,
    title: '분류 2 · 호르몬의 종류와 기능',
    color: 'indigo',
    goal: [
      '주요 내분비샘과 호르몬을 연결할 수 있다.',
      '호르몬의 기능을 설명할 수 있다.',
      '호르몬이 너무 많거나 적으면 몸의 기능 조절에 문제가 생길 수 있음을 이해한다.',
    ],
    activities: [
      { id: '2-1', section: 'section2', title: '몸속 호르몬 지도', subtitle: '내분비샘 위치 완성', icon: '🗺️' },
      { id: '2-2', section: 'section2', title: '호르몬 3단 짝 맞추기', subtitle: '샘·호르몬·기능', icon: '🃏' },
      { id: '2-3', section: 'section2', title: '과다·결핍 매칭', subtitle: '병원 매칭 게임', icon: '🏥' },
      { id: '2-4', section: 'section2', title: '호르몬 응급실 트리아지', subtitle: '추리 미니게임', icon: '🚑' },
    ],
  },
  {
    id: 'section3',
    order: 3,
    title: '분류 3 · 항상성 유지 방법',
    color: 'cyan',
    goal: [
      '더울 때와 추울 때 체온 조절 과정을 비교할 수 있다.',
      '인슐린과 글루카곤이 혈당량을 조절하는 과정을 설명할 수 있다.',
      '항상성은 정상 범위에서 벗어난 값을 다시 정상 범위로 되돌리는 조절 과정임을 이해한다.',
    ],
    activities: [
      { id: '3-1', section: 'section3', title: '체온 조절 관제실', subtitle: '더울 때·추울 때', icon: '🌡️' },
      { id: '3-2', section: 'section3', title: '체온 조절 순서 배열', subtitle: '두 경로 완성', icon: '🔀' },
      { id: '3-3', section: 'section3', title: '혈당량 조절 실험실', subtitle: '인슐린·글루카곤', icon: '🧪' },
      { id: '3-4', section: 'section3', title: '항상성 밸런스 게임', subtitle: '통합 최종 미션', icon: '🎮' },
      { id: '3-5', section: 'section3', title: '되돌림 화살표 완성', subtitle: '공통 원리 정리', icon: '🔁' },
    ],
  },
]

export const ALL_ACTIVITY_IDS: string[] = SECTIONS.flatMap((s) =>
  s.activities.map((a) => a.id),
)

export function getSection(id: string) {
  return SECTIONS.find((s) => s.id === id)!
}
