import { Link } from '../lib/router';

/* ───────── 오피스텔 히어로 (/officetel 맨 위) ─────────
   조감도 한 장 위에 "누가 사나요" 5명을 그 사람이 있을 법한 자리에 핀으로 세웁니다.
   핀을 누르면 /officetel/people 의 해당 글로 이동합니다.
   바꿀 때는 아래 AERIAL, PINS 만 고치면 됩니다. (x, y = 조감도 그림 기준 %, 핀 끝이 닿는 지점)
   이미지 파일은 public/photos/officetel/ 에 사용자가 직접 올립니다. */

// 조감도 (가로:세로 = w:h)
const AERIAL = { src: '/photos/officetel/aerial-illu.jpg', w: 1376, h: 768, alt: 'e편한세상 시티 고색 조감도 일러스트' };

// 5명 핀 (n = 누가 사나요 글 번호)
const PINS = [
  { n: 2, a: 2, label: '의료진', line: '교대근무 끝나고 바로 집', x: 23, y: 88 },
  { n: 5, a: 6, label: '어르신·가족', line: '종합병원 바로 옆 새 집', x: 39, y: 80 },
  { n: 4, a: 5, label: '신혼부부', line: '아파트처럼 사는 84㎡ 3룸', x: 29.5, y: 70 },
  { n: 3, a: 3, label: '삼성전자', line: '기흥·수원·화성 사업장으로 출근', x: 47.5, y: 91 },
  { n: 1, a: 1, label: '수원델타플렉스', line: '같은 고색동, 출근길이 짧은 3룸', x: 60, y: 74 },
];

export default function OfficetelHero() {
  const d = (s: number) => `${(0.1 + s).toFixed(2)}s`;

  return (
    <section id="officetel-hero" className="oh-hero relative overflow-clip">
      <style>{CSS}</style>

      {/* ── 조감도 + 5명 핀 (PC: 화면 가득 / 휴대폰: 글 아래) ── */}
      <div className="oh-map" aria-label="조감도 위 5가지 수요">
        <div className="oh-stage" style={{ aspectRatio: `${AERIAL.w} / ${AERIAL.h}` }}>
          <img src={AERIAL.src} alt={AERIAL.alt} fetchPriority="high" />
        </div>
        {/* 핀은 그림과 같은 크기의 윗층에 (PC에서 글 쪽 흐림 효과 위로 보이도록) */}
        <div className="oh-stage oh-pins" style={{ aspectRatio: `${AERIAL.w} / ${AERIAL.h}` }}>
          {PINS.map((p, i) => (
            <Link
              key={p.n}
              to={`/officetel/people#people-${p.n}`}
              className="oh-pin"
              style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${0.7 + i * 0.16}s` }}
              aria-label={`${p.label}: ${p.line} (자세히 보기)`}
            >
              <span className="oh-pin-in" style={{ animationDelay: `${i * 0.4}s` }}>
                <span className="oh-face"><img src={`/photos/officetel/people/a${p.a}.webp`} alt="" /></span>
                <span className="oh-tag">{p.label}</span>
                <span className="oh-tip">{p.line}</span>
              </span>
              <i className="oh-dot" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <Link to="/officetel/overview" className="oh-news"><i aria-hidden="true" />2029년 7월 탑동 이노베이션밸리 준공 목표</Link>
        <p className="oh-cap">일러스트 · 실제와 다를 수 있습니다</p>
      </div>

      {/* ── 글 ── */}
      <div className="oh-wrap mx-auto max-w-[1280px] px-5 sm:px-10">
        <div className="oh-text relative z-[2] flex max-w-[560px] flex-col">
          <div className="relative">
            <p className="oh-rise oh-el m-0" style={{ animationDelay: d(0.07) }}>
              Enjoy your <b>E</b>-Life
            </p>
            <h1 className="oh-title oh-rise mt-[10px] mb-0 text-[#0F1C3A]" style={{ animationDelay: d(0.14) }}>
              <span className="block whitespace-nowrap font-extrabold"><b className="font-extrabold text-[#FF671D]">e편한세상</b> 시티 고색</span>
            </h1>
            <p className="oh-rise oh-lead mt-[22px] mb-0" style={{ animationDelay: d(0.21) }}>
              <strong>출근이 가까운 3룸,</strong>
              <br />
              <span>아파트처럼 사는 84타입 오피스텔</span>
            </p>

            <div className="oh-rise oh-act oh-act-d mt-[26px] flex flex-col items-start gap-4" style={{ animationDelay: d(0.28) }}>
              <a href="tel:031-293-1073" className="oh-tel" aria-label="오피스텔 분양 문의 전화 031)293-1073">
                <span className="flex flex-col text-[11px] font-bold leading-[1.25] text-[#3F3F46]"><span>분양</span><span>문의</span></span>
                <span className="oh-num">031)293-1073</span>
              </a>
              <Link to="/officetel/units" className="oh-cta">
                <span className="text-[#D24A0E]">84타입 3룸 둘러보기</span>
                <span className="oh-ic" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 휴대폰: 조감도 아래에 전화·버튼 (PC에서는 숨김) */}
      <div className="oh-act-m px-5 sm:px-10">
        <div className="oh-act flex flex-col items-start gap-4">
          <a href="tel:031-293-1073" className="oh-tel" aria-label="오피스텔 분양 문의 전화 031)293-1073">
            <span className="flex flex-col text-[11px] font-bold leading-[1.25] text-[#3F3F46]"><span>분양</span><span>문의</span></span>
            <span className="oh-num">031)293-1073</span>
          </a>
          <Link to="/officetel/units" className="oh-cta">
            <span className="text-[#D24A0E]">84타입 3룸 둘러보기</span>
            <span className="oh-ic" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────── 스타일 (글 부분은 상가 히어로와 같은 값) ───────── */
const CSS = `
.oh-hero{background:#F6F4EF;min-height:640px}
.oh-el{font-family:'Jost',sans-serif;font-style:italic;font-weight:300;font-size:clamp(22px,2.6vw,30px);line-height:1.1;letter-spacing:.3px;color:#3F3F46}
.oh-el b{font-weight:400;color:#FF671D}
.oh-title{font-family:'Pretendard Variable',Pretendard,sans-serif !important;font-size:clamp(38px,9.5vw,58px);line-height:1.1;letter-spacing:-.04em}
.oh-lead{font-size:clamp(18px,1.8vw,22px);line-height:1.4;letter-spacing:-.6px;color:#1C1C1E}
.oh-lead strong{font-weight:800;color:#0F1C3A}
.oh-lead span{font-weight:400}
.oh-rise{animation:ohRise .8s cubic-bezier(.2,.7,.2,1) both}
@keyframes ohRise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
.oh-tel{display:inline-flex;align-items:center;gap:12px;color:#1C1C1E;text-decoration:none}
.oh-num{font-size:26px;font-weight:700;letter-spacing:-.5px;line-height:1;transition:color .2s ease}
.oh-tel:hover .oh-num{color:#D24A0E}
.oh-cta{display:inline-flex;align-items:center;gap:12px;text-decoration:none;font-size:17px;font-weight:800}
.oh-ic{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#1C1C1E;color:#fff;transition:transform .25s ease}
.oh-cta:hover .oh-ic{transform:rotate(-45deg)}

/* 조감도 */
/* 그림은 칸을 꽉 채우고(cover) 핀은 같은 크기의 윗층에: 칸 비율이 달라도 핀 위치가 그림과 맞음 */
.oh-map{position:relative;overflow:hidden;container-type:size;aspect-ratio:6/5}
.oh-stage{position:absolute;left:50%;top:50%;width:max(100cqw,calc(100cqh * 1376 / 768));height:max(100cqh,calc(100cqw * 768 / 1376));transform:translate(-50%,-50%)}
.oh-pins{z-index:2}
.oh-stage>img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(1.02)}
.oh-news{position:absolute;right:12px;top:12px;z-index:3;display:inline-flex;align-items:center;gap:7px;padding:6px 11px;border-radius:999px;background:rgba(255,255,255,.92);font-size:11px;font-weight:700;color:#0F1C3A;text-decoration:none;box-shadow:0 6px 16px -8px rgba(15,28,58,.4)}
.oh-news i{width:7px;height:7px;border-radius:50%;background:#FF671D}
.oh-cap{position:absolute;right:12px;bottom:10px;z-index:3;margin:0;padding:4px 9px;border-radius:6px;background:rgba(255,255,255,.88);font-size:11px;font-weight:700;color:#52525B}

/* 핀 */
.oh-pin{position:absolute;z-index:2;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;text-decoration:none;opacity:0;animation:ohPop .6s cubic-bezier(.2,1.4,.4,1) forwards}
@keyframes ohPop{from{opacity:0;transform:translate(-50%,-80%) scale(.6)}to{opacity:1;transform:translate(-50%,-100%) scale(1)}}
.oh-pin-in{position:relative;display:flex;flex-direction:column;align-items:center;animation:ohBob 3.2s ease-in-out infinite}
@keyframes ohBob{50%{transform:translateY(-4px)}}
.oh-face{display:block;width:64px;height:64px;border-radius:50%;padding:3px;background:#fff;box-shadow:0 10px 22px -8px rgba(15,28,58,.55);transition:transform .25s ease}
.oh-face img{display:block;width:100%;height:100%;border-radius:50%}
.oh-face:after{content:'';position:absolute;left:50%;top:64px;margin-left:-7px;border:7px solid transparent;border-top-color:#fff;border-bottom:0}
.oh-tag{margin-top:9px;padding:3px 9px;border-radius:999px;background:#0F1C3A;color:#fff;font-size:12px;font-weight:700;white-space:nowrap;letter-spacing:-.2px}
.oh-tip{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translate(-50%,6px);padding:7px 12px;border-radius:12px;background:#fff;color:#0F1C3A;font-size:13px;font-weight:700;white-space:nowrap;box-shadow:0 10px 24px -10px rgba(15,28,58,.45);opacity:0;pointer-events:none;transition:opacity .2s ease,transform .2s ease}
.oh-dot{display:block;width:10px;height:10px;margin-top:4px;border-radius:50%;background:#FF671D;box-shadow:0 0 0 3px rgba(255,255,255,.9);position:relative}
.oh-dot:after{content:'';position:absolute;inset:-6px;border-radius:50%;border:2px solid #FF671D;opacity:0;animation:ohRing 2.4s ease-out infinite}
@keyframes ohRing{0%{opacity:.8;transform:scale(.5)}100%{opacity:0;transform:scale(1.8)}}
.oh-pin:hover .oh-face,.oh-pin:focus-visible .oh-face{transform:scale(1.08)}
.oh-pin:hover .oh-tip,.oh-pin:focus-visible .oh-tip{opacity:1;transform:translate(-50%,0)}
.oh-pin:hover{z-index:4}

/* 휴대폰·태블릿: 글 → 조감도 */
.oh-hero{display:flex;flex-direction:column}
.oh-wrap{order:1}.oh-map{order:2}.oh-act-m{order:3;padding-top:28px;padding-bottom:36px}
.oh-text{padding-top:clamp(48px,8vh,72px);padding-bottom:28px}
.oh-act-d{display:none !important}
@media (min-width:640px) and (max-width:1023px){.oh-map{aspect-ratio:16/10}}
@media (max-width:1023px){
  .oh-hero{padding-bottom:0}
  .oh-face{width:40px;height:40px;padding:2px}
  .oh-face:after{top:40px;margin-left:-5px;border-width:5px}
  .oh-tag{margin-top:6px;padding:2px 7px;font-size:10px}
  .oh-dot{width:8px;height:8px}
  .oh-tip{display:none}
}

/* PC: 조감도가 화면 가득, 글은 왼쪽 위 */
@media (min-width:1024px){
  .oh-act-m{display:none}
  .oh-act-d{display:flex !important}
  .oh-hero{display:block;height:max(760px,calc(100svh - 72px))}
  .oh-map{position:absolute;inset:0;aspect-ratio:auto}
  .oh-stage{transform:translate(-50%,-46%)}
  .oh-map:before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;
    background:linear-gradient(90deg,rgba(246,244,239,.8) 0,rgba(246,244,239,.55) 24%,rgba(246,244,239,0) 46%),linear-gradient(180deg,rgba(246,244,239,.55) 0,rgba(246,244,239,0) 30%)}
  .oh-pins{z-index:2}
  .oh-wrap{position:relative;z-index:3;height:100%;pointer-events:none}
  .oh-text{padding-top:clamp(80px,15vh,150px);padding-bottom:0;pointer-events:auto}
  .oh-cap{right:20px;bottom:18px;font-size:12px}
  .oh-news{right:24px;top:24px;font-size:13px;padding:8px 14px}
}
@media (prefers-reduced-motion:reduce){.oh-rise,.oh-pin,.oh-pin-in,.oh-dot:after{animation:none !important;opacity:1}}

/* 큰 화면(1600px 이상): 상가 히어로와 같은 비율로 키움 */
@media (min-width:1600px){.oh-hero{zoom:1.12;height:max(760px,calc((100svh - 72px) / 1.12))}}
@media (min-width:1920px){.oh-hero{zoom:1.3;height:max(760px,calc((100svh - 72px) / 1.3))}}
@media (min-width:2300px){.oh-hero{zoom:1.6;height:max(760px,calc((100svh - 72px) / 1.6))}}
`;
