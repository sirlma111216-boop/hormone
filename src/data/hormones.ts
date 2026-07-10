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
    gland: '부신',
    hormone: '아드레날린',
    function: '혈당량을 높이고 심장 박동을 빠르게 한다.',
    abnormal:
      '긴장·위급한 상황에서 분비되어 혈당량과 심장 박동 조절에 관여한다.',
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

// 내분비샘 위치 + 학습 내용 (그림 위 좌표 %, 특징, 분비 호르몬)
export interface GlandHormone {
  name: string
  function: string
}
export interface GlandPosition {
  id: string
  gland: string
  x: number // %
  y: number // %
  characteristic: string // 그 내분비샘의 특징(위치 등)
  hormones: GlandHormone[] // 분비하는 호르몬과 기능
}

// 좌표는 교과서 그림(/assets/endocrine_glands.png · 호르몬102.png) 위의 위치(%)
export const GLAND_POSITIONS: GlandPosition[] = [
  {
    id: 'pituitary',
    gland: '뇌하수체',
    x: 43,
    y: 25,
    characteristic: '뇌 아래쪽에 있는 작은 내분비샘으로, 다른 내분비샘의 작용을 조절하기도 해요.',
    hormones: [{ name: '성장 호르몬', function: '몸의 성장을 촉진한다.' }],
  },
  {
    id: 'thyroid',
    gland: '갑상샘',
    x: 41,
    y: 41,
    characteristic: '목 앞쪽에 있는 내분비샘이에요.',
    hormones: [{ name: '티록신', function: '세포 호흡을 촉진하고 물질대사를 조절한다.' }],
  },
  {
    id: 'adrenal',
    gland: '부신',
    x: 39,
    y: 61,
    characteristic: '양쪽 콩팥(신장) 위에 하나씩 붙어 있어요.',
    hormones: [
      {
        name: '아드레날린',
        function: '혈당량을 높이고 심장 박동을 빠르게 한다. (긴장하거나 위급한 상황에서 분비)',
      },
    ],
  },
  {
    id: 'pancreas',
    gland: '이자',
    x: 49,
    y: 67,
    characteristic: '위의 뒤쪽에 있고 소화액도 분비해요. 서로 반대로 작용하는 두 호르몬을 분비해요.',
    hormones: [
      { name: '인슐린', function: '혈당량을 낮춘다.' },
      { name: '글루카곤', function: '혈당량을 높인다.' },
    ],
  },
  {
    id: 'ovary',
    gland: '난소',
    x: 18,
    y: 81,
    characteristic: '여자의 생식 기관이에요.',
    hormones: [{ name: '여성 호르몬', function: '여자의 2차 성징 발달에 관여한다.' }],
  },
  {
    id: 'testis',
    gland: '정소',
    x: 45,
    y: 85,
    characteristic: '남자의 생식 기관이에요.',
    hormones: [{ name: '남성 호르몬', function: '남자의 2차 성징 발달에 관여한다.' }],
  },
]
