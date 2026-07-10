import type { SectionId } from '../types'

export interface TextbookImage {
  src: string
  alt: string
}

// 각 구역 활동 중 학생이 열람할 수 있는 교과서 그림
export const TEXTBOOK_IMAGES: Record<SectionId, TextbookImage[]> = {
  section1: [{ src: '/assets/textbook_s1.png', alt: '구역 1 교과서 그림 · 항상성과 호르몬' }],
  section2: [
    { src: '/assets/textbook_s2_1.png', alt: '구역 2 교과서 그림 1 · 호르몬의 종류와 기능' },
    { src: '/assets/textbook_s2_2.png', alt: '구역 2 교과서 그림 2 · 과다증과 결핍증' },
  ],
  section3: [
    { src: '/assets/textbook_s3_1.png', alt: '구역 3 교과서 그림 1 · 체온 조절' },
    { src: '/assets/textbook_s3_2.png', alt: '구역 3 교과서 그림 2 · 혈당량 조절' },
  ],
}
