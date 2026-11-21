import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from '../lib/router';

interface PanelConfig {
  id: 'store' | 'officetel';
  to: string;
  image: string;
  ariaLabel: string;
  badgeText: string;
  badgeClass: string;
  dotClass: string;
  eyebrow: string;
  barClass: string;
  title: string;
  line1: ReactNode;
  line2: ReactNode;
  cta: string;
}

const PANELS: PanelConfig[] = [
  {
    id: 'store',
    to: '/store',
    image: '/photos/hero-3.jpg',
    ariaLabel: '상가 페이지로 이동',
    badgeText: '분양·임대 상담 중',
    badgeClass: 'bg-accent text-white',
    dotClass: 'bg-white',
    eyebrow: 'COMMERCIAL',
    barClass: 'bg-accent',
    title: '1층 근린생활시설',
    line1: (
      <>
        <span className="text-accent">439병상</span> 종합병원 바로 앞
      </>
    ),
    line2: (
      <>
        의료·주거 수요가 만나는 <span className="text-accent font-bold">스트리트 상가</span> · 단지 내 오피스텔{' '}
        <span className="text-accent font-bold">430세대</span>
      </>
    ),
    cta: '상가 보기 →',
  },
  {
    id: 'officetel',
    to: '/officetel',
    image: '/photos/hero-2.jpg',
    ariaLabel: '오피스텔 페이지로 이동',
    badgeText: '회사보유분 분양 중',
    badgeClass: 'bg-mint text-mint-ink',
    dotClass: 'bg-mint-ink',
    eyebrow: 'RESIDENCE',
    barClass: 'bg-mint',
    title: '84타입 3룸 오피스텔',
    line1: (
      <>
        <span className="text-mint">430세대</span> 신축 · <span className="text-mint">즉시 입주</span> 가능
      </>
    ),
    line2: (
      <>
        주거형 3룸 구조 · 수원덕산병원 <span className="text-mint font-bold">바로 옆</span>
      </>
    ),
    cta: '오피스텔 보기 →',
  },
];

export default function Chooser() {
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        setHeaderHeight(Math.round(nav.getBoundingClientRect().height));
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <section
      aria-label="상가 및 오피스텔 선택"
      className="chooser-root w-full overflow-hidden bg-black"
      style={
        headerHeight !== null
          ? ({ '--chooser-header-h': `${headerHeight}px` } as CSSProperties)
          : undefined
      }
    >
      <style>{`
        .chooser-root {
          --chooser-header-h: 65px;
          height: calc(100svh - var(--chooser-header-h));
        }

        @media (min-width: 768px) {
          .chooser-root {
            --chooser-header-h: 72px;
          }
        }

        .chooser-grid {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
        }

        .chooser-panel {
          position: relative;
          display: block;
          width: 100%;
          height: 50%;
          overflow: hidden;
          text-decoration: none;
          border-radius: 0;
        }

        .chooser-panel + .chooser-panel {
          border-top: 1px solid rgba(255, 255, 255, 0.25);
        }

        .chooser-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1);
          transform-origin: center;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.15s ease;
        }

        .chooser-dimmer {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.6s ease;
        }

        .chooser-pill {
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }

        @keyframes chooserDotBlink {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.85);
          }
        }

        .chooser-dot {
          animation: chooserDotBlink 2.2s ease-in-out infinite;
        }

        .chooser-copy {
          opacity: 1;
          transform: translateY(0);
        }

        .chooser-panel:focus-visible {
          outline: 3px solid #ffffff;
          outline-offset: -3px;
          z-index: 10;
        }

        .chooser-panel:focus-visible .chooser-pill {
          background-color: #ffffff;
          color: var(--color-primary, #0F1C3A);
          border-color: #ffffff;
        }

        @media (min-width: 768px) {
          .chooser-grid {
            flex-direction: row;
          }

          .chooser-panel {
            width: auto;
            height: 100%;
            flex: 1 1 0%;
            transition: flex 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .chooser-panel + .chooser-panel {
            border-top: 0;
            border-left: 1px solid rgba(255, 255, 255, 0.25);
          }

          .chooser-grid:has(.chooser-panel:focus-visible) .chooser-panel:not(:focus-visible) {
            flex: 0.6 1 0%;
          }

          .chooser-grid:has(.chooser-panel:focus-visible) .chooser-panel:focus-visible {
            flex: 1.4 1 0%;
          }

          .chooser-grid:has(.chooser-panel:focus-visible) .chooser-panel:not(:focus-visible) .chooser-dimmer {
            opacity: 1;
          }

          .chooser-panel:focus-visible .chooser-img {
            transform: scale(1.05);
          }
        }

        /* 마우스 사용 기기 전용 호버 효과 */
        @media (hover: hover) and (pointer: fine) {
          .chooser-panel:hover .chooser-pill {
            background-color: #ffffff;
            color: var(--color-primary, #0F1C3A);
            border-color: #ffffff;
          }
        }

        @media (min-width: 768px) and (hover: hover) and (pointer: fine) {
          .chooser-copy {
            opacity: 0.7;
            transform: translateY(12px);
            transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .chooser-panel:hover .chooser-copy,
          .chooser-panel:focus-visible .chooser-copy {
            opacity: 1;
            transform: translateY(0);
          }

          .chooser-grid:has(.chooser-panel:hover) .chooser-panel:not(:hover) {
            flex: 0.6 1 0%;
          }

          .chooser-grid:has(.chooser-panel:hover) .chooser-panel:hover {
            flex: 1.4 1 0%;
          }

          .chooser-grid:has(.chooser-panel:hover) .chooser-panel:not(:hover) .chooser-dimmer {
            opacity: 1;
          }

          .chooser-panel:hover .chooser-img {
            transform: scale(1.05);
          }
        }

        /* 터치 기기(휴대폰·태블릿) 전용 눌림 및 초기 천천히 확대 효과 */
        @keyframes chooserKenBurns {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.06);
          }
        }

        @media (hover: none), (pointer: coarse) {
          .chooser-panel {
            transition: transform 0.15s ease;
          }

          .chooser-panel:active {
            transform: scale(0.98);
          }

          .chooser-panel:active .chooser-img {
            filter: brightness(1.12);
          }

          .chooser-panel--store .chooser-img {
            animation: chooserKenBurns 6s ease-out 0s 1 forwards;
          }

          .chooser-panel--officetel .chooser-img {
            animation: chooserKenBurns 6s ease-out 0.3s 1 forwards;
          }
        }

        /* 움직임 줄이기 설정 시 모든 확대·넓어짐·눌림·깜빡임 효과 비활성화 */
        @media (prefers-reduced-motion: reduce) {
          .chooser-panel,
          .chooser-img,
          .chooser-dimmer,
          .chooser-pill,
          .chooser-dot,
          .chooser-copy {
            transition: none !important;
            animation: none !important;
          }

          .chooser-dot {
            opacity: 1 !important;
            transform: none !important;
          }

          .chooser-copy {
            opacity: 1 !important;
            transform: none !important;
          }

          .chooser-panel,
          .chooser-panel:active {
            transform: none !important;
          }

          .chooser-grid:has(.chooser-panel:hover) .chooser-panel:not(:hover),
          .chooser-grid:has(.chooser-panel:hover) .chooser-panel:hover,
          .chooser-grid:has(.chooser-panel:focus-visible) .chooser-panel:not(:focus-visible),
          .chooser-grid:has(.chooser-panel:focus-visible) .chooser-panel:focus-visible {
            flex: 1 1 0% !important;
          }

          .chooser-panel:hover .chooser-img,
          .chooser-panel:focus-visible .chooser-img,
          .chooser-panel:active .chooser-img {
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      <div className="chooser-grid">
        {PANELS.map((panel) => (
          <Link
            key={panel.id}
            to={panel.to}
            aria-label={panel.ariaLabel}
            className={`chooser-panel chooser-panel--${panel.id}`}
          >
            <img
              src={panel.image}
              alt={panel.title}
              className="chooser-img"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 0.25) 72%, rgba(0, 0, 0, 0.05) 100%)',
              }}
            />
            <div className="chooser-dimmer" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-[24px] md:p-[56px] text-white text-left flex flex-col items-start">
              <span
                className={`inline-flex items-center gap-2 h-[28px] px-3 rounded-md text-[13px] font-bold tracking-tight mb-2 md:mb-3 ${panel.badgeClass}`}
              >
                <span className={`chooser-dot w-1.5 h-1.5 rounded-full shrink-0 ${panel.dotClass}`} />
                <span>{panel.badgeText}</span>
              </span>

              <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-white/70">
                {panel.eyebrow}
              </span>

              <div className={`w-[40px] h-[3px] my-2 md:my-3 ${panel.barClass}`} />

              <h2 className="font-title text-[32px] md:text-[52px] font-extrabold leading-[1.15] tracking-tight text-white mb-1.5 md:mb-3 break-keep">
                {panel.title}
              </h2>

              <div className="chooser-copy mb-3.5 md:mb-6 space-y-1">
                <p className="text-[16px] md:text-[20px] font-bold text-white leading-snug break-keep">
                  {panel.line1}
                </p>
                <p className="text-[14px] md:text-[17px] font-medium text-white/85 leading-snug break-keep">
                  {panel.line2}
                </p>
              </div>

              <span className="chooser-pill inline-flex items-center px-5 py-2 md:py-2.5 rounded-full border border-white/85 text-white text-sm font-bold tracking-tight">
                {panel.cta}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
