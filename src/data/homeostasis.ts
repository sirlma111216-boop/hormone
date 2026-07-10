// 체온 조절 · 혈당량 조절 · 통합 밸런스 게임 데이터
// 교과서 수치: 정상 체온 약 37 ℃, 정상 혈당량 혈액 100 mL당 70~90 mg

export type ControlKind = '신경' | '호르몬'

export interface ReactionCard {
  id: string
  label: string
  correct: boolean // 해당 상황(더울 때/추울 때)에 알맞은 반응인가
  kind: ControlKind // 신경의 작용 / 호르몬의 작용
}

// 더울 때 몸의 반응(정답 카드 + 함정 카드)
export const HOT_REACTIONS: ReactionCard[] = [
  { id: 'h1', label: '피부 혈관이 확장된다.', correct: true, kind: '신경' },
  { id: 'h2', label: '땀 분비량이 증가한다.', correct: true, kind: '신경' },
  { id: 'h3', label: '몸 밖으로 나가는 열이 증가한다.', correct: true, kind: '신경' },
  { id: 'h4', label: '체온이 내려가 정상 체온에 가까워진다.', correct: true, kind: '신경' },
  { id: 'hx1', label: '피부 혈관이 수축된다.', correct: false, kind: '신경' },
  { id: 'hx2', label: '몸을 떨어 열을 낸다.', correct: false, kind: '신경' },
]

// 추울 때 몸의 반응
export const COLD_REACTIONS: ReactionCard[] = [
  { id: 'c1', label: '피부 혈관이 수축된다.', correct: true, kind: '신경' },
  { id: 'c2', label: '몸을 떨게 하여 열 발생량이 증가한다.', correct: true, kind: '신경' },
  { id: 'c3', label: '갑상샘에서 티록신 분비가 증가한다.', correct: true, kind: '호르몬' },
  { id: 'c4', label: '세포 호흡이 촉진되어 열 발생량이 증가한다.', correct: true, kind: '호르몬' },
  { id: 'c5', label: '체온이 올라가 정상 체온에 가까워진다.', correct: true, kind: '신경' },
  { id: 'cx1', label: '땀 분비량이 증가한다.', correct: false, kind: '신경' },
  { id: 'cx2', label: '피부 혈관이 확장된다.', correct: false, kind: '신경' },
]

// 체온 조절 순서 배열
export const HOT_SEQUENCE = [
  '고온 자극',
  '체온 상승',
  '뇌가 감지',
  '피부 혈관 확장 + 땀 분비 증가',
  '열 방출 증가',
  '체온 하강',
  '정상 체온',
]

export const COLD_SEQUENCE = [
  '저온 자극',
  '체온 하강',
  '뇌가 감지',
  '피부 혈관 수축 + 몸 떨림 + 티록신 분비 증가',
  '열 방출 감소·열 발생 증가',
  '체온 상승',
  '정상 체온',
]

// 혈당량 조절
export const GLUCOSE_AFTER_MEAL = [
  '식사',
  '포도당 흡수',
  '혈당량 증가',
  '이자에서 인슐린 분비',
  '간·세포가 포도당 흡수',
  '간에서 포도당을 글리코젠으로 합성·저장',
  '혈당량 감소',
  '정상 혈당량',
]

export const GLUCOSE_LOW = [
  '혈당량 감소',
  '이자에서 글루카곤 분비',
  '간에서 글리코젠을 포도당으로 분해',
  '포도당을 혈액으로 내보냄',
  '혈당량 증가',
  '정상 혈당량',
]

// 통합 밸런스 게임 상황
export type GaugeType = '체온' | '혈당'
export interface BalanceSituation {
  id: string
  text: string
  gauge: GaugeType
  direction: 'high' | 'low' // 현재 정상보다 높음/낮음
  // 정답 반응(복수 가능)
  options: { label: string; correct: boolean }[]
  hints: string[]
  explain: string
}

export const BALANCE_SITUATIONS: BalanceSituation[] = [
  {
    id: 'b1',
    text: '한여름 운동장에 오래 있어서 몸이 뜨거워졌다.',
    gauge: '체온',
    direction: 'high',
    options: [
      { label: '피부 혈관 확장 + 땀 분비 증가', correct: true },
      { label: '피부 혈관 수축 + 몸 떨림', correct: false },
      { label: '글루카곤 분비 증가', correct: false },
    ],
    hints: [
      '체온이 정상보다 “높을” 때, 열을 어떻게 해야 할까요?',
      '몸 밖으로 열을 더 내보내려면 피부 혈관과 땀은 어떻게 될까요?',
    ],
    explain: '더울 때는 피부 혈관이 확장되고 땀이 늘어 열을 내보내 체온을 낮춘다.',
  },
  {
    id: 'b2',
    text: '겨울날 얇은 옷으로 오래 있어서 몸이 차가워졌다.',
    gauge: '체온',
    direction: 'low',
    options: [
      { label: '피부 혈관 수축 + 몸 떨림 + 티록신 분비 증가', correct: true },
      { label: '피부 혈관 확장 + 땀 분비 증가', correct: false },
      { label: '인슐린 분비 증가', correct: false },
    ],
    hints: [
      '체온이 정상보다 “낮을” 때, 열을 지키고 더 만들어야 해요.',
      '열을 덜 잃으려면 혈관은 수축, 열을 더 내려면 몸을 떨고 티록신이 늘어요.',
    ],
    explain:
      '추울 때는 피부 혈관 수축으로 열을 덜 잃고, 몸 떨림과 티록신 증가로 열을 더 만들어 체온을 올린다.',
  },
  {
    id: 'b3',
    text: '점심을 먹은 직후라 혈당량이 정상보다 높아졌다.',
    gauge: '혈당',
    direction: 'high',
    options: [
      { label: '인슐린 분비 증가', correct: true },
      { label: '글루카곤 분비 증가', correct: false },
      { label: '땀 분비 증가', correct: false },
    ],
    hints: [
      '혈당량이 “높을” 때 필요한 호르몬을 떠올려 보세요.',
      '이자에서 나와 혈당량을 “낮추는” 호르몬은 무엇일까요?',
    ],
    explain:
      '혈당량이 높으면 이자에서 인슐린이 분비되어 세포의 포도당 흡수와 간의 글리코젠 저장을 도와 혈당량을 낮춘다.',
  },
  {
    id: 'b4',
    text: '점심 먹은 지 오래됐고 축구를 해서 혈당량이 정상보다 낮아졌다.',
    gauge: '혈당',
    direction: 'low',
    options: [
      { label: '글루카곤 분비 증가', correct: true },
      { label: '인슐린 분비 증가', correct: false },
      { label: '피부 혈관 확장', correct: false },
    ],
    hints: [
      '혈당량이 “낮을” 때 필요한 호르몬을 떠올려 보세요.',
      '간의 글리코젠을 포도당으로 분해해 혈당량을 “높이는” 호르몬은?',
    ],
    explain:
      '혈당량이 낮으면 이자에서 글루카곤이 분비되어 간의 글리코젠을 포도당으로 분해해 혈당량을 높인다.',
  },
  {
    id: 'b5',
    text: '측정해 보니 혈당량이 정상보다 높은 상태다.',
    gauge: '혈당',
    direction: 'high',
    options: [
      { label: '인슐린이 작용하여 혈당량을 낮춘다.', correct: true },
      { label: '글루카곤이 작용하여 혈당량을 높인다.', correct: false },
      { label: '아무 조절도 하지 않는다.', correct: false },
    ],
    hints: [
      '높으면 “낮추는” 방향으로 되돌려야 정상 범위예요.',
      '혈당량을 낮추는 호르몬은 인슐린입니다.',
    ],
    explain: '혈당량이 높으면 인슐린이 작용하여 다시 정상 범위로 낮춘다.',
  },
  {
    id: 'b6',
    text: '측정해 보니 혈당량이 정상보다 낮은 상태다.',
    gauge: '혈당',
    direction: 'low',
    options: [
      { label: '글루카곤이 작용하여 혈당량을 높인다.', correct: true },
      { label: '인슐린이 작용하여 혈당량을 낮춘다.', correct: false },
      { label: '아무 조절도 하지 않는다.', correct: false },
    ],
    hints: [
      '낮으면 “높이는” 방향으로 되돌려야 정상 범위예요.',
      '혈당량을 높이는 호르몬은 글루카곤입니다.',
    ],
    explain: '혈당량이 낮으면 글루카곤이 작용하여 다시 정상 범위로 높인다.',
  },
]
