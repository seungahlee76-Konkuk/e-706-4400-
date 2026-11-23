import { Link } from '../lib/router';

/* ───────── 오피스텔 바로가기 3칸 (히어로 바로 아래) ─────────
   바꿀 때는 아래 ITEMS 만 고치면 됩니다. */
const ITEMS = [
  { no: '01', to: '/officetel/units', title: '세대 안내', line: '아파트처럼 사는 84㎡ 3룸' },
  { no: '02', to: '/officetel/people', title: '누가 사나요', line: '의료진부터 신혼부부까지' },
  { no: '03', to: '/officetel/overview', title: '사업개요', line: '한눈에 보는 단지 정보' },
];

export default function OfficetelQuick() {
  return (
    <section className="oq" aria-label="오피스텔 바로가기">
      <style>{CSS}</style>
      <ul className="oq-in">
        {ITEMS.map((it) => (
          <li key={it.to}>
            <Link to={it.to} className="oq-card">
              <span className="oq-no">{it.no}</span>
              <span className="oq-tx">
                <strong>{it.title}</strong>
                <span>{it.line}</span>
              </span>
              <span className="oq-ic" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const CSS = `
.oq{background:#F6F4EF;padding:40px 20px 48px}
.oq-in{list-style:none;margin:0 auto;padding:0;max-width:1280px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.oq-in li{margin:0}
.oq-card{display:flex;align-items:center;gap:18px;padding:24px 26px;background:#fff;border:1px solid #E7E5E4;border-radius:6px;text-decoration:none;color:#1C1C1E;transition:border-color .2s ease,transform .2s ease}
.oq-card:hover{border-color:#FF671D;transform:translateY(-2px)}
.oq-no{font-size:12px;font-weight:700;letter-spacing:2px;color:#D24A0E}
.oq-tx{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0}
.oq-tx strong{font-size:20px;font-weight:800;letter-spacing:-.8px;color:#0F1C3A}
.oq-tx span{font-size:14px;color:#52525B;letter-spacing:-.3px;word-break:keep-all}
.oq-ic{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#1C1C1E;color:#fff;flex:none;transition:transform .25s ease}
.oq-card:hover .oq-ic{transform:rotate(-45deg)}
@media (min-width:640px){.oq{padding:48px 40px 56px}}
@media (max-width:1023px){.oq{padding-top:4px}}
@media (max-width:899px){.oq-in{grid-template-columns:1fr;gap:10px}.oq-card{padding:18px 20px}}
`;
