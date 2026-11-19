/* ───────── 상가 ↔ 오피스텔 전환 반원 버튼 ─────────
   /store 페이지: <SideSwitch to="/officetel" label="오피스텔" side="right" />
   /officetel 페이지: <SideSwitch to="/store" label="상가" side="left" /> */

type Props = {
  to: string;
  label: string;
  side: 'left' | 'right';
  onNavigate?: (to: string) => void; // 프로젝트 라우터의 navigate를 넘기면 새로고침 없이 이동
};

export default function SideSwitch({ to, label, side, onNavigate }: Props) {
  const right = side === 'right';
  const arrow = (
    <span className="ss-arr" aria-hidden="true">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d={right ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} />
      </svg>
    </span>
  );
  return (
    <>
      <style>{CSS}</style>
      <a
        href={to}
        className={`ss ${right ? 'ss-r' : 'ss-l'}`}
        aria-label={`${label} 페이지로 이동`}
        onClick={(e) => {
          if (!onNavigate || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onNavigate(to);
        }}
      >
        <span className="ss-arc" aria-hidden="true" />
        <span className="ss-lab">
          {!right && arrow}
          {label}
          {right && arrow}
        </span>
      </a>
    </>
  );
}

const CSS = `
.ss{position:fixed;top:50%;z-index:15;transform:translateY(-50%);display:flex;align-items:center;width:170px;height:340px;text-decoration:none;overflow:hidden;pointer-events:none}
.ss-arc,.ss-lab{pointer-events:auto}
.ss-r{right:0;justify-content:flex-end}
.ss-l{left:0;justify-content:flex-start}
.ss-arc{position:absolute;top:6%;bottom:6%;width:56px;border-radius:50%;background:linear-gradient(90deg,#EDEDEE 0%,#FAFAFA 60%,#FFFFFF 100%);transition:width .35s ease,box-shadow .35s ease}
.ss-r .ss-arc{right:-34px;box-shadow:-12px 0 22px -12px rgba(0,0,0,.30)}
.ss-l .ss-arc{left:-34px;background:linear-gradient(270deg,#EDEDEE 0%,#FAFAFA 60%,#FFFFFF 100%);box-shadow:12px 0 22px -12px rgba(0,0,0,.30)}
.ss-lab{position:relative;display:inline-flex;align-items:center;gap:6px;font-size:15px;font-weight:700;letter-spacing:-.2px;color:#8E8E93;transition:color .25s ease,margin .35s ease}
.ss-r .ss-lab{margin-right:42px}
.ss-l .ss-lab{margin-left:42px}
.ss-arr{display:inline-flex;opacity:0;transition:opacity .25s ease,transform .35s ease}
.ss-r .ss-arr{transform:translateX(-6px)}
.ss-l .ss-arr{transform:translateX(6px)}
.ss:hover .ss-arc,.ss:focus-visible .ss-arc{width:96px}
.ss-r:hover .ss-arc,.ss-r:focus-visible .ss-arc{box-shadow:-16px 0 30px -12px rgba(0,0,0,.34)}
.ss-l:hover .ss-arc,.ss-l:focus-visible .ss-arc{box-shadow:16px 0 30px -12px rgba(0,0,0,.34)}
.ss:hover .ss-lab,.ss:focus-visible .ss-lab{color:#D24A0E}
.ss-r:hover .ss-lab,.ss-r:focus-visible .ss-lab{margin-right:70px}
.ss-l:hover .ss-lab,.ss-l:focus-visible .ss-lab{margin-left:70px}
.ss:hover .ss-arr,.ss:focus-visible .ss-arr{opacity:1;transform:none}
.ss:focus-visible{outline:none}
.ss:focus-visible .ss-lab{text-decoration:underline}
/* 휴대폰·태블릿(1024px 미만)에서는 숨김 — 상단 메뉴의 "오피스텔 보기"로 대신 */
@media (max-width:1023px){.ss{display:none}}
@media (min-width:1024px) and (max-width:1439px){.ss .ss-lab{opacity:0;transition:opacity .25s ease,color .25s ease,margin .35s ease}.ss:hover .ss-lab,.ss:focus-visible .ss-lab{opacity:1}}
@media (prefers-reduced-motion:reduce){.ss-arc,.ss-lab,.ss-arr{transition:none}}
`;
