import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/* ───────── 데이터 ───────── */
// 인트로: 액자 안에서 순서대로 바뀌는 사진 (마지막 컷이 화면 전체로 열림)
const INTRO = [
  { src: '/photos/street-09.jpg', pos: '50% 60%' }, // 수원덕산병원 앞
  { src: '/photos/street-06.jpg', pos: '50% 50%' }, // 우지커피 앞
  { src: '/photos/street-03.jpg', pos: '40% 52%' }, // 본죽&비빔밥
  { src: '/photos/street-10.jpg', pos: '45% 45%' }, // 장호덕 칼국수·손만두
  { src: '/photos/street-08.jpg', pos: '45% 50%' }, // 닭한상 간판
  { src: '/photos/street-07.jpg', pos: '70% 55%' }, // 장호덕 손만두 앞
  { src: '/photos/street-12.jpg', pos: '45% 50%' }, // 분양홍보관
  { src: '/photos/street-11.jpg', pos: '40% 40%' }, // 101동 현수막 (메인, 마지막)
];

// 히어로 뒷배경: 투시도 로테이션 (hero-2는 오피스텔이라 제외)
const BG = ['/photos/hero-1.jpg', '/photos/hero-3.jpg', '/photos/hero-5.jpg', '/photos/hero-4.jpg'];

// 오른쪽 사진 기둥: 실사진 + 파스텔 칸
type Tile = { src?: string; pos?: string; cap?: string; color?: string };
const COLS: { up: boolean; top: number; tiles: Tile[] }[] = [
  { up: false, top: -30, tiles: [
    { src: '/photos/stores/shop-125-1.jpg', cap: '본죽&비빔밥 · 125호' },
    { src: '/photos/stores/food-125-1.jpg', cap: '본죽 돌솥비빔밥' },
    { src: '/photos/stores/hospital-1.jpg', cap: '수원덕산병원 · 지역응급의료센터' },
    { src: '/photos/stores/food-134-2.jpg', cap: '장호덕 오징어볶음' },
  ] },
  { up: true, top: -10, tiles: [
    { src: '/photos/stores/shop-124-1.jpg', cap: '우지커피 · 124호' },
    { src: '/photos/stores/food-124-1.jpg', cap: '우지커피 프루티 슈페너' },
    { src: '/photos/stores/shop-123-in-1.jpg', cap: '메가커피 · 123호' },
    { src: '/photos/street-08.jpg', pos: '22% 50%', cap: '닭한상 · 12월 오픈' },
  ] },
  { up: false, top: -110, tiles: [
    { src: '/photos/stores/shop-134-1.jpg', cap: '장호덕 칼국수·손만두 · 134·135호' },
    { src: '/photos/stores/food-134-1.jpg', cap: '장호덕 새우 손만두' },
    { src: '/photos/stores/shop-125-in-1.jpg', cap: '본죽&비빔밥 매장 안' },
    { src: '/photos/stores/shop-121-1.jpg', cap: '약국 · 121호' },
  ] },
];

/* ───────── 타이밍 (초) ───────── */
const STEP = 0.32;            // 인트로 한 컷당 시간
const T0 = 0.15;              // 첫 컷 시작
const LAST = T0 + (INTRO.length - 1) * STEP; // 마지막 컷 시작 (≈2.39)
const GROW = LAST + 0.71;     // 액자가 화면 전체로 열리기 시작 (≈3.10)
const OUT = GROW + 0.8;       // 인트로 사라지기 시작 (≈3.90)
const INTRO_MS = Math.round((OUT + 0.45) * 1000);
const HERO_DELAY_WITH_INTRO = OUT; // 인트로가 끝난 뒤 히어로 글이 올라옴
const FILL_RANGE = 300;       // 스크롤 이만큼(px) 내리면 빨간 선이 끝까지 채워짐

const SESSION_KEY = 'storeIntroSeen';

function shouldPlayIntro() {
  // 인트로는 쓰지 않습니다. 다시 켜려면 sessionStorage 확인 후 true를 돌려주던 예전 내용으로 되돌리면 됩니다.
  return false;
}

export default function StoreHero() {
  const [intro, setIntro] = useState<boolean>(() => (typeof window === 'undefined' ? false : shouldPlayIntro()));
  const [heroDelay, setHeroDelay] = useState<number>(() => (intro ? HERO_DELAY_WITH_INTRO : 0.1));

  // 인트로 자동 종료
  useEffect(() => {
    if (!intro) return;
    const t = window.setTimeout(() => setIntro(false), INTRO_MS);
    return () => window.clearTimeout(t);
  }, [intro]);

  const skipIntro = () => {
    setIntro(false);
    setHeroDelay(0);
  };

  // 왼쪽 세로선: 빨간 구간이 스크롤에 따라 아래로 채워짐
  const bodyRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const [redPx, setRedPx] = useState(0);

  useLayoutEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const body = bodyRef.current;
      const lead = leadRef.current;
      if (!body || !lead) return;
      const total = body.offsetHeight;
      const base = lead.offsetTop + lead.offsetHeight; // Enjoy your E-Life ~ 설명 두 줄까지
      const p = Math.min(1, Math.max(0, window.scrollY / FILL_RANGE));
      setRedPx(base + (total - base) * p);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const d = (s: number) => `${(heroDelay + s).toFixed(2)}s`;

  return (
    <section
      id="store-hero"
      className="sh-hero relative overflow-clip bg-white"
    >
      <style>{CSS}</style>

      {/* ── 인트로 ── */}
      {intro && (
        <div className="sh-intro" aria-hidden="true" onClick={skipIntro}>
          <span className="sh-itop">e편한세상 CITY · GOSAEK</span>
          <div className="sh-ifr">
            <span className="sh-blw">
              <span className="sh-bl sh-b-top" />
              <span className="sh-bl sh-b-left" />
              <span className="sh-bl sh-b-right" />
              <span className="sh-bl sh-b-bot" />
            </span>
            <div className="sh-iin">
              {INTRO.map((ph, i) => (
                <img
                  key={ph.src}
                  src={ph.src}
                  alt=""
                  style={{
                    objectPosition: ph.pos,
                    animation: i < INTRO.length - 1
                      ? `shFlash ${STEP}s linear ${(T0 + i * STEP).toFixed(2)}s`
                      : `shLast 1.3s ease ${LAST.toFixed(2)}s forwards`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="sh-icap">
            <b>e편한세상 시티 고색 <i>MEDICAL STREET</i></b>
            <span className="sh-inum">
              {INTRO.map((_, i) => (
                <span
                  key={i}
                  style={{
                    animation: i < INTRO.length - 1
                      ? `shFlash ${STEP}s linear ${(T0 + i * STEP).toFixed(2)}s`
                      : `shLast 1.3s ease ${LAST.toFixed(2)}s forwards`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')} / {String(INTRO.length).padStart(2, '0')}
                </span>
              ))}
            </span>
          </div>
          <span className="sh-iskip">클릭하면 건너뛰기</span>
        </div>
      )}

      {/* ── 뒷배경: 투시도 로테이션 ── */}
      <div className="sh-bg" aria-hidden="true">
        {BG.map((src, i) => (
          <img key={src} src={src} alt="" style={{ animationDelay: `${(-1.4 + i * 7).toFixed(1)}s` }} />
        ))}
        <span className="sh-veil" />
      </div>

      <div className="mx-auto flex h-full max-w-[1280px] items-start px-5 sm:px-10">
        {/* ── 왼쪽 글 ── */}
        <div className="sh-text relative z-[1] flex max-w-[560px] flex-col">
          <a href="#calendar" className="sh-push sh-drop" style={{ animationDelay: d(0.35) }} aria-label="입점 소식: 닭한상 129호, 12월 말 오픈">
            <span className="sh-push-ic" aria-hidden="true">
              <img src="/photos/street-08.jpg" alt="" />
            </span>
            <span className="sh-push-bd">
              <span className="sh-push-hd"><b>고색 상가 · 입점 소식</b><i>11월</i></span>
              <strong>닭한상, 12월 말 오픈해요</strong>
              <span>129호 삼계탕·닭볶음탕 · <span className="whitespace-nowrap">인테리어 공사 중</span></span>
            </span>
          </a>

          {/* Enjoy your E-Life ~ 입점 가능한 호실 보기 (왼쪽 세로선이 붙는 묶음) */}
          <div ref={bodyRef} className="sh-body relative mt-[38px]">
            <span className="sh-track" aria-hidden="true" style={{ animationDelay: d(0.3) }} />
            <span className="sh-red-wrap" aria-hidden="true" style={{ animationDelay: d(1.1) }}>
              <span className="sh-red" style={{ height: `${redPx}px` }} />
            </span>

            <p className="sh-rise sh-el m-0" style={{ animationDelay: d(0.07) }}>
              Enjoy your <b>E</b>-Life
            </p>
            <h1 className="sh-title sh-rise mt-[10px] mb-0 text-[#0F1C3A]" style={{ animationDelay: d(0.14) }}>
              <span className="block whitespace-nowrap font-extrabold"><b className="font-extrabold text-[#FF671D]">e편한세상</b> 시티 고색</span>
            </h1>
            <p ref={leadRef} className="sh-rise sh-lead mt-[26px] mb-0" style={{ animationDelay: d(0.21) }}>
              <strong>439병상 종합병원 바로 앞,</strong>
              <br />
              <span>의료·주거 수요가 만나는 스트리트 상가</span>
            </p>

            <div className="sh-rise mt-[30px] flex flex-col items-start gap-4" style={{ animationDelay: d(0.28) }}>
              <a href="tel:031-293-1073" className="sh-tel" aria-label="분양·임대 문의 전화 031)293-1073">
                <span className="flex flex-col text-[11px] font-bold leading-[1.25] text-[#3F3F46]"><span>분양·임대</span><span>문의</span></span>
                <span className="sh-num">031)293-1073</span>
              </a>
              <a href="#units" className="sh-cta">
                <span className="text-[#D24A0E]">입점 가능한 호실 보기</span>
                <span className="sh-ic" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ── 오른쪽 사진 기둥 (PC만) ── */}
        <div className="sh-mosaic" aria-hidden="true" style={{ animationDelay: d(0) }}>
          {COLS.map((c, ci) => (
            <div key={ci} className={c.up ? 'sh-col sh-up' : 'sh-col'} style={{ left: 64 + ci * 224, top: c.top }}>
              {[...c.tiles, ...c.tiles].map((t, ti) => (
                <div
                  key={ti}
                  className="sh-tile"
                  style={t.color
                    ? { background: t.color, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)' }
                    : { background: '#D6D3D1', boxShadow: '0 18px 34px -20px rgba(0,0,0,0.45)' }}
                >
                  {t.src && <img src={t.src} alt="" loading="lazy" style={{ objectPosition: t.pos }} />}
                  {t.cap && <span className="sh-cap">{t.cap}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── 스타일 ───────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@1,300;1,400&display=swap');
/* 입점 소식: 앱 푸시 알림 모양 */
.sh-push{position:relative;align-self:flex-start;display:flex;align-items:flex-start;gap:12px;width:min(372px,100%);padding:12px 16px 13px 12px;border-radius:22px;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(22px) saturate(180%);backdrop-filter:blur(22px) saturate(180%);border:1px solid rgba(255,255,255,.7);box-shadow:0 9px 0 -5px rgba(255,255,255,.55),0 1px 1px rgba(15,28,58,.04),0 14px 34px -12px rgba(15,28,58,.28);color:#1C1C1E;text-decoration:none;transition:transform .25s ease,box-shadow .25s ease}
.sh-push:hover{transform:translateY(-2px) scale(1.01);box-shadow:0 9px 0 -5px rgba(255,255,255,.55),0 1px 1px rgba(15,28,58,.04),0 20px 40px -14px rgba(15,28,58,.34)}
.sh-push-ic{flex:none;width:40px;height:40px;border-radius:10px;overflow:hidden;background:#2E2E30;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}
.sh-push-ic img{width:100%;height:100%;object-fit:cover;object-position:24% 50%;transform:scale(1.6)}
.sh-push-bd{display:flex;flex-direction:column;min-width:0;flex:1}
.sh-push-hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:3px}
.sh-push-hd b{font-size:12px;font-weight:600;letter-spacing:-.1px;color:#71717A}
.sh-push-hd i{font-style:normal;font-size:12px;color:#A1A1AA}
.sh-push strong{font-size:15px;font-weight:700;letter-spacing:-.3px;line-height:1.35;color:#1C1C1E}
.sh-push-bd>span:last-child{word-break:keep-all;font-size:14px;line-height:1.4;letter-spacing:-.2px;color:#3F3F46}
.sh-push:focus-visible{outline:3px solid #FF671D;outline-offset:4px}
.sh-drop{opacity:0;transform:translateY(-26px) scale(.96);animation:shDrop .75s cubic-bezier(.2,1.25,.35,1) forwards}
@keyframes shDrop{60%{opacity:1}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.sh-drop{animation:none;opacity:1;transform:none}}
.sh-el{font-family:'Jost',sans-serif;font-style:italic;font-weight:300;font-size:clamp(22px,2.6vw,30px);line-height:1.1;letter-spacing:.3px;color:#3F3F46}
.sh-el b{font-weight:400;color:#FF671D}
.sh-lead{font-size:clamp(18px,1.8vw,22px);line-height:1.4;letter-spacing:-.6px;color:#1C1C1E}
.sh-lead strong{font-weight:800;color:#0F1C3A}
.sh-lead span{font-weight:400}
.sh-hero{height:auto;min-height:640px}
@media (min-width:1024px){.sh-hero{height:max(760px,calc(100svh - 72px))}}

/* 인트로 */
.sh-intro{position:fixed;inset:0;z-index:100;background:#F3F3F1;cursor:pointer;animation:shOut .45s ease ${OUT.toFixed(2)}s forwards}
.sh-ifr{position:absolute;left:50%;top:50%;width:min(580px,86vw);height:min(366px,54vw);transform:translate(-50%,-50%);overflow:hidden;box-sizing:border-box;padding:6px;animation:shGrow .9s cubic-bezier(.76,0,.24,1) ${GROW.toFixed(2)}s forwards}
.sh-iin{position:relative;width:100%;height:100%;overflow:hidden}
.sh-iin img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0}
.sh-blw{position:absolute;inset:0;pointer-events:none;z-index:2;animation:shFade .2s ease ${(GROW - 0.05).toFixed(2)}s forwards}
.sh-bl{position:absolute;background:#E3141B;animation-fill-mode:both;animation-timing-function:cubic-bezier(.45,0,.55,1)}
.sh-b-top{left:0;top:0;width:100%;height:1.5px;transform-origin:left;animation-name:shX;animation-duration:1.1s;animation-delay:.15s}
.sh-b-left{left:0;top:0;width:1.5px;height:100%;transform-origin:top;animation-name:shY;animation-duration:1.1s;animation-delay:.15s}
.sh-b-right{right:0;top:0;width:1.5px;height:100%;transform-origin:top;animation-name:shY;animation-duration:1.14s;animation-delay:1.25s}
.sh-b-bot{left:0;bottom:0;width:100%;height:1.5px;transform-origin:left;animation-name:shX;animation-duration:1.14s;animation-delay:1.25s}
.sh-itop{position:absolute;left:50%;top:calc(50% - min(183px,27vw) - 30px);transform:translateX(-50%);font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(227,20,27,.55);white-space:nowrap;animation:shFade .25s ease ${(GROW - 0.12).toFixed(2)}s forwards}
.sh-icap{position:absolute;left:50%;top:calc(50% + min(183px,27vw) + 14px);width:min(580px,86vw);transform:translateX(-50%);display:flex;justify-content:space-between;align-items:baseline;animation:shFade .25s ease ${(GROW - 0.12).toFixed(2)}s forwards}
.sh-icap b{font-size:12px;font-weight:800;letter-spacing:-.2px;color:#E3141B}
.sh-icap i{font-style:normal;font-size:10px;font-weight:700;letter-spacing:2.5px;color:#E3141B;opacity:.55;margin-left:8px}
.sh-inum{position:relative;display:inline-block;width:56px;height:14px;font-size:11px;font-weight:800;letter-spacing:1px;color:#E3141B;text-align:right}
.sh-inum span{position:absolute;right:0;top:0;opacity:0;white-space:nowrap}
.sh-iskip{position:absolute;right:28px;bottom:24px;font-size:12px;font-weight:600;color:rgba(227,20,27,.5);animation:shFade .25s ease ${(GROW - 0.12).toFixed(2)}s forwards}
@keyframes shFlash{from{opacity:1}to{opacity:1}}
@keyframes shLast{from{opacity:1;transform:scale(1.15)}to{opacity:1;transform:scale(1)}}
@keyframes shGrow{to{width:100%;height:100%;padding:0}}
@keyframes shOut{to{opacity:0;visibility:hidden}}
@keyframes shFade{to{opacity:0}}
@keyframes shX{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes shY{from{transform:scaleY(0)}to{transform:scaleY(1)}}

/* 뒷배경 로테이션 */
.sh-bg{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.sh-bg img{position:absolute;left:-4%;top:-4%;width:108%;height:108%;object-fit:cover;opacity:0;will-change:transform,opacity;animation:shKb 28s ease-in-out infinite}
.sh-veil{position:absolute;inset:0;background:radial-gradient(ellipse 640px 560px at 24% 46%,rgba(255,255,255,.80) 0%,rgba(255,255,255,.58) 45%,rgba(255,255,255,0) 78%),linear-gradient(90deg,rgba(255,255,255,.50) 0%,rgba(255,255,255,.32) 45%,rgba(255,255,255,.08) 72%,rgba(255,255,255,0) 100%),linear-gradient(180deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,0) 18%,rgba(255,255,255,0) 80%,#fff 100%)}
.sh-bg img{filter:saturate(1.08) contrast(1.04)}
.sh-title,.sh-text p{text-shadow:0 1px 14px rgba(255,255,255,.9)}
@media (max-width:1023px){.sh-veil{background:linear-gradient(180deg,rgba(255,255,255,.66),rgba(255,255,255,.78) 60%,#fff)}}
@keyframes shKb{0%{opacity:0;transform:scale(1.02)}5%{opacity:1}25%{opacity:1}30%{opacity:0;transform:scale(1.09) translate(-1%,-.5%)}100%{opacity:0;transform:scale(1.02)}}

/* 왼쪽 글 */
.sh-text{padding-top:clamp(56px,11vh,112px);padding-bottom:64px}
.sh-rise{animation:shRise .8s cubic-bezier(.2,.7,.2,1) both}
@keyframes shRise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
.sh-title{font-family:'Pretendard Variable',Pretendard,sans-serif !important;font-size:clamp(38px,9.5vw,58px);line-height:1.1;letter-spacing:-.04em}
.sh-live{align-self:flex-start;display:inline-flex;align-items:center;gap:14px;padding:10px 20px 10px 10px;border-radius:6px;background:rgba(255,255,255,.92);border:1px solid #E7E5E4;box-shadow:0 12px 30px -16px rgba(15,28,58,.35);color:#1C1C1E;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}
.sh-live:hover{transform:translateY(-2px);box-shadow:0 16px 34px -16px rgba(15,28,58,.45)}
.sh-live:hover strong{text-decoration:underline}
.sh-logo{flex:none;width:46px;height:46px;border-radius:50%;overflow:hidden;background:#3a3a3a;border:1px solid #E4E4E7}
.sh-logo img{width:100%;height:100%;object-fit:cover;object-position:24% 50%;transform:scale(1.6)}
.sh-live-tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;letter-spacing:1.2px;color:#1F4E3D}
.sh-dot{width:6px;height:6px;border-radius:50%;background:#1F4E3D;animation:shPulse 1.8s ease-out infinite}
@keyframes shPulse{0%{box-shadow:0 0 0 0 rgba(31,78,61,.45)}70%{box-shadow:0 0 0 7px rgba(31,78,61,0)}100%{box-shadow:0 0 0 0 rgba(31,78,61,0)}}
.sh-tel{display:inline-flex;align-items:center;gap:12px;color:#1C1C1E;text-decoration:none;text-align:center}
.sh-num{font-size:26px;font-weight:700;letter-spacing:-.5px;line-height:1;transition:color .2s ease}
.sh-tel:hover .sh-num{color:#D24A0E}
.sh-cta{display:inline-flex;align-items:center;gap:12px;text-decoration:none;font-size:17px;font-weight:800}
.sh-ic{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#1C1C1E;color:#fff;transition:transform .25s ease}
.sh-cta:hover .sh-ic{transform:rotate(-45deg)}
.sh-tel:focus-visible,.sh-cta:focus-visible,.sh-live:focus-visible{outline:3px solid #FF6F00;outline-offset:4px;border-radius:6px}

/* 왼쪽 세로선: 회색 트랙 + 빨간 구간 */
.sh-body{--sh-x:-30px}
@media (max-width:639px){.sh-body{--sh-x:-14px}}
.sh-track{position:absolute;left:calc(var(--sh-x) + 1px);top:-3px;bottom:0;width:1px;background:#D6D6DB;transform-origin:top;animation:shY .9s cubic-bezier(.45,0,.55,1) both}
.sh-red-wrap{position:absolute;left:var(--sh-x);top:-3px;bottom:0;width:3px;transform-origin:top;animation:shY .5s cubic-bezier(.45,0,.55,1) both}
.sh-red{display:block;width:3px;background:#E3141B;transition:height .08s linear}
/* 왼쪽 세로선은 쓰지 않음 (다시 쓰려면 이 줄만 지우면 됩니다) */
.sh-track,.sh-red-wrap{display:none}

/* 오른쪽 사진 기둥 */
.sh-mosaic{display:none}
@media (min-width:1024px){.sh-mosaic{display:block;position:absolute;top:0;bottom:0;right:0;width:min(52vw,820px);overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 9%,#000 91%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0,#000 9%,#000 91%,transparent 100%);animation:shRise 1s ease both}}
.sh-col{position:absolute;display:flex;flex-direction:column;gap:14px;will-change:transform;animation:shDown 34s linear infinite}
.sh-col.sh-up{animation-name:shUp}
.sh-mosaic:hover .sh-col{animation-play-state:paused}
@keyframes shDown{from{transform:translate3d(0,0,0)}to{transform:translate3d(0,-50%,0)}}
@keyframes shUp{from{transform:translate3d(0,-50%,0)}to{transform:translate3d(0,0,0)}}
.sh-tile{position:relative;flex:none;width:210px;height:280px;border-radius:6px;overflow:hidden}
.sh-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sh-cap{position:absolute;left:12px;bottom:12px;padding:4px 9px;border-radius:6px;background:rgba(255,255,255,.88);font-size:11px;font-weight:700;color:#1C1C1E}

@media (prefers-reduced-motion:reduce){
  .sh-intro{display:none}
  .sh-bg img,.sh-col,.sh-rise,.sh-track,.sh-red-wrap,.sh-mosaic,.sh-dot{animation:none !important}
  .sh-bg img:first-child{opacity:1}
}
`;
