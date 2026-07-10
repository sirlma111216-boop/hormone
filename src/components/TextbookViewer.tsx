import { useEffect } from 'react'
import type { TextbookImage } from '../data/textbook'

/**
 * 교과서 그림 뷰어(라이트박스).
 * "교과서 확인하기" 버튼을 누르면 해당 구역의 교과서 그림을 크게 볼 수 있다.
 */
export function TextbookViewer({
  images,
  title,
  onClose,
}: {
  images: TextbookImage[]
  title: string
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    // 배경 스크롤 잠금
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-[#e5e7eb]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-2 border-b border-[#e5e7eb] px-5 py-3">
          <h3 className="font-display flex items-center gap-2 text-base font-semibold text-[#111111]">
            <span aria-hidden>📖</span> {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-xs font-semibold text-[#374151] transition hover:border-[#111111] hover:bg-[#f5f5f5]"
          >
            ✕ 닫기
          </button>
        </div>

        {/* 이미지 영역 */}
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-4">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {images.map((img, i) => (
              <figure key={img.src} className="overflow-hidden rounded-lg bg-white ring-1 ring-[#e5e7eb]">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-contain"
                  onError={(e) => {
                    const el = e.currentTarget
                    el.style.display = 'none'
                    const cap = el.nextElementSibling as HTMLElement | null
                    if (cap) cap.textContent = '이미지를 불러올 수 없어요: ' + img.src
                  }}
                />
                <figcaption className="px-3 py-2 text-center text-xs text-[#6b7280]">
                  {images.length > 1 ? `그림 ${i + 1} · ` : ''}
                  {img.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
