import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ───────── 입지분석 (카드 4장 → 누르면 왼쪽 목차 + 글) ─────────
   글 내용은 아래 TOPICS 와 각 Article 함수 안의 문장만 고치면 됩니다. */

type Topic = { n: number; tab: string; name: string; fact: string; card: string; subs: string[] };

const TOPICS: Topic[] = [
  { n: 1, tab: '의료', name: '수원덕산병원', fact: '439병상 · 지역응급의료센터', card: '/photos/location/card-1.jpg', subs: ['한눈에 보기', '외래 환자·보호자 수요', '병원 종사자 수요', '24시간 운영 시설'] },
  { n: 2, tab: '교통', name: '광역 교통망', fact: '서울 직행버스 3개 노선 · 수원역', card: '/photos/location/card-2.jpg', subs: ['한눈에 보기', '서울 직행버스', '고색역 · 수원역', 'GTX-C'] },
  { n: 3, tab: 'R&D', name: '탑동 이노베이션밸리', fact: '상가 앞 첨단업무용지 약 1만 8천 평', card: '/photos/location/card-3.jpg', subs: ['한눈에 보기', '들어오는 산업', '상가 앞 A2·A3 블록', '단지 안 상업시설 제한', '진행 단계'] },
  { n: 4, tab: '행정', name: '서수원 행정타운', fact: '구청 · 경찰서 · 보건소 · 우체국', card: '/photos/location/card-4.jpg', subs: ['한눈에 보기', '위치', '평일 낮 수요'] },
];

const PHONE = '031)293-1073';
const TEL = 'tel:031-293-1073';
const subId = (n: number, k: number) => `loc${n}-${k}`;

export default function StoreLocation() {
  const [active, setActive] = useState<number>(0); // 0 = 카드 목록, 1~4 = 글
  const [cur, setCur] = useState<number>(0); // 지금 읽는 소제목
  const topRef = useRef<HTMLElement>(null);

  // 주소 끝이 #location-2 처럼 들어오면 그 글을 바로 엽니다
  useEffect(() => {
    const m = window.location.hash.match(/^#location-([1-4])$/);
    if (m) {
      setActive(Number(m[1]));
      setTimeout(() => topRef.current?.scrollIntoView({ block: 'start' }), 50);
    }
  }, []);

  const open = (n: number) => {
    setActive(n);
    setCur(0);
    try { history.replaceState(null, '', n ? `#location-${n}` : '#location'); } catch { /* 무시 */ }
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const goSub = (n: number, k: number) => {
    document.getElementById(subId(n, k))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 스크롤 위치에 따라 왼쪽 목차의 소제목 표시
  useEffect(() => {
    if (!active) return;
    const t = TOPICS[active - 1];
    const els = t.subs.map((_, k) => document.getElementById(subId(active, k))).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCur(Number((e.target as HTMLElement).dataset.k));
        });
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);

  return (
    <section id="location" ref={topRef} className="loc">
      <style>{CSS}</style>

      {active === 0 ? (
        /* ── 카드 4장 ── */
        <div className="loc-in loc-idx">
          <p className="loc-eb">LOCATION</p>
          <h2 className="loc-h2">입지분석</h2>
          <span className="loc-ln" aria-hidden="true" />
          <ul className="loc-cards">
            {TOPICS.map((t) => (
              <li key={t.n}>
                <button type="button" onClick={() => open(t.n)} aria-label={`${String(t.n).padStart(2, '0')} ${t.name} 자세히 보기`}>
                  <img src={t.card} alt="" loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
          <p className="loc-hint">카드를 누르면 자세한 입지 분석을 볼 수 있어요.</p>
        </div>
      ) : (
        /* ── 글 화면 ── */
        <>
          <nav className="loc-tabs" aria-label="입지분석 주제">
            {TOPICS.map((t) => (
              <button key={t.n} type="button" className={t.n === active ? 'on' : ''} onClick={() => open(t.n)}>
                <em>{String(t.n).padStart(2, '0')}</em>{t.tab}
              </button>
            ))}
          </nav>
          <div className="loc-in loc-pg">
            <aside className="loc-toc">
              <button type="button" className="loc-back" onClick={() => open(0)}>← 입지분석 전체</button>
              <p className="loc-eb">LOCATION</p>
              <p className="loc-tt">입지분석</p>
              <ol>
                {TOPICS.map((t) => (
                  <li key={t.n} className={t.n === active ? 'on' : ''}>
                    <button type="button" onClick={() => open(t.n)}>
                      <em>{String(t.n).padStart(2, '0')}</em>{t.name}
                    </button>
                    {t.n === active && (
                      <ul>
                        {t.subs.map((s, k) => (
                          <li key={s}>
                            <button type="button" className={k === cur ? 'cur' : ''} onClick={() => goSub(t.n, k)}>{s}</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
              <a className="loc-call" href={TEL}><small>입지가 궁금하시면</small><b>{PHONE}</b></a>
            </aside>

            <article className="loc-ar" key={active}>
              {active === 1 && <Article1 />}
              {active === 2 && <Article2 />}
              {active === 3 && <Article3 />}
              {active === 4 && <Article4 />}
              <button type="button" className="loc-next" onClick={() => open(active === 4 ? 1 : active + 1)}>
                <div>
                  <small>{active === 4 ? '처음으로' : '다음'}</small>
                  <b>{String(active === 4 ? 1 : active + 1).padStart(2, '0')} {TOPICS[active === 4 ? 0 : active].name}</b>
                </div>
                <span aria-hidden="true">→</span>
              </button>
            </article>
          </div>
        </>
      )}
    </section>
  );
}

/* ───── 공통 조각 ───── */
function Head({ kick, title, lead }: { kick: string; title: ReactNode; lead: ReactNode }) {
  return (
    <>
      <p className="loc-kick">{kick}</p>
      <h1 className="loc-h1">{title}</h1>
      <span className="loc-ln" aria-hidden="true" />
      <p className="loc-lead">{lead}</p>
    </>
  );
}
function H({ n, k, children, small }: { n: number; k: number; children: ReactNode; small?: boolean }) {
  return <h3 id={subId(n, k)} data-k={k} className={small ? 'loc-sm' : ''}>{children}</h3>;
}
function Facts({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <table className="loc-ft">
      <tbody>
        {rows.map(([a, b]) => (<tr key={a}><th scope="row">{a}</th><td>{b}</td></tr>))}
      </tbody>
    </table>
  );
}
function Tiles({ items, four }: { items: string[]; four?: boolean }) {
  return (
    <ul className={`loc-tiles${four ? ' four' : ''}`}>
      {items.map((x, i) => (<li key={x}><em>{String(i + 1).padStart(2, '0')}</em><b>{x}</b></li>))}
    </ul>
  );
}
function Photo({ src, alt, pos, cap }: { src: string; alt: string; pos?: string; cap: string }) {
  return (
    <figure className="loc-fig">
      <div><img src={src} alt={alt} loading="lazy" style={{ objectPosition: pos }} /></div>
      <figcaption>{cap}</figcaption>
    </figure>
  );
}
const nw = (t: string) => <span className="loc-nw">{t}</span>;

/* ───── 01 의료 ───── */
function Article1() {
  return (
    <>
      <Head kick="01 · 의료" title={<>수원덕산병원 통행로<br />1층 상가</>}
        lead="439병상 종합병원과 지역응급의료센터에 접한 1층 상가입니다. 환자·보호자·병원 종사자의 이동 동선이 상가 전면을 지납니다." />
      <H n={1} k={0} small>한눈에 보기</H>
      <Facts rows={[
        ['병원', '수원덕산병원 (종합병원)'],
        ['규모', <>439병상 <small>(1단계 운영)</small></>],
        ['응급의료', '지역응급의료센터 · 상가 바로 옆'],
        ['운영', '2025년 12월 진료 개시 · 2026년 3월 개원식'],
        ['상가 위치', '병원 통행로를 따라 이어지는 1층'],
      ]} />
      <Photo src="/photos/location/hospital.jpg" alt="수원덕산병원" pos="50% 50%" cap="수원덕산병원 · 지역응급의료센터" />
      <H n={1} k={1}>외래 환자·보호자 수요</H>
      <p>진료 대기, 검사 결과 대기, 처방 후 귀가 과정에서 {nw('식사·카페·편의')} 수요가 발생합니다.</p>
      <p>약사법상 의료기관 시설 안에는 약국을 개설할 수 없어, 처방 수요는 <strong>병원 밖 상가</strong>로 이어집니다.</p>
      <H n={1} k={2}>병원 종사자 수요</H>
      <p>종합병원은 의료진·간호·행정·지원 인력이 교대로 근무합니다. 출근·점심·퇴근 시간대에 <strong>환자 수와 관계없이 반복되는 고정 수요</strong>입니다.</p>
      <Photo src="/photos/street-11.jpg" alt="지역응급의료센터" pos="70% 60%" cap="상가 바로 옆 지역응급의료센터" />
      <H n={1} k={3}>24시간 운영 시설</H>
      <p>지역응급의료센터는 야간·주말에도 운영됩니다. 상가 주변 유동이 평일 주간에 한정되지 않습니다.</p>
    </>
  );
}

/* ───── 02 교통 ───── */
const BUSES = [
  { no: '7780', to: '사당역', route: '호매실동차고지 ↔ 사당역 · 직행좌석' },
  { no: '3003', to: '양재역 · 강남역', route: '서부공용차고지 ↔ 강남역 · 직행좌석' },
  { no: '1009', to: '잠실광역환승센터', route: '수원대학교 ↔ 잠실 · 직행좌석' },
];
function Article2() {
  return (
    <>
      <Head kick="02 · 교통" title={<>상가 앞 서울 직행버스,<br />한 정거장 거리의 수원역</>}
        lead={<>상가 앞 정류장에서 사당·강남·잠실로 가는 직행좌석버스를 탈 수 있습니다. 수인분당선 고색역에서 한 정거장이면 1호선·KTX가 서고 {nw('GTX-C')}가 들어올 수원역입니다.</>} />
      <H n={2} k={0} small>한눈에 보기</H>
      <Facts rows={[
        ['정류장', <>권선구청.한봄고.덕산병원 <small>(2097)</small></>],
        ['서울 직행', <>{nw('7780 사당')} · {nw('3003 강남')} · {nw('1009 잠실')}</>],
        ['지하철', <>수인분당선 고색역 <small>(약 1.3km)</small></>],
        ['광역 환승', <>수원역 <small>(고색역에서 1정거장)</small></>],
        ['GTX-C', '수원역 정차 · 2026년 9월 실착공'],
      ]} />
      <H n={2} k={1}>서울 직행버스</H>
      <p>상가 앞 정류장을 지나는 직행좌석버스 3개 노선이 서울 남부의 주요 환승역까지 바로 갑니다.</p>
      <ul className="loc-bus">
        {BUSES.map((b) => (
          <li key={b.no}><b>{b.no}</b><div><strong>{b.to}</strong><span>{b.route}</span></div></li>
        ))}
      </ul>
      <p className="loc-src">노선 정보는 2026년 11월 기준이며, 운행 노선과 정류장은 바뀔 수 있습니다.</p>
      <H n={2} k={2}>고색역 · 수원역</H>
      <p>고색역은 상가에서 약 1.3km 떨어진 수인분당선 역입니다. 다음 역이 <strong>수원역</strong>으로, 1호선·KTX로 바로 갈아탈 수 있습니다.</p>
      <div className="loc-line">
        <span className="st o">상가</span><i>약 1.3km</i><span className="st">고색역</span><i>수인분당선 1정거장</i>
        <span className="st n">수원역<small>1호선 · KTX · GTX-C 예정</small></span>
      </div>
      <H n={2} k={3}>GTX-C</H>
      <p>GTX-C는 경기 북부 덕정에서 서울 삼성을 거쳐 수원까지 잇는 광역급행철도로, 수원역에 정차합니다. 2024년 1월 착공식 이후 멈췄던 공사가 2026년 9월 실착공에 들어갔고, 수원역~삼성역은 약 25분으로 예상됩니다. 개통 시기는 아직 확정되지 않았습니다.</p>
      <p className="loc-src">출처: 경기신문(2026.9.15), 경기도 버스정보 노선 자료</p>
    </>
  );
}

/* ───── 03 R&D ───── */
function Article3() {
  return (
    <>
      <Head kick="03 · R&D·첨단산업" title={<>탑동 이노베이션밸리<br />첨단업무용지 앞 1층 상가</>}
        lead={<>수원도시공사가 조성하는 약 8만 평 규모의 첨단과학 혁신클러스터입니다. {nw('반도체·바이오·AI')} 등 첨단산업 기업과 연구시설이 들어오는 R&D 업무지구이며, 상가 바로 앞이 첨단업무용지 A2·A3 블록(약 1만 8천 평)입니다.</>} />
      <H n={3} k={0} small>한눈에 보기</H>
      <Facts rows={[
        ['사업명', '수원 탑동 이노베이션밸리'],
        ['성격', 'R&D·첨단산업 업무지구'],
        ['시행', <>수원도시공사 <small>(도시개발사업)</small></>],
        ['전체 면적', <>267,861㎡ <small>(약 8만 평)</small></>],
        ['첨단업무용지', <>105,191㎡ <small>(A1·A2·A3)</small></>],
        ['상가 앞 블록', <>A2·A3 · 62,183㎡ <small>(약 18,810평)</small></>],
      ]} />
      <H n={3} k={1}>들어오는 산업</H>
      <p>공급계획상 유치 업종입니다. 기업 사무실과 연구시설, 소프트웨어·벤처기업 시설이 들어설 수 있습니다.</p>
      <Tiles items={['스마트·반도체', 'IT·소프트웨어', '바이오·메디컬', 'IoT·로봇', '미래차·에너지', 'AI 등 첨단산업']} />
      <p className="loc-src">출처: 수원도시공사 탑동 이노베이션밸리 공급 카탈로그(2026.02) 토지이용계획 · 유치업종</p>
      <figure className="loc-fig loc-svg">
        <div>
          <svg viewBox="350 385 470 430" role="img" aria-label="탑동 이노베이션밸리 A2·A3 블록과 e편한세상 시티 고색 위치">
            <rect x="350" y="385" width="470" height="430" fill="#F6F4EF" />
            <rect x="418" y="340" width="187" height="52" fill="#E2DFD8" />
            <rect x="410" y="398" width="195" height="52" fill="#DCE5D2" />
            <text x="507" y="430" textAnchor="middle" className="g">공원</text>
            <path d="M625 385H795V470H625Z M625 478H795V560L745 565L660 552L625 515Z" fill="#E2DFD8" />
            <text x="710" y="475" textAnchor="middle" className="g">복합업무</text>
            <path d="M413 456H605V520L660 575L598 637L413 464Z" fill="#0F1C3A" />
            <path d="M660 575L740 600V768L598 637Z" fill="#0F1C3A" />
            <text x="520" y="520" textAnchor="middle" className="w">A2</text>
            <text x="520" y="542" textAnchor="middle" className="ws">11,754평</text>
            <text x="684" y="660" textAnchor="middle" className="w">A3</text>
            <text x="684" y="682" textAnchor="middle" className="ws">7,056평</text>
            <line x1="362" y1="433" x2="770" y2="815" stroke="#CFCBC2" strokeWidth="20" />
            <path d="M530 620L686 766L646 808L490 662Z" fill="#FF671D" />
            <text x="372" y="700" className="o">e편한세상 시티 고색</text>
            <text x="372" y="722" className="os">1층 상가</text>
          </svg>
        </div>
        <figcaption>수원도시공사 공급 카탈로그(2026.02) 토지이용계획도를 단순화한 그림 · 실제 경계와 다를 수 있습니다.</figcaption>
      </figure>
      <H n={3} k={2}>상가 앞 A2·A3 블록</H>
      <p>A2(38,856㎡, 11,754평)와 A3(23,327㎡, 7,056평)가 상가 전면 도로 건너편에 맞닿아 있습니다. 첨단업무용지는 첨단산업 기업이 입주하는 업무 부지입니다.</p>
      <Photo src="/photos/location/tapdong-site.jpg" alt="오피스텔에서 내려다본 탑동 이노베이션밸리 부지" pos="50% 50%" cap="e편한세상 시티 고색 오피스텔에서 내려다본 탑동 이노베이션밸리 부지" />
      <H n={3} k={3}>단지 안 상업시설 제한</H>
      <p>인허가 고시문상 첨단업무용지의 근린생활시설 등 지원시설은 <strong>건축물 연면적의 30% 이하</strong>(공모 분양 기준)로 제한되고, 기숙사·오피스텔을 제외하면 <strong>지상 2층 이하</strong>에만 들어설 수 있습니다.</p>
      <p>단지 안에서 채우지 못하는 식사·카페·모임 수요는 걸어서 닿는 인접 상가가 받게 됩니다.</p>
      <H n={3} k={4}>진행 단계</H>
      <p>현재 첨단업무용지는 특별설계 시행자 공모 방식으로 공급되고 있습니다. 기업 입주 시기는 공모와 건축 일정에 따라 정해집니다.</p>
    </>
  );
}

/* ───── 04 행정 ───── */
function Article4() {
  return (
    <>
      <Head kick="04 · 행정" title={<>권선구청·경찰서가 모인<br />서수원 행정타운 앞</>}
        lead="상가에서 서부로를 건너면 권선구청, 수원권선경찰서, 권선구보건소, 서수원우체국이 한 블록에 모여 있습니다. 민원인과 공공기관 근무자가 평일 낮에 꾸준히 오가는 곳입니다." />
      <H n={4} k={0} small>한눈에 보기</H>
      <Tiles four items={['권선구청', '수원권선경찰서', '권선구보건소', '서수원우체국']} />
      <H n={4} k={1}>위치</H>
      <p>행정타운은 수원덕산병원 맞은편, 서부로 건너편 한 블록입니다. 상가에서 걸어서 닿는 거리입니다.</p>
      <figure className="loc-fig loc-map">
        <a href="/photos/location/admin-map.jpg" target="_blank" rel="noopener noreferrer" aria-label="지도 크게 보기">
          <picture>
            <source media="(max-width:767px)" srcSet="/photos/location/admin-map-m.jpg" />
            <img src="/photos/location/admin-map.jpg" alt="서수원 행정타운과 e편한세상 시티 고색 상가 위치 지도" loading="lazy" />
          </picture>
        </a>
        <figcaption>지도: 카카오맵 · 행정타운과 상가 위치 표시<span className="loc-mo"> · 누르면 크게 보기</span></figcaption>
      </figure>
      <H n={4} k={2}>평일 낮 수요</H>
      <p>구청·경찰서·보건소·우체국은 평일 낮에 민원 방문과 근무 인원이 몰리는 시설입니다. 점심 식사·카페 수요가 <strong>평일에 꾸준히 반복</strong>됩니다.</p>
      <p>병원(01), 탑동 업무지구(03)와 함께 상가 주변의 평일 낮 수요를 받칩니다.</p>
    </>
  );
}

const CSS = `
.loc{background:#fff;color:#1C1C1E;scroll-margin-top:72px}
.loc button{font:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;color:inherit;text-align:left}
.loc-in{max-width:1280px;margin:0 auto;padding:96px 40px 110px}
.loc-eb{margin:0;font-size:12px;font-weight:700;letter-spacing:3px;color:#71717A}
.loc-h2{margin:12px 0 0;font-size:36px;font-weight:800;letter-spacing:-1.2px;line-height:1.2;color:#0F1C3A}
.loc-ln{display:block;width:56px;height:3px;background:#FF671D;margin-top:20px}
.loc-nw{white-space:nowrap}

/* 카드 4장 (카드뉴스 표지 이미지) */
.loc-cards{list-style:none;margin:48px 0 0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.loc-cards button{display:block;width:100%;aspect-ratio:1/1;border-radius:6px;overflow:hidden;background:#E7E5E4;transition:transform .3s ease,box-shadow .3s ease}
.loc-cards img{display:block;width:100%;height:100%;object-fit:cover}
.loc-cards button:hover,.loc-cards button:focus-visible{transform:translateY(-4px);box-shadow:0 16px 36px -14px rgba(15,28,58,.35)}
.loc-hint{margin:24px 0 0;text-align:center;font-size:14px;color:#71717A}

/* 글 화면 */
.loc-pg{display:grid;grid-template-columns:260px minmax(0,1fr);gap:80px;padding-top:72px}
.loc-tabs{display:none}
.loc-toc{position:sticky;top:110px;align-self:start}
.loc-back{font-size:14px !important;font-weight:600;color:#71717A !important;margin-bottom:22px !important;display:block}
.loc-back:hover{color:#0F1C3A !important}
.loc-tt{margin:10px 0 0;font-size:24px;font-weight:800;letter-spacing:-.8px;color:#0F1C3A}
.loc-toc ol{list-style:none;margin:28px 0 0;padding:0;border-top:2px solid #0F1C3A}
.loc-toc ol>li{border-bottom:1px solid #E7E5E4}
.loc-toc ol>li>button{width:100%;display:flex;gap:14px;align-items:baseline;padding:16px 4px;font-size:16px;font-weight:600;color:#71717A}
.loc-toc ol>li>button em{font-style:normal;font-size:13px;font-weight:700;color:#A1A1AA;letter-spacing:.5px;width:20px}
.loc-toc ol>li.on>button{color:#0F1C3A;font-weight:800}
.loc-toc ol>li.on>button em{color:#D24A0E}
.loc-toc ol>li>button:hover{color:#0F1C3A}
.loc-toc ul{list-style:none;margin:-4px 0 0;padding:0 0 14px 38px}
.loc-toc ul button{display:block;padding:5px 0;font-size:14px;color:#71717A;line-height:1.45}
.loc-toc ul button.cur,.loc-toc ul button:hover{color:#0F1C3A;font-weight:700}
.loc-call{margin-top:28px;display:block;padding:20px;background:#F6F4EF;border-radius:6px;text-decoration:none}
.loc-call small{display:block;font-size:13px;color:#52525B}
.loc-call b{display:block;margin-top:4px;font-size:22px;font-weight:800;color:#0F1C3A;letter-spacing:-.3px}

.loc-ar{max-width:720px;min-width:0}
.loc-kick{margin:0;font-size:14px;font-weight:700;color:#D24A0E;letter-spacing:.5px}
.loc-h1{margin:14px 0 0;font-size:44px;font-weight:800;line-height:1.22;letter-spacing:-1.8px;color:#0F1C3A}
.loc-ar .loc-ln{margin-top:28px}
.loc-lead{margin:32px 0 0 !important;font-size:20px !important;line-height:1.75 !important;letter-spacing:-.4px;color:#27272A !important}
.loc-ar h3{margin:52px 0 0;font-size:26px;font-weight:800;letter-spacing:-1px;line-height:1.35;color:#0F1C3A;scroll-margin-top:96px}
.loc-ar h3.loc-sm{margin-top:48px;font-size:15px;font-weight:700;letter-spacing:0;color:#71717A}
.loc-ar p{margin:18px 0 0;font-size:17px;line-height:1.85;letter-spacing:-.3px;color:#3F3F46;word-break:keep-all}
.loc-ar p strong{color:#0F1C3A;font-weight:700}
.loc-ar p.loc-src{margin-top:10px;font-size:12px;color:#A1A1AA;line-height:1.5}

.loc-ft{width:100%;margin-top:14px;border-collapse:collapse;border-top:2px solid #0F1C3A}
.loc-ft th,.loc-ft td{text-align:left;vertical-align:top;border-bottom:1px solid #E7E5E4;padding:14px 18px;line-height:1.5}
.loc-ft th{width:120px;background:#F6F4EF;font-size:14px;font-weight:700;color:#0F1C3A;padding-top:15px;word-break:keep-all}
.loc-ft td{font-size:16px;font-weight:500}
.loc-ft td small{color:#71717A;font-size:14px;font-weight:400}

.loc-fig{margin:48px 0 0}
.loc-fig>div{border-radius:6px;overflow:hidden;aspect-ratio:16/9;background:#E7E5E4}
.loc-fig img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.9) contrast(1.03) sepia(.07)}
.loc-fig figcaption{margin-top:10px;font-size:13px;color:#A1A1AA}
.loc-svg>div{aspect-ratio:auto;background:#F6F4EF}
.loc-svg svg{display:block;width:100%;height:auto;max-height:560px}
.loc-svg .g{font-size:12px;fill:#71717A;font-weight:600}
.loc-svg .w{font-size:20px;fill:#fff;font-weight:800}
.loc-svg .ws{font-size:13px;fill:rgba(255,255,255,.8);font-weight:600}
.loc-svg .o{font-size:14px;fill:#D24A0E;font-weight:800}
.loc-svg .os{font-size:12px;fill:#52525B;font-weight:600}
.loc-map a{display:block;border-radius:6px;overflow:hidden}
.loc-map img{height:auto;filter:none}
.loc-mo{display:none}

.loc-tiles{list-style:none;margin:22px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#E7E5E4;border-top:2px solid #0F1C3A;border-bottom:1px solid #E7E5E4}
.loc-tiles.four{grid-template-columns:repeat(4,1fr);margin-top:14px}
.loc-tiles li{background:#fff;padding:22px 20px;display:flex;flex-direction:column;gap:8px}
.loc-tiles em{font-style:normal;font-size:12px;font-weight:700;color:#D24A0E;letter-spacing:.5px}
.loc-tiles b{font-size:18px;font-weight:800;color:#0F1C3A;letter-spacing:-.5px}

.loc-bus{list-style:none;margin:20px 0 0;padding:0;border-top:2px solid #0F1C3A}
.loc-bus li{display:flex;align-items:center;gap:22px;padding:18px 4px;border-bottom:1px solid #E7E5E4}
.loc-bus b{flex:none;width:76px;height:40px;border-radius:6px;background:#0F1C3A;color:#fff;font-size:19px;font-weight:800;display:flex;align-items:center;justify-content:center}
.loc-bus strong{display:block;font-size:18px;font-weight:800;color:#0F1C3A;letter-spacing:-.4px}
.loc-bus span{display:block;margin-top:2px;font-size:14px;color:#71717A}

.loc-line{margin-top:24px;display:flex;align-items:center;padding:26px 24px;background:#F6F4EF;border-radius:6px}
.loc-line .st{font-size:16px;font-weight:800;color:#0F1C3A;padding:8px 14px;border:1.5px solid #0F1C3A;border-radius:999px;background:#fff;white-space:nowrap}
.loc-line .st.o{border-color:#FF671D;color:#D24A0E}
.loc-line .st.n{background:#0F1C3A;color:#fff;display:flex;flex-direction:column;align-items:center;border-radius:6px;padding:8px 16px}
.loc-line .st small{font-size:12px;font-weight:600;color:rgba(255,255,255,.75);margin-top:2px}
.loc-line i{flex:1;min-width:90px;font-style:normal;font-size:12px;color:#71717A;text-align:center;position:relative;padding:0 8px 10px}
.loc-line i:after{content:'';position:absolute;left:8px;right:8px;bottom:0;border-bottom:2px dashed #A1A1AA}

.loc-next{margin-top:80px !important;width:100%;display:flex !important;justify-content:space-between;align-items:center;padding:28px 0 !important;border-top:2px solid #0F1C3A !important;border-bottom:1px solid #E7E5E4 !important}
.loc-next small{display:block;font-size:13px;color:#71717A}
.loc-next b{display:block;margin-top:6px;font-size:22px;font-weight:800;color:#0F1C3A;letter-spacing:-.6px}
.loc-next>span{width:44px;height:44px;border-radius:50%;background:#1C1C1E;color:#fff;display:flex;align-items:center;justify-content:center;transition:transform .25s ease}
.loc-next:hover>span{transform:translateX(4px)}

.loc button:focus-visible,.loc a:focus-visible{outline:3px solid #FF671D;outline-offset:3px;border-radius:4px}

@media (max-width:1023px){
  .loc-cards{grid-template-columns:1fr 1fr}
  .loc-pg{display:block;padding:0 0 80px}
  .loc-toc{display:none}
  .loc-tabs{display:flex;position:sticky;top:65px;z-index:4;background:#fff;border-bottom:1px solid #E7E5E4;overflow-x:auto;scrollbar-width:none;padding:0 12px}
  .loc-tabs::-webkit-scrollbar{display:none}
  .loc-tabs button{flex:none;padding:15px 10px 13px;font-size:15px;font-weight:600;color:#71717A;white-space:nowrap;border-bottom:2px solid transparent}
  .loc-tabs button em{font-style:normal;font-size:12px;font-weight:700;margin-right:5px;color:#A1A1AA}
  .loc-tabs button.on{color:#0F1C3A;font-weight:800;border-color:#0F1C3A}
  .loc-tabs button.on em{color:#D24A0E}
  .loc-ar{padding:36px 20px 0;max-width:none}
  .loc-ar h3{scroll-margin-top:130px}
}
@media (max-width:767px){
  .loc-in.loc-idx{padding:56px 20px 72px}
  .loc-h2{font-size:28px}
  .loc-cards{grid-template-columns:1fr 1fr;gap:10px;margin-top:32px}
  .loc-hint{font-size:13px;margin-top:18px}
  .loc-h1{font-size:30px;letter-spacing:-1.2px}
  .loc-ar .loc-ln{margin-top:22px}
  .loc-lead{font-size:17px !important;margin-top:24px !important}
  .loc-ar h3{margin-top:44px;font-size:21px}
  .loc-ar p{font-size:16px;line-height:1.8}
  .loc-ft th{width:100px;padding:13px 10px 12px;font-size:13px}
  .loc-ft td{padding:12px 14px;font-size:15px}
  .loc-fig{margin:36px -20px 0}
  .loc-fig>div{border-radius:0;aspect-ratio:4/3}
  .loc-fig figcaption{padding:0 20px}
  .loc-svg>div{aspect-ratio:auto}
  .loc-map a{border-radius:0}
  .loc-mo{display:inline}
  .loc-tiles{grid-template-columns:1fr 1fr}
  .loc-tiles.four{grid-template-columns:1fr 1fr}
  .loc-tiles li{padding:16px 14px}
  .loc-tiles b{font-size:16px}
  .loc-bus li{gap:14px}
  .loc-bus b{width:62px;height:36px;font-size:16px}
  .loc-bus strong{font-size:16px}
  .loc-line{flex-direction:column;align-items:flex-start;padding:22px 20px}
  .loc-line i{min-width:0;padding:10px 0 10px 18px;text-align:left}
  .loc-line i:after{left:6px;right:auto;top:0;bottom:0;border-bottom:0;border-left:2px dashed #A1A1AA}
  .loc-next{margin-top:64px !important}
}
@media (prefers-reduced-motion:reduce){.loc-next>span,.loc-cards button{transition:none}.loc-cards button:hover{transform:none}}
`;
