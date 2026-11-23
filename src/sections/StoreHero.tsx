import { useEffect, useRef, useState } from 'react';

/* ───────── 상가 히어로 (/store 맨 위) ─────────
   위: 제목(가운데) / 가운데: 실제 매장 정면 사진을 이어 붙인 거리 위로 연출 인물이 걸어가며 가게 앞에서 멈춤
   아래: 가게 이름 버튼(누르면 음식·매장 사진) / 전화번호 + "바로 입점 가능한 8개 호실 보기"
   - 화면이 간호사를 따라 자동으로 오른쪽으로 움직입니다. ‹ › 버튼으로 직접 넘겨 볼 수 있고, 8초 뒤 다시 따라갑니다.
   - 화면에 보일 때만 움직이고, 벗어나면 멈춥니다. "움직임 줄이기" 설정이면 멈춘 장면만 보여 줍니다.
   - 그림·사진 파일은 사용자가 GitHub public/walk/ 에 직접 올립니다.
   - 거리 사진을 바꾸면 STREET 의 너비·높이와 PLAN·SHOPS 의 x(가게 위치)만 고치면 됩니다. */

const BASE = '/walk/';

// 거리 사진 (가로로 긴 한 장) · 바닥 높이 · 사람 키 (모두 사진 픽셀 기준)
const STREET = { src: `${BASE}street.jpg`, w: 5887, h: 640, ground: 606, person: 215 };

// 사람 그림 묶음 정보 (영상에서 잰 걸음 속도·멈춤 구간 포함, 고치지 마세요)
type Sheet = { n: number; cols: number; rows: number };
type Sprite = { walk: Sheet; act: Sheet; w: number; h: number; walkHs: number; actDx: number[]; enterWalk: number; exitWalk: number };
const SPRITES: Record<'nurse' | 'md', Sprite> = {"nurse":{"walk":{"n":31,"cols":12,"rows":3},"act":{"n":42,"cols":12,"rows":4},"w":129,"h":240,"walkHs":0.4828,"actDx":[0.0448,0.0323,0.0323,0.0341,0.0394,0.043,0.0439,0.0403,0.0036,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0036,0.0278,0.0358,0.0305,0.0323,0.0349,0.0412,0.0448,0.0448,0.0448,0.0448],"enterWalk":8,"exitWalk":28},"md":{"walk":{"n":39,"cols":12,"rows":4},"act":{"n":45,"cols":12,"rows":4},"w":169,"h":240,"walkHs":-0.3114,"actDx":[-0.0285,-0.0292,-0.015,-0.0055,-0.0159,-0.0214,-0.0253,-0.0272,-0.0279,-0.0273,-0.0259,-0.0249,-0.0256,-0.0256,-0.0245,-0.0241,-0.0246,-0.0252,-0.0256,-0.022,-0.0015,-0.0019,-0.0113,-0.0174,-0.0123,-0.0037,-0.0035,-0.0077,-0.0127,-0.0127,-0.0248,-0.0248,-0.0249,-0.025,-0.0234,-0.0217,-0.0206,-0.0098,-0.0059,-0.0165,-0.0237,-0.024,-0.0264,-0.0272],"enterWalk":4,"exitWalk":7}};

// 누가 어디서 출발해서 어느 가게 앞에서 멈추고 무슨 말을 하는지 (x = 거리 사진 가로 위치)
type Plan = { who: 'nurse' | 'md'; dir: 1 | -1; x0: number; far: boolean; stops: { x: number; say: string }[]; pass: { from: number; to: number; say: string }[] };
// 맨 위(간호사)를 화면이 따라갑니다. 어머니와 딸은 같은 그림으로 두 번 나옵니다 (본죽 앞 / 장호덕 앞).
const PLAN: Plan[] = [
  { who: 'nurse', dir: 1, x0: -160, far: false, stops: [{ x: 720, say: '☕ 아아 한 잔' }], pass: [{ from: 2150, to: 2500, say: '🥐 여기 빵집 생기면 좋겠다' }, { from: 2990, to: 3340, say: '🍗 닭한상 12월 말 오픈이래' }] },
  { who: 'md', dir: -1, x0: 2100, far: true, stops: [{ x: 1250, say: '🥣 죽은 역시 본죽이지' }], pass: [] },
  // 거리 사진 오른쪽 바깥에서 출발해, 간호사가 장호덕 근처에 올 때 맞춰 장호덕 앞에서 멈춤
  { who: 'md', dir: -1, x0: 8300, far: true, stops: [{ x: 5000, say: '🥟 여기 새우김치 만두 맛있더라' }], pass: [] },
];
const LOOP_END = 5950; // 간호사가 여기까지 가면 처음부터 다시

// 누르면 사진이 나오는 가게 (비어 있으면 이름표를 보여 주지 않음)
// x: 거리 사진 속 가게 위치. -1 이면 아직 거리 사진에 없는 가게 → 장면 위 이름표 없이 아래 버튼으로만 사진 보기
type Shop = { id: string; name: string; x: number; line: string; photos?: string[]; vacant?: boolean };
const SHOPS: Shop[] = [
  { id: '123', name: '메가커피', x: 285, line: '123호 · 카페 · 영업 중', photos: ['/photos/stores/shop-123-in-1.jpg'] },
  { id: '124', name: '우지커피', x: 793, line: '124호 · 카페 · 영업 중', photos: ['/photos/stores/food-124-1.jpg', '/photos/stores/shop-124-1.jpg'] },
  { id: '125', name: '본죽&비빔밥', x: 1282, line: '125호 · 죽·비빔밥 · 영업 중', photos: ['/photos/stores/food-125-1.jpg', '/photos/stores/shop-125-in-1.jpg'] },
  { id: '126', name: '126호', x: 1792, line: '', vacant: true },
  { id: '127', name: '127호', x: 2290, line: '', vacant: true },
  { id: '128', name: '128호', x: 2720, line: '', vacant: true },
  { id: 'parking', name: '주차장', x: 3880, line: '총 608대 주차 가능 (근린생활시설 포함) · 102·103동 사이 출입구', photos: ['/photos/street-07.jpg'] },
  { id: '134', name: '장호덕 손만두', x: 5296, line: '134·135호 · 손만두·칼국수 · 영업 중', photos: ['/photos/stores/food-134-1.jpg', '/photos/stores/food-134-2.jpg'] },
];

const RATE = 1.25; // 재생 속도 (걸음과 이동을 함께 빠르게)

export default function StoreHero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const wkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navRef = useRef<(d: 1 | -1) => void>(() => {});
  const pausedRef = useRef(false);
  const [open, setOpen] = useState<Shop | null>(null);

  useEffect(() => { pausedRef.current = !!open; }, [open]);

  useEffect(() => {
    const scene = sceneRef.current, world = worldRef.current;
    const els = wkRefs.current;
    if (!scene || !world || PLAN.some((_, i) => !els[i])) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    type W = { id: 'nurse' | 'md'; c: Sprite; p: Plan; el: HTMLDivElement; bub: HTMLElement; x: number; mode: 'walk' | 'act'; f: number; acc: number; si: number; armed: boolean; pre: number; stopF: number; dw: number; dh: number; src: string; hideAt: number };
    const W: W[] = PLAN.map((p, idx) => {
      const id = p.who, c = SPRITES[id], el = els[idx] as HTMLDivElement;
      const th = 0.45 * Math.abs(c.walkHs) / 12; // 멈춤 영상은 1초에 12장
      const slow = c.actDx.map((d) => Math.abs(d) < th);
      let stopF = slow.findIndex((v, i) => v && slow[i + 1] && slow[i + 2]);
      if (stopF < 0) stopF = Math.floor(c.actDx.length / 2);
      let pre = 0; for (let i = 0; i < stopF; i++) pre += Math.abs(c.actDx[i]);
      return { id, c, p, el, bub: el.querySelector('.sw-bub') as HTMLElement, x: p.x0, mode: 'walk', f: 0, acc: 0, si: 0, armed: false, pre, stopF, dw: 0, dh: 0, src: '', hideAt: 0 };
    });

    let k = 1;
    const layout = () => {
      k = scene.clientHeight / STREET.h;
      world.style.width = `${STREET.w * k}px`;
      for (const o of W) {
        const sc = o.p.far ? 0.94 : 1;
        o.dh = STREET.person * k * 1.04 * sc; o.dw = o.dh * o.c.w / o.c.h;
        Object.assign(o.el.style, { width: `${o.dw}px`, height: `${o.dh}px`, top: `${(STREET.ground - (o.p.far ? 10 : 0)) * k - o.dh}px`, zIndex: o.p.far ? '1' : '2' });
        o.src = '';
      }
    };
    const say = (o: W, text: string, now: number) => { o.bub.textContent = text; o.bub.classList.add('on'); o.hideAt = now + 2400; };
    const draw = (o: W) => {
      const s = o.mode === 'walk' ? o.c.walk : o.c.act, src = `${BASE}${o.id}-${o.mode}.webp`;
      if (o.src !== src) { o.el.style.backgroundImage = `url(${src})`; o.el.style.backgroundSize = `${o.dw * s.cols}px ${o.dh * s.rows}px`; o.src = src; }
      o.el.style.backgroundPosition = `${-(o.f % s.cols) * o.dw}px ${-Math.floor(o.f / s.cols) * o.dh}px`;
      o.el.style.left = `${o.x * k - o.dw / 2}px`;
    };

    // 화면 위치: 평소에는 간호사를 따라가고, ‹ › 를 누르면 그 위치에 8초 머문 뒤 다시 따라감
    let cam = 0, manual = -1, manualUntil = 0, snap = true, visible = false;
    const maxCam = () => Math.max(0, STREET.w * k - scene.clientWidth);
    const clamp = (v: number) => Math.min(maxCam(), Math.max(0, v));
    const setCam = (v: number) => {
      cam = v; world.style.transform = `translateX(${-cam}px)`;
      if (prevRef.current) prevRef.current.disabled = cam <= 2;
      if (nextRef.current) nextRef.current.disabled = cam >= maxCam() - 2;
    };
    const follow = (x: number) => clamp(x * k - scene.clientWidth * 0.4);
    const camera = (x: number, now: number) => {
      if (manual >= 0 && now >= manualUntil) manual = -1;
      const want = manual >= 0 ? manual : follow(x);
      setCam(snap || Math.abs(want - cam) < 0.5 ? want : cam + (want - cam) * 0.12);
      snap = false;
    };
    navRef.current = (d) => {
      manual = clamp((manual >= 0 ? manual : cam) + d * scene.clientWidth * 0.8);
      manualUntil = performance.now() + 8000;
      if (reduce || !visible) setCam(manual);
    };
    layout();
    setCam(0); // ‹ › 버튼 보이기/숨기기 처음 상태 (버튼 사용 가능 여부는 여기서만 바꿈)

    // 움직임 줄이기: 각자 멈추는 가게 앞에 서 있는 장면만
    if (reduce) {
      for (const o of W) { o.x = o.p.stops[0]?.x ?? o.p.x0; o.mode = 'walk'; o.f = 0; draw(o); o.bub.textContent = o.p.stops[0]?.say ?? ''; o.bub.classList.add('on'); }
      setCam(follow(W[0].x));
      const onR = () => { layout(); for (const o of W) draw(o); setCam(clamp(cam)); };
      window.addEventListener('resize', onR);
      return () => window.removeEventListener('resize', onR);
    }

    for (const o of W) for (const t of ['walk', 'act']) { const im = new Image(); im.src = `${BASE}${o.id}-${t}.webp`; }
    let raf = 0, last = 0;
    const reset = () => { for (const o of W) { Object.assign(o, { x: o.p.x0, mode: 'walk', f: 0, acc: 0, si: 0, armed: false, hideAt: 0 }); o.bub.classList.remove('on'); } snap = true; };
    const step = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      if (!pausedRef.current) {
        for (const o of W) {
          const c = o.c, dir = o.p.dir;
          o.acc += dt * (o.mode === 'walk' ? 24 : 12) * RATE;
          while (o.acc >= 1) {
            o.acc -= 1;
            if (o.mode === 'walk') {
              o.x += dir * Math.abs(c.walkHs) / 24 * STREET.person;
              o.f = (o.f + 1) % c.walk.n;
              const st = o.p.stops[o.si];
              if (st && !o.armed && dir * (st.x - o.x) <= o.pre * STREET.person + 40) o.armed = true;
              if (o.armed && o.f === c.enterWalk) { o.mode = 'act'; o.f = 0; o.armed = false; }
            } else {
              o.x += dir * Math.abs(c.actDx[o.f] || 0) * STREET.person;
              o.f++;
              if (o.f === o.stopF) say(o, o.p.stops[o.si].say, now);
              if (o.f >= c.act.n - 1) { o.mode = 'walk'; o.f = c.exitWalk; o.si++; }
            }
          }
          if (o.mode === 'walk') { const ps = o.p.pass.find((q) => o.x >= q.from && o.x <= q.to); if (ps && !o.bub.classList.contains('on')) say(o, ps.say, now); }
          if (o.hideAt && now > o.hideAt) { o.bub.classList.remove('on'); o.hideAt = 0; }
          draw(o);
        }
        if (W[0].x > LOOP_END) reset();
      }
      camera(W[0].x, now);
      if (visible) raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) { last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(step); } else cancelAnimationFrame(raf);
    }, { threshold: 0.2 });
    io.observe(scene);
    const onR = () => { layout(); for (const o of W) draw(o); snap = true; };
    window.addEventListener('resize', onR);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('resize', onR); };
  }, []);

  const pick = (s: Shop) => {
    if (s.vacant) {
      // 입점추천(StoreUnits)이 이 이벤트를 받아 해당 호실 상세를 엽니다.
      window.dispatchEvent(new CustomEvent('store-open-room', { detail: { room: s.id } }));
      return;
    }
    setOpen(s);
    // PC: 사진 카드가 거리 장면 안에 뜨므로 장면이 화면에 다 보이게
    if (window.innerWidth >= 768) sceneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <section id="store-hero" className="sw">
      <style>{CSS}</style>
      <div className="sw-in sw-head">
        <p className="sw-el">Enjoy your <b>E</b>-Life</p>
        <h1 className="sw-h1"><b>e편한세상</b> 시티 고색</h1>
        <p className="sw-lead"><strong>439병상 종합병원 바로 앞,</strong><br />의료·주거 수요가 만나는 스트리트 상가</p>
      </div>

      <div ref={sceneRef} className="sw-scene" role="img" aria-label="102동 1층 상가 거리 실제 사진 위로 병원 직원과 진료 온 가족이 걸어가는 장면">
        <div ref={worldRef} className="sw-world">
          <img className="sw-street" src={STREET.src} alt="" fetchPriority="high" />
          {SHOPS.filter((s) => s.x >= 0).map((s) => (
            <button key={s.id} type="button" className={`sw-tag ${s.vacant ? 'sw-tag-v' : ''}`} style={{ left: `${(s.x / STREET.w) * 100}%` }} onClick={() => pick(s)}>
              {s.vacant ? `${s.id}호 입점 가능` : s.name}
            </button>
          ))}
          {PLAN.map((p, i) => (
            <div key={i} ref={(el) => { wkRefs.current[i] = el; }} className="sw-wk"><span className="sw-bub" /></div>
          ))}
        </div>
        <button ref={prevRef} type="button" className="sw-nav sw-prev" aria-label="거리 왼쪽으로 보기" onClick={() => navRef.current(-1)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button ref={nextRef} type="button" className="sw-nav sw-next" aria-label="거리 오른쪽으로 보기" onClick={() => navRef.current(1)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
        </button>
        <span className="sw-ai">거리: 실제 사진 · 인물: 연출 이미지</span>

        {open && (
          <div className="sw-card" role="dialog" aria-label={`${open.name} 사진`}>
            <button type="button" className="sw-x" aria-label="닫기" onClick={() => setOpen(null)}>×</button>
            <div className="sw-ph">
              {(open.photos || []).slice(0, 2).map((p) => <img key={p} src={p} alt={`${open.name} 사진`} />)}
            </div>
            <p className="sw-cn">{open.name}</p>
            <p className="sw-cl">{open.line}</p>
          </div>
        )}
      </div>
      {open && <button type="button" className="sw-dim" aria-label="닫기" onClick={() => setOpen(null)} />}

      <div className="sw-in">
        <div className="sw-chip-row" aria-label="가게 이름을 누르면 사진을 볼 수 있어요">
          {SHOPS.map((s) => (
            <button key={s.id} type="button" className={`sw-chip ${s.vacant ? 'sw-chip-v' : ''}`} onClick={() => pick(s)}>
              {s.vacant ? `${s.id}호 입점 가능` : s.name}
            </button>
          ))}
        </div>
        <div className="sw-act">
          <a href="tel:031-293-1073" className="sw-tel" aria-label="분양·임대 문의 전화 031)293-1073">
            <span className="sw-tel-l">분양·임대<br />문의</span>
            <span className="sw-num">031)293-1073</span>
          </a>
          <a href="#units" className="sw-cta">
            <span>바로 입점 가능한 8개 호실 보기</span>
            <span className="sw-ic" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.sw{background:#F6F4EF;padding:clamp(24px,5vh,52px) 0 clamp(28px,4vh,44px)}
.sw-in{max-width:1280px;margin:0 auto;padding:0 40px}
.sw-head{text-align:center}
.sw-el{margin:0;font-family:'Jost',sans-serif;font-style:italic;font-weight:300;font-size:clamp(20px,2.2vw,28px);line-height:1.1;color:#3F3F46}
.sw-el b{font-weight:400;color:#FF671D}
.sw-h1{margin:8px 0 0;font-family:'Pretendard Variable',Pretendard,sans-serif;font-size:clamp(34px,4vw,56px);font-weight:800;letter-spacing:-.04em;line-height:1.1;color:#0F1C3A;white-space:nowrap}
.sw-h1 b{font-weight:800;color:#FF671D}
.sw-lead{margin:16px 0 0;font-size:clamp(16px,1.6vw,20px);line-height:1.45;letter-spacing:-.5px;color:#1C1C1E;word-break:keep-all}
.sw-lead strong{font-weight:800;color:#0F1C3A}
.sw-scene{position:relative;margin-top:clamp(20px,3.5vh,36px);height:clamp(300px,42vh,440px);overflow:hidden;background:#EDEAE4;scroll-margin-top:96px;scroll-margin-bottom:24px}
.sw-world{position:absolute;left:0;top:0;height:100%;will-change:transform}
.sw-street{display:block;height:100%;width:auto;max-width:none;filter:saturate(.95) contrast(1.02)}
.sw-wk{position:absolute;left:0;top:0;background-repeat:no-repeat;will-change:left,background-position}
.sw-wk::after{content:"";position:absolute;left:12%;right:12%;bottom:-1.5%;height:5%;border-radius:50%;background:radial-gradient(ellipse at center,rgba(15,28,58,.28),rgba(15,28,58,0) 70%);z-index:-1}
.sw-bub{position:absolute;left:50%;bottom:100%;transform:translate(-50%,6px);margin-bottom:6px;background:rgba(255,255,255,.96);border-radius:14px;padding:7px 12px;font-size:13px;font-weight:800;color:#0F1C3A;white-space:nowrap;box-shadow:0 8px 20px -10px rgba(15,28,58,.45);opacity:0;transition:opacity .35s,transform .35s;pointer-events:none}
.sw-bub.on{opacity:1;transform:translate(-50%,0)}
.sw-ai{position:absolute;right:16px;bottom:10px;z-index:4;font-size:11px;font-weight:700;color:#71717A;background:rgba(255,255,255,.85);padding:4px 8px;border-radius:6px}
.sw-tag{position:absolute;top:5%;z-index:3;transform:translateX(-50%);border:0;border-radius:999px;background:rgba(15,28,58,.86);color:#fff;font-family:inherit;font-size:13px;font-weight:800;padding:7px 12px;cursor:pointer;white-space:nowrap;box-shadow:0 6px 16px -8px rgba(15,28,58,.6)}
.sw-tag::after{content:" ›";opacity:.7}
.sw-tag-v{background:#FF671D}
.sw-nav{position:absolute;top:50%;z-index:5;width:48px;height:48px;margin-top:-24px;border:0;border-radius:50%;background:rgba(255,255,255,.94);color:#0F1C3A;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 20px -8px rgba(15,28,58,.5);transition:opacity .25s,transform .2s}
.sw-nav:hover{transform:scale(1.06)}
.sw-nav:disabled{opacity:0;pointer-events:none}
.sw-prev{left:16px}
.sw-next{right:16px}
.sw-tag:focus-visible,.sw-chip:focus-visible,.sw-x:focus-visible,.sw-nav:focus-visible,.sw-tel:focus-visible,.sw-cta:focus-visible{outline:3px solid #FF671D;outline-offset:3px}
.sw-chip-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.sw-chip{flex:none;border:1.5px solid #D6D3D1;border-radius:999px;background:#fff;font-family:inherit;font-size:15px;font-weight:700;color:#0F1C3A;padding:9px 16px;cursor:pointer;white-space:nowrap}
.sw-chip:hover{border-color:#0F1C3A}
.sw-chip-v{border-color:#FF671D;color:#B23C05;background:#FFF1E8}
.sw-act{display:flex;justify-content:flex-end;align-items:center;gap:36px;margin-top:18px}
.sw-tel{display:inline-flex;align-items:center;gap:12px;color:#1C1C1E;text-decoration:none}
.sw-tel-l{font-size:11px;font-weight:700;line-height:1.25;color:#3F3F46}
.sw-num{font-size:28px;font-weight:700;letter-spacing:-.5px;line-height:1;transition:color .2s ease}
.sw-tel:hover .sw-num{color:#D24A0E}
.sw-cta{display:inline-flex;align-items:center;gap:12px;color:#D24A0E;font-size:17px;font-weight:800;text-decoration:none}
.sw-ic{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#1C1C1E;color:#fff;transition:transform .25s ease}
.sw-cta:hover .sw-ic{transform:rotate(-45deg)}
.sw-card{position:absolute;left:16px;top:16px;z-index:6;width:320px;background:#fff;border-radius:12px;padding:12px;box-shadow:0 20px 40px -16px rgba(15,28,58,.45)}
.sw-ph{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.sw-ph img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:8px;filter:saturate(.9) contrast(1.03) sepia(.07)}
.sw-ph img:only-child{grid-column:1 / -1;aspect-ratio:4/3}
.sw-cn{margin:10px 2px 0;font-size:17px;font-weight:800;color:#0F1C3A}
.sw-cl{margin:2px 2px 2px;font-size:13px;color:#52525B}
.sw-x{position:absolute;right:8px;top:8px;z-index:1;width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.92);font-size:20px;line-height:1;cursor:pointer;color:#0F1C3A;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.sw-dim{display:none}
@media (max-width:767px){
  .sw{padding:24px 0 32px}
  .sw-in{padding:0 20px}
  .sw-h1{font-size:clamp(30px,9vw,40px)}
  .sw-scene{height:270px;margin-top:20px}
  .sw-bub{font-size:12px;padding:6px 10px}
  .sw-tag{font-size:12px;padding:6px 10px}
  .sw-nav{width:40px;height:40px;margin-top:-20px}
  .sw-prev{left:10px}
  .sw-next{right:10px}
  /* 휴대폰: 가게 버튼은 한 줄로 옆으로 밀어서 보기 */
  .sw-chip-row{flex-wrap:nowrap;overflow-x:auto;margin:14px -20px 0;padding:0 20px 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
  .sw-chip-row::-webkit-scrollbar{display:none}
  .sw-chip{font-size:14px;padding:8px 14px}
  .sw-act{flex-direction:column;align-items:flex-start;gap:14px;margin-top:16px}
  .sw-card{position:fixed;left:0;right:0;top:auto;bottom:0;width:auto;z-index:61;border-radius:16px 16px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom))}
  .sw-dim{display:block;position:fixed;inset:0;z-index:60;border:0;background:rgba(15,28,58,.45)}
}
@media (prefers-reduced-motion:reduce){.sw-nav,.sw-ic{transition:none}}
`;
