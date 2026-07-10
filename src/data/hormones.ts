export interface HormoneInfo {
  gland: string
  hormone: string
  function: string
  abnormal: string
}

// 교과서(비상교육 중등 과학 3, 4-2 신경계와 호르몬) 용어에 맞춘 주요 내분비샘·호르몬 표
export const HORMONES: HormoneInfo[] = [
  {
    gland: '뇌하수체',
    hormone: '성장 호르몬',
    function: '몸의 성장을 촉진한다.',
    abnormal:
      '성장기에 부족하면 성장 저하(소인증), 지나치게 많으면 과도한 성장(거인증)과 관련될 수 있다.',
  },
  {
    gland: '갑상샘',
    hormone: '티록신',
    function: '세포 호흡을 촉진하고 물질대사를 조절한다.',
    abnormal:
      '지나치게 많으면 물질대사 항진(갑상샘 기능 항진), 부족하면 물질대사 저하(갑상샘 기능 저하)와 관련될 수 있다.',
  },
  {
    gland: '이자',
    hormone: '인슐린',
    function: '혈당량을 낮춘다.',
    abnormal:
      '분비나 작용이 부족하면 혈당량 조절이 어려워져 당뇨병과 관련될 수 있다.',
  },
  {
    gland: '이자',
    hormone: '글루카곤',
    function: '혈당량을 높인다.',
    abnormal: '혈당량이 낮아졌을 때 정상으로 되돌리는 조절에 관여한다.',
  },
  {
    gland: '정소',
    hormone: '남성 호르몬',
    function: '남자의 2차 성징 발달에 관여한다.',
    abnormal: '분비 이상이 생기면 2차 성징·생식 기능 조절에 문제가 생길 수 있다.',
  },
  {
    gland: '난소',
    hormone: '여성 호르몬',
    function: '여자의 2차 성징 발달에 관여한다.',
    abnormal: '분비 이상이 생기면 2차 성징·생식 기능 조절에 문제가 생길 수 있다.',
  },
]

// 내분비샘 위치(내분비샘 위치 그림 대체 도식용, 0~100 좌표)
export interface GlandPosition {
  id: string
  gland: string
  hormone: string
  x: number // %
  y: number // %
}

export const GLAND_POSITIONS: GlandPosition[] = [
  { id: 'pituitary', gland: '뇌하수체', hormone: '성장 호르몬', x: 50, y: 12 },
  { id: 'thyroid', gland: '갑상샘', hormone: '티록신', x: 50, y: 26 },
  { id: 'pancreas', gland: '이자', hormone: '인슐린·글루카곤', x: 41, y: 52 },
  { id: 'testis', gland: '정소', hormone: '남성 호르몬', x: 43, y: 82 },
  { id: 'ovary', gland: '난소', hormone: '여성 호르몬', x: 58, y: 74 },
]
