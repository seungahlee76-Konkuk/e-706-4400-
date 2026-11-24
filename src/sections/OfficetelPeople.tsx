import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ───────── 오피스텔 · 누가 사나요 (상가 입지분석과 같은 틀: 카드 5장 → 누르면 왼쪽 목차 + 글) ─────────
   글 내용은 아래 PEOPLE 과 각 Article 함수 안의 문장만 고치면 됩니다.
   카드의 인물 그림은 연출 이미지이며, 카드 아래에 "인물: 연출 이미지"를 표시합니다.
   이미지 파일은 public/photos/officetel/ 에 사용자가 직접 올립니다. */

type Person = { n: number; tab: string; name: string; line: string; pic: string; subs: string[] };

const PEOPLE: Person[] = [
  { n: 1, tab: '델타플렉스', name: '수원델타플렉스 직장인', line: '같은 고색동, 출근길이 짧은 3룸', pic: '/photos/officetel/people/p1.webp', subs: ['한눈에 보기', '짧은 출근길', '퇴근 후 저녁'] },
  { n: 2, tab: '의료진', name: '수원덕산병원 의료진', line: '교대근무 끝나고 바로 집', pic: '/photos/officetel/people/p2.webp', subs: ['한눈에 보기', '교대근무와 집', '출근 전 아침'] },
  { n: 3, tab: '삼성전자', name: '삼성전자 반도체·전자 통근자', line: '기흥·수원·화성 사업장으로 출근', pic: '/photos/officetel/people/p3.webp', subs: ['한눈에 보기', '세 사업장 위치', '수원역까지', '수원역에서 통근버스', '차로 출근한다면'] },
  { n: 4, tab: '신혼부부', name: '신혼부부', line: '아파트처럼 사는 84㎡ 3룸', pic: '/photos/officetel/people/p5.webp', subs: ['한눈에 보기', '84㎡ 방 3개', '청약 자격', '단지 안 커뮤니티'] },
  { n: 5, tab: '가족', name: '어르신·가족', line: '종합병원 바로 옆 새 집', pic: '/photos/officetel/people/p6.webp', subs: ['한눈에 보기', '병원이 가까운 집', '1층에서 해결하기'] },
];
const LAST = PEOPLE.length;

const PHONE = '031)293-1073';
const TEL = 'tel:031-293-1073';
const subId = (n: number, k: number) => `ppl${n}-${k}`;

export default function OfficetelPeople() {
  const [active, setActive] = useState<number>(0); // 0 = 카드 목록, 1~5 = 글
  const [cur, setCur] = useState<number>(0);
  const topRef = useRef<HTMLElement>(null);

  // 주소 끝이 #people-2 처럼 들어오면 그 글을 바로 엽니다
  useEffect(() => {
    const m = window.location.hash.match(/^#people-([1-5])$/);
    if (m) {
      setActive(Number(m[1]));
      setTimeout(() => topRef.current?.scrollIntoView({ block: 'start' }), 50);
    }
  }, []);

  const open = (n: number) => {
    setActive(n);
    setCur(0);
    try { history.replaceState(null, '', n ? `#people-${n}` : '#people'); } catch { /* 무시 */ }
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const goSub = (n: number, k: number) => {
    document.getElementById(subId(n, k))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!active) return;
    const t = PEOPLE[active - 1];
    const els = t.subs.map((_, k) => document.getElementById(subId(active, k))).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setCur(Number((e.target as HTMLElement).dataset.k)); }),
      { rootMargin: '-30% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);

  const next = active === LAST ? 1 : active + 1;

  return (
    <section id="people" ref={topRef} className="ppl">
      <style>{CSS}</style>

      {active === 0 ? (
        /* ── 사람 카드 5장 ── */
        <div className="ppl-in ppl-idx">
          <p className="ppl-eb">WHO LIVES HERE</p>
          <h2 className="ppl-h2">누가 사나요</h2>
          <span className="ppl-ln" aria-hidden="true" />
          <ul className="ppl-cards">
            {PEOPLE.map((p) => (
              <li key={p.n}>
                <button type="button" onClick={() => open(p.n)} aria-label={`${String(p.n).padStart(2, '0')} ${p.name} 자세히 보기`}>
                  <span className="ppl-pic"><img src={p.pic} alt="" loading="lazy" /></span>
                  <span className="ppl-cap">
                    <em>{String(p.n).padStart(2, '0')}</em>
                    <b>{p.name}</b>
                    <span>{p.line}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="ppl-hint">카드를 누르면 왜 이곳을 고르는지 볼 수 있어요.<small>인물: 연출 이미지</small></p>
        </div>
      ) : (
        /* ── 글 화면 ── */
        <>
          <nav className="ppl-tabs" aria-label="누가 사나요 목록">
            {PEOPLE.map((p) => (
              <button key={p.n} type="button" className={p.n === active ? 'on' : ''} onClick={() => open(p.n)}>
                <em>{String(p.n).padStart(2, '0')}</em>{p.tab}
              </button>
            ))}
          </nav>
          <div className="ppl-in ppl-pg">
            <aside className="ppl-toc">
              <button type="button" className="ppl-back" onClick={() => open(0)}>← 누가 사나요 전체</button>
              <p className="ppl-eb">WHO LIVES HERE</p>
              <p className="ppl-tt">누가 사나요</p>
              <ol>
                {PEOPLE.map((p) => (
                  <li key={p.n} className={p.n === active ? 'on' : ''}>
                    <button type="button" onClick={() => open(p.n)}>
                      <em>{String(p.n).padStart(2, '0')}</em>{p.name}
                    </button>
                    {p.n === active && (
                      <ul>
                        {p.subs.map((s, k) => (
                          <li key={s}>
                            <button type="button" className={k === cur ? 'cur' : ''} onClick={() => goSub(p.n, k)}>{s}</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
              <a className="ppl-call" href={TEL}><small>내 출퇴근길에 맞는지 궁금하시면</small><b>{PHONE}</b></a>
            </aside>

            <article className="ppl-ar" key={active}>
              {active === 1 && <Article1 />}
              {active === 2 && <Article2 />}
              {active === 3 && <Article3 />}
              {active === 4 && <Article4 />}
              {active === 5 && <Article5 />}
              <button type="button" className="ppl-next" onClick={() => open(next)}>
                <div>
                  <small>{active === LAST ? '처음으로' : '다음'}</small>
                  <b>{String(next).padStart(2, '0')} {PEOPLE[next - 1].name}</b>
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
function Head({ n, kick, title, lead }: { n: number; kick: string; title: ReactNode; lead: ReactNode }) {
  return (
    <>
      <p className="ppl-kick">{kick}</p>
      <h1 className="ppl-h1">{title}</h1>
      <span className="ppl-ln" aria-hidden="true" />
      <p className="ppl-lead">{lead}</p>
      <div className="ppl-who"><img src={PEOPLE[n - 1].pic} alt="" /><small>인물: 연출 이미지</small></div>
    </>
  );
}
function H({ n, k, children, small }: { n: number; k: number; children: ReactNode; small?: boolean }) {
  return <h3 id={subId(n, k)} data-k={k} className={small ? 'ppl-sm' : ''}>{children}</h3>;
}
function Facts({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <table className="ppl-ft">
      <tbody>
        {rows.map(([a, b]) => (<tr key={a}><th scope="row">{a}</th><td>{b}</td></tr>))}
      </tbody>
    </table>
  );
}
function Tiles({ items }: { items: string[] }) {
  return (
    <ul className="ppl-tiles">
      {items.map((x, i) => (<li key={x}><em>{String(i + 1).padStart(2, '0')}</em><b>{x}</b></li>))}
    </ul>
  );
}
function Photo({ src, alt, pos, cap, tall }: { src: string; alt: string; pos?: string; cap: string; tall?: boolean }) {
  return (
    <figure className={`ppl-fig${tall ? ' tall' : ''}`}>
      <div><img src={src} alt={alt} loading="lazy" style={{ objectPosition: pos }} /></div>
      <figcaption>{cap}</figcaption>
    </figure>
  );
}
function RoomTrio({ items, cap }: { items: { src: string; name: string; pos?: string }[]; cap: string }) {
  return (
    <figure className="ppl-figs">
      <div className="ppl-figs-grid">
        {items.map((item) => (
          <div key={item.name} className="ppl-figs-item">
            <div className="ppl-figs-img">
              <img src={item.src} alt={`${item.name} 실제 세대 사진`} loading="lazy" style={{ objectPosition: item.pos || '50% 50%' }} />
            </div>
            <span className="ppl-figs-name">{item.name}</span>
          </div>
        ))}
      </div>
      <figcaption>{cap}</figcaption>
    </figure>
  );
}
const nw = (t: string) => <span className="ppl-nw">{t}</span>;

/* ───── 01 수원델타플렉스 직장인 ───── */
function Article1() {
  return (
    <>
      <Head n={1} kick="01 · 직장인" title={<>출근길이 짧은<br />3룸 새 집</>}
        lead={<>수원델타플렉스는 단지와 같은 고색동에 있는 수원시 유일의 산업단지입니다. 일터 가까이에 {nw('84㎡ 새 집')}이 있으면 출근길이 짧아집니다.</>} />
      <H n={1} k={0} small>한눈에 보기</H>
      <Facts rows={[
        ['일터', '수원델타플렉스 (고색동 · 전기·전자·기계 업종)'],
        ['출근', '같은 고색동'],
        ['집', '전용 84㎡ · 방 3개'],
        ['퇴근 후', '1층 상가 식당·카페'],
      ]} />
      <H n={1} k={1}>짧은 출근길</H>
      <p>멀리서 통근버스나 차로 출근하는 분이 많습니다. 같은 동네에 살면 <strong>출퇴근에 쓰던 시간</strong>을 아낄 수 있습니다.</p>
      <H n={1} k={2}>퇴근 후 저녁</H>
      <p>퇴근하고 엘리베이터로 내려가면 1층에 칼국수·손만두, 죽집, 삼계탕·닭볶음탕·닭개장집, 카페가 있습니다. 저녁을 먹으러 멀리 갈 필요가 없습니다.</p>
    </>
  );
}

/* ───── 02 수원덕산병원 의료진 ───── */
function Article2() {
  return (
    <>
      <Head n={2} kick="02 · 의료진" title={<>교대근무 끝나고<br />바로 집</>}
        lead={<>수원덕산병원이 단지 바로 옆입니다. 밤 근무가 끝나도 {nw('몇 분이면')} 집입니다.</>} />
      <H n={2} k={0} small>한눈에 보기</H>
      <Facts rows={[
        ['일터', '수원덕산병원 (종합병원 · 지역응급의료센터)'],
        ['출근', '단지 바로 옆'],
        ['근무', '교대근무 · 야간 근무'],
        ['집', '전용 84㎡ · 방 3개'],
      ]} />
      <Photo src="/photos/officetel/hospital.jpg" alt="수원덕산병원" pos="50% 50%" cap="단지 바로 옆 수원덕산병원" />
      <H n={2} k={1}>교대근무와 집</H>
      <p>교대근무는 퇴근 시간이 일정하지 않습니다. 병원 옆에 살면 <strong>출퇴근에 쓰던 시간에 더 쉴 수</strong> 있습니다.</p>
      <H n={2} k={2}>출근 전 아침</H>
      <p>1층 카페는 평일 아침 7시, 죽집은 아침 8시 30분에 문을 엽니다. 출근하기 전에 단지 안에서 아침을 먹을 수 있습니다.</p>
      <p className="ppl-src">영업시간은 2026년 11월 매장 안내 기준이며 바뀔 수 있습니다.</p>
    </>
  );
}

/* ───── 03 삼성전자 반도체·전자 통근자 ───── */
// 개략 위치도 (위도·경도를 그림 좌표로 옮긴 것, 실제 거리·경로와 다를 수 있음)
const MAP_SITES = [
  { label: '삼성전자 수원', sub: '디지털시티', x: 387, y: 116 },
  { label: '삼성전자 기흥', sub: '캠퍼스', x: 555, y: 226 },
  { label: '삼성전자 화성', sub: '캠퍼스', x: 437, y: 329 },
];
function SamsungMap() {
  return (
    <figure className="ppl-map">
      <svg viewBox="0 0 680 400" role="img" aria-label="e편한세상 시티 고색과 삼성전자 수원·기흥·화성 사업장의 개략 위치도">
        <rect width="680" height="400" fill="#F6F4EF" />
        <g stroke="#E7E5E4" strokeWidth="1">
          <path d="M0 100H680M0 200H680M0 300H680M170 0V400M340 0V400M510 0V400" />
        </g>
        <g transform="translate(40 0)">
        {/* 수인분당선 고색역 → 수원역 */}
        <path d="M57 186 L205 80" stroke="#FF671D" strokeWidth="4" strokeLinecap="round" />
        <text x="139" y="148" textAnchor="middle" fontSize="16" fontWeight="700" fill="#D24A0E" transform="rotate(-35.6 139 148)">수인분당선 · 1정거장</text>
        {/* 수원역 */}
        <circle cx="205" cy="80" r="7" fill="#fff" stroke="#0F1C3A" strokeWidth="3" />
        <text x="205" y="62" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0F1C3A">수원역</text>
        <text x="205" y="102" textAnchor="middle" fontSize="16" fill="#52525B">통근버스 탑승</text>
        {/* 삼성전자 3곳 */}
        {MAP_SITES.map((m) => (
          <g key={m.label}>
            <rect x={m.x - 8} y={m.y - 8} width="16" height="16" rx="3" fill="#0F1C3A" />
            <text x={m.x} y={m.y - 20} textAnchor="middle" fontSize="20" fontWeight="800" fill="#0F1C3A">{m.label}</text>
            <text x={m.x} y={m.y + 32} textAnchor="middle" fontSize="16" fill="#52525B">{m.sub}</text>
          </g>
        ))}
        {/* 단지 */}
        <circle cx="57" cy="186" r="22" fill="#FF671D" opacity=".18" />
        <circle cx="57" cy="186" r="9" fill="#FF671D" stroke="#fff" strokeWidth="3" />
        <text x="57" y="226" textAnchor="middle" fontSize="20" fontWeight="800" fill="#D24A0E">e편한세상 시티 고색</text>
        </g>
        <text x="660" y="28" textAnchor="end" fontSize="14" fontWeight="700" fill="#A1A1AA">N ↑</text>
      </svg>
      <figcaption>개략 위치도 · 실제 거리와 경로는 다를 수 있습니다</figcaption>
    </figure>
  );
}

function Article3() {
  return (
    <>
      <Head n={3} kick="03 · 삼성전자" title={<>삼성전자 기흥·수원·화성,<br />수원역에서 출근</>}
        lead={<>기흥, 수원, 화성 사업장으로 출근하는 분들입니다. 통근버스는 {nw('수원역에서')} 타고, 단지에서 수원역까지는 버스나 수인분당선으로 갑니다.</>} />
      <H n={3} k={0} small>한눈에 보기</H>
      <Facts rows={[
        ['일터', '삼성전자 기흥 · 수원 · 화성'],
        ['수원역까지', <>상가 앞 버스 <small>(GS25 쪽)</small> · 고색역 수인분당선 1정거장</>],
        ['똑버스', '고색역 · 수원역 가까이(동남아파트)까지'],
        ['통근버스', '수원역에서 탑승'],
        ['집', '전용 84㎡ · 방 3개'],
      ]} />
      <H n={3} k={1}>세 사업장 위치</H>
      <p>삼성전자 수원, 기흥, 화성 사업장은 모두 수원 동쪽과 남동쪽에 있습니다. 단지는 그 서쪽, 수원역에서 한 정거장 떨어진 고색동입니다.</p>
      <SamsungMap />
      <H n={3} k={2}>수원역까지</H>
      <p>단지 1층 상가 앞 정류장에서 수원역으로 가는 버스를 탈 수 있습니다. 수인분당선 고색역의 다음 역이 <strong>수원역</strong>이라, 갈아타지 않고 바로 갑니다.</p>
      <div className="ppl-line">
        <span className="st o">상가 앞 정류장</span><i>버스</i>
        <span className="st n">수원역<small>1호선 · KTX</small></span>
      </div>
      <div className="ppl-line">
        <span className="st">고색역</span><i>수인분당선 1정거장</i>
        <span className="st n">수원역<small>1호선 · KTX · GTX-C 예정</small></span>
      </div>
      <p>고색역까지는 <strong>똑버스</strong>도 탈 수 있습니다. 앱이나 전화로 부르면 오는 버스입니다. 수원역 쪽으로는 동남아파트까지 가고, 거기서 수원역까지 걸어서 약 460m입니다.</p>
      <p className="ppl-src">똑버스 운행 구역과 시간은 바뀔 수 있습니다. 도보 거리는 지도 앱 기준입니다.</p>
      <H n={3} k={3}>수원역에서 통근버스</H>
      <p>삼성전자 통근버스는 수원역 10번 출구 일대에서 탑니다. 기흥·화성 방향과 수원사업장 방향 노선이 따로 있습니다.</p>
      <div className="ppl-line">
        <span className="st o">단지</span><i>버스 · 지하철</i>
        <span className="st n">수원역<small>통근버스 탑승</small></span>
      </div>
      <p className="ppl-src">통근버스 노선과 시간은 회사 사정에 따라 바뀔 수 있습니다. 임직원 통근버스 안내 기준이니, 이용 전에 회사 안내를 확인해 주세요.</p>
      <H n={3} k={4}>차로 출근한다면</H>
      <p>차로 출근하는 분은 지하 주차장을 쓰시면 됩니다. 지하 4층까지 <strong>608대</strong>를 세울 수 있습니다. <small>(근린생활시설 포함)</small></p>
      <Photo src="/photos/officetel/parking.jpg" alt="e편한세상 시티 고색 지하 주차장 입구" pos="50% 50%" cap="지하 주차장 입구 (실제 사진)" />
    </>
  );
}

/* ───── 04 신혼부부 ───── */
function Article4() {
  return (
    <>
      <Head n={4} kick="04 · 신혼부부" title={<>아파트처럼 사는<br />84㎡ 3룸</>}
        lead={<>전용 84㎡에 방 3개. 아파트 국민평형과 같은 크기의 새 집입니다. 오피스텔은 청약할 때 {nw('주택 수에 들어가지 않습니다.')}</>} />
      <H n={4} k={0} small>한눈에 보기</H>
      <Facts rows={[
        ['크기', <>전용 84㎡ <small>(약 25.6평)</small></>],
        ['구조', '방 3개'],
        ['기본 제공', '시스템에어컨 4대 · 김치냉장고'],
        ['청약', '오피스텔은 주택 수 미포함'],
      ]} />
      <H n={4} k={1}>84㎡ 방 3개</H>
      <p>침실, 아이 방, 서재로 쓸 수 있습니다. 아이가 생겨도 방이 모자라지 않습니다.</p>
      <RoomTrio
        items={[
          { src: '/photos/officetel/room1.jpg', name: '침실' },
          { src: '/photos/officetel/room2.jpg', name: '방2' },
          { src: '/photos/officetel/room3.jpg', name: '방3' },
        ]}
        cap="실제 세대 사진"
      />
      <H n={4} k={2}>청약 자격</H>
      <p>오피스텔은 아파트 청약에서 주택으로 세지 않습니다. 새 집에 살면서 <strong>무주택 청약 자격</strong>을 지킬 수 있습니다.</p>
      <p className="ppl-src">세금(취득세·양도세 등)에서는 쓰임에 따라 주택 수에 들어갈 수 있습니다. 상담 때 확인해 드립니다.</p>
      <H n={4} k={3}>단지 안 커뮤니티</H>
      <Tiles items={['피트니스', '스크린골프룸', '라운지카페', '실내놀이터', '개인오피스', '중앙 정원']} />
    </>
  );
}

/* ───── 05 어르신·가족 ───── */
function Article5() {
  return (
    <>
      <Head n={5} kick="05 · 어르신·가족" title={<>종합병원 바로 옆<br />새 집</>}
        lead={<>병원에 자주 가는 어르신과 가족에게는 {nw('병원이 가까운 것')}이 가장 중요합니다. 단지 바로 옆이 수원덕산병원입니다.</>} />
      <H n={5} k={0} small>한눈에 보기</H>
      <Facts rows={[
        ['병원', '수원덕산병원 · 단지 바로 옆'],
        ['응급', '지역응급의료센터'],
        ['집', '엘리베이터가 있는 새 건물 · 중앙 정원'],
        ['1층', '칼국수·손만두, 죽집, 삼계탕·닭볶음탕·닭개장집, 카페'],
      ]} />
      <H n={5} k={1}>병원이 가까운 집</H>
      <p>진료받으러 갈 때도, 급할 때도 병원이 <strong>바로 옆</strong>에 있습니다.</p>
      <Photo src="/photos/rooms/122-exit3.jpg" alt="단지 바로 옆 수원덕산병원 방면" pos="50% 50%" cap="단지 바로 옆 수원덕산병원 방면 (실제 촬영)" />
      <H n={5} k={2}>1층에서 해결하기</H>
      <p>1층에 본죽, 장호덕 칼국수·손만두, 우지커피, 메가커피가 있습니다. 멀리 나가지 않아도 식사와 커피를 1층에서 해결할 수 있습니다.</p>
    </>
  );
}

const CSS = `
.ppl{background:#fff;color:#1C1C1E;scroll-margin-top:72px}
.ppl button{font:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;color:inherit;text-align:left}
.ppl-in{max-width:1280px;margin:0 auto;padding:96px 40px 110px}
.ppl-eb{margin:0;font-size:12px;font-weight:700;letter-spacing:3px;color:#71717A}
.ppl-h2{margin:12px 0 0;font-size:36px;font-weight:800;letter-spacing:-1.2px;line-height:1.2;color:#0F1C3A}
.ppl-ln{display:block;width:56px;height:3px;background:#FF671D;margin-top:20px}
.ppl-nw{white-space:nowrap}

/* 사람 카드 5장 */
.ppl-map{margin:28px 0 0}
.ppl-map svg{display:block;width:100%;height:auto;border-radius:6px;border:1px solid #E7E5E4}
.ppl-map figcaption{margin-top:8px;font-size:12px;color:#A1A1AA}
.ppl-cards{list-style:none;margin:48px 0 0;padding:0;display:grid;grid-template-columns:repeat(6,1fr);gap:16px}
.ppl-cards li{grid-column:span 2}
.ppl-cards li:nth-child(4){grid-column:2/4}
.ppl-cards li:nth-child(5){grid-column:4/6}
.ppl-cards button{display:flex;width:100%;height:100%;flex-direction:column;border-radius:6px;overflow:hidden;background:#fff;border:1px solid #E7E5E4 !important;transition:transform .3s ease,box-shadow .3s ease}
.ppl-pic{position:relative;height:210px;background:#F6F4EF;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
.ppl-pic img{display:block;height:88%;width:auto;transform:translateY(2%)}
.ppl-cap{display:block;padding:18px 20px 20px;border-top:1px solid #E7E5E4}
.ppl-cap em{display:block;font-style:normal;font-size:12px;font-weight:700;letter-spacing:.5px;color:#D24A0E}
.ppl-cap b{display:block;margin-top:6px;font-size:19px;font-weight:800;letter-spacing:-.6px;color:#0F1C3A}
.ppl-cap span{display:block;margin-top:4px;font-size:15px;color:#52525B;letter-spacing:-.3px}
.ppl-cards button:hover,.ppl-cards button:focus-visible{transform:translateY(-4px);box-shadow:0 16px 36px -14px rgba(15,28,58,.35)}
.ppl-hint{margin:24px 0 0;text-align:center;font-size:14px;color:#71717A}
.ppl-hint small{display:block;margin-top:4px;font-size:12px;color:#A1A1AA}

/* 글 화면 */
.ppl-pg{display:grid;grid-template-columns:260px minmax(0,1fr);gap:80px;padding-top:72px}
.ppl-tabs{display:none}
.ppl-toc{position:sticky;top:110px;align-self:start}
.ppl-back{font-size:14px !important;font-weight:600;color:#71717A !important;margin-bottom:22px !important;display:block}
.ppl-back:hover{color:#0F1C3A !important}
.ppl-tt{margin:10px 0 0;font-size:24px;font-weight:800;letter-spacing:-.8px;color:#0F1C3A}
.ppl-toc ol{list-style:none;margin:28px 0 0;padding:0;border-top:2px solid #0F1C3A}
.ppl-toc ol>li{border-bottom:1px solid #E7E5E4}
.ppl-toc ol>li>button{width:100%;display:flex;gap:14px;align-items:baseline;padding:16px 4px;font-size:16px;font-weight:600;color:#71717A}
.ppl-toc ol>li>button em{font-style:normal;font-size:13px;font-weight:700;color:#A1A1AA;letter-spacing:.5px;width:20px}
.ppl-toc ol>li.on>button{color:#0F1C3A;font-weight:800}
.ppl-toc ol>li.on>button em{color:#D24A0E}
.ppl-toc ol>li>button:hover{color:#0F1C3A}
.ppl-toc ul{list-style:none;margin:-4px 0 0;padding:0 0 14px 38px}
.ppl-toc ul button{display:block;padding:5px 0;font-size:14px;color:#71717A;line-height:1.45}
.ppl-toc ul button.cur,.ppl-toc ul button:hover{color:#0F1C3A;font-weight:700}
.ppl-call{margin-top:28px;display:block;padding:20px;background:#F6F4EF;border-radius:6px;text-decoration:none}
.ppl-call small{display:block;font-size:13px;color:#52525B}
.ppl-call b{display:block;margin-top:4px;font-size:22px;font-weight:800;color:#0F1C3A;letter-spacing:-.3px}

.ppl-ar{max-width:720px;min-width:0}
.ppl-kick{margin:0;font-size:14px;font-weight:700;color:#D24A0E;letter-spacing:.5px}
.ppl-h1{margin:14px 0 0;font-size:44px;font-weight:800;line-height:1.22;letter-spacing:-1.8px;color:#0F1C3A}
.ppl-ar .ppl-ln{margin-top:28px}
.ppl-lead{margin:32px 0 0 !important;font-size:20px !important;line-height:1.75 !important;letter-spacing:-.4px;color:#27272A !important}
.ppl-ar h3{margin:52px 0 0;font-size:26px;font-weight:800;letter-spacing:-1px;line-height:1.35;color:#0F1C3A;scroll-margin-top:96px}
.ppl-ar h3.ppl-sm{margin-top:48px;font-size:15px;font-weight:700;letter-spacing:0;color:#71717A}
.ppl-ar p{margin:18px 0 0;font-size:17px;line-height:1.85;letter-spacing:-.3px;color:#3F3F46;word-break:keep-all}
.ppl-ar p strong{color:#0F1C3A;font-weight:700}
.ppl-ar p.ppl-src{margin-top:10px;font-size:12px;color:#A1A1AA;line-height:1.5}

.ppl-ft{width:100%;margin-top:14px;border-collapse:collapse;border-top:2px solid #0F1C3A}
.ppl-ft th,.ppl-ft td{text-align:left;vertical-align:top;border-bottom:1px solid #E7E5E4;padding:14px 18px;line-height:1.5}
.ppl-ft th{width:120px;background:#F6F4EF;font-size:14px;font-weight:700;color:#0F1C3A;padding-top:15px;word-break:keep-all}
.ppl-ft td{font-size:16px;font-weight:500}
.ppl-ft td small{color:#71717A;font-size:14px;font-weight:400}

.ppl-fig{margin:48px 0 0}
.ppl-fig>div{border-radius:6px;overflow:hidden;aspect-ratio:16/9;background:#E7E5E4}
.ppl-fig img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.9) contrast(1.03) sepia(.07)}
.ppl-fig.tall>div{aspect-ratio:3/4;max-width:420px}
.ppl-who{margin-top:30px;display:flex;align-items:flex-end;gap:16px}
.ppl-who img{height:120px;width:auto}
.ppl-who small{font-size:11px;color:#A1A1AA;padding-bottom:4px}
.ppl-fig figcaption{margin-top:10px;font-size:13px;color:#A1A1AA}
.ppl-figs{margin:40px 0 0}
.ppl-figs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.ppl-figs-item{min-width:0}
.ppl-figs-img{border-radius:6px;overflow:hidden;aspect-ratio:3/4;background:#E7E5E4}
.ppl-figs-img img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.9) contrast(1.03) sepia(.07)}
.ppl-figs-name{display:block;margin-top:8px;font-size:14px;font-weight:700;color:#0F1C3A;letter-spacing:-.3px}
.ppl-figs figcaption{margin-top:10px;font-size:13px;color:#A1A1AA}
.ppl-svg>div{aspect-ratio:auto;background:#F6F4EF}
.ppl-svg svg{display:block;width:100%;height:auto;max-height:560px}
.ppl-svg .g{font-size:12px;fill:#71717A;font-weight:600}
.ppl-svg .w{font-size:20px;fill:#fff;font-weight:800}
.ppl-svg .ws{font-size:13px;fill:rgba(255,255,255,.8);font-weight:600}
.ppl-svg .o{font-size:14px;fill:#D24A0E;font-weight:800}
.ppl-svg .os{font-size:12px;fill:#52525B;font-weight:600}
.ppl-map a{display:block;border-radius:6px;overflow:hidden}
.ppl-map img{height:auto;filter:none}
.ppl-mo{display:none}

.ppl-tiles{list-style:none;margin:22px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#E7E5E4;border-top:2px solid #0F1C3A;border-bottom:1px solid #E7E5E4}
.ppl-tiles.four{grid-template-columns:repeat(4,1fr);margin-top:14px}
.ppl-tiles li{background:#fff;padding:22px 20px;display:flex;flex-direction:column;gap:8px}
.ppl-tiles em{font-style:normal;font-size:12px;font-weight:700;color:#D24A0E;letter-spacing:.5px}
.ppl-tiles b{font-size:18px;font-weight:800;color:#0F1C3A;letter-spacing:-.5px}

.ppl-bus{list-style:none;margin:20px 0 0;padding:0;border-top:2px solid #0F1C3A}
.ppl-bus li{display:flex;align-items:center;gap:22px;padding:18px 4px;border-bottom:1px solid #E7E5E4}
.ppl-bus b{flex:none;width:76px;height:40px;border-radius:6px;background:#0F1C3A;color:#fff;font-size:19px;font-weight:800;display:flex;align-items:center;justify-content:center}
.ppl-bus strong{display:block;font-size:18px;font-weight:800;color:#0F1C3A;letter-spacing:-.4px}
.ppl-bus span{display:block;margin-top:2px;font-size:14px;color:#71717A}

.ppl-line{margin-top:24px;display:flex;align-items:center;padding:26px 24px;background:#F6F4EF;border-radius:6px}
.ppl-line .st{font-size:16px;font-weight:800;color:#0F1C3A;padding:8px 14px;border:1.5px solid #0F1C3A;border-radius:999px;background:#fff;white-space:nowrap}
.ppl-line .st.o{border-color:#FF671D;color:#D24A0E}
.ppl-line .st.n{background:#0F1C3A;color:#fff;display:flex;flex-direction:column;align-items:center;border-radius:6px;padding:8px 16px}
.ppl-line .st small{font-size:12px;font-weight:600;color:rgba(255,255,255,.75);margin-top:2px}
.ppl-line+.ppl-line{margin-top:10px}
.ppl-line i{flex:1;min-width:90px;font-style:normal;font-size:12px;color:#71717A;text-align:center;position:relative;padding:0 8px 10px}
.ppl-line i:after{content:'';position:absolute;left:8px;right:8px;bottom:0;border-bottom:2px dashed #A1A1AA}

.ppl-next{margin-top:80px !important;width:100%;display:flex !important;justify-content:space-between;align-items:center;padding:28px 0 !important;border-top:2px solid #0F1C3A !important;border-bottom:1px solid #E7E5E4 !important}
.ppl-next small{display:block;font-size:13px;color:#71717A}
.ppl-next b{display:block;margin-top:6px;font-size:22px;font-weight:800;color:#0F1C3A;letter-spacing:-.6px}
.ppl-next>span{width:44px;height:44px;border-radius:50%;background:#1C1C1E;color:#fff;display:flex;align-items:center;justify-content:center;transition:transform .25s ease}
.ppl-next:hover>span{transform:translateX(4px)}

.ppl button:focus-visible,.ppl a:focus-visible{outline:3px solid #FF671D;outline-offset:3px;border-radius:4px}

@media (max-width:1023px){
  .ppl-cards{grid-template-columns:1fr 1fr}
  .ppl-cards li,.ppl-cards li:nth-child(4),.ppl-cards li:nth-child(5){grid-column:auto}
  .ppl-cards li:last-child{grid-column:1/-1;justify-self:center;width:calc(50% - 8px)}
  .ppl-pic{height:180px}
  .ppl-pg{display:block;padding:0 0 80px}
  .ppl-toc{display:none}
  .ppl-tabs{display:flex;position:sticky;top:65px;z-index:4;background:#fff;border-bottom:1px solid #E7E5E4;overflow-x:auto;scrollbar-width:none;padding:0 12px}
  .ppl-tabs::-webkit-scrollbar{display:none}
  .ppl-tabs button{flex:none;padding:15px 10px 13px;font-size:15px;font-weight:600;color:#71717A;white-space:nowrap;border-bottom:2px solid transparent}
  .ppl-tabs button em{font-style:normal;font-size:12px;font-weight:700;margin-right:5px;color:#A1A1AA}
  .ppl-tabs button.on{color:#0F1C3A;font-weight:800;border-color:#0F1C3A}
  .ppl-tabs button.on em{color:#D24A0E}
  .ppl-ar{padding:36px 20px 0;max-width:none}
  .ppl-ar h3{scroll-margin-top:130px}
}
@media (max-width:767px){
  .ppl-in.ppl-idx{padding:56px 20px 72px}
  .ppl-h2{font-size:28px}
  .ppl-cards{grid-template-columns:1fr 1fr;gap:10px;margin-top:32px}
  .ppl-cards li:last-child{width:calc(50% - 5px)}
  .ppl-pic{height:150px}
  .ppl-cap{padding:14px 14px 16px}
  .ppl-cap b{font-size:16px}
  .ppl-cap span{font-size:13px}
  .ppl-fig.tall{margin-left:0;margin-right:0}
  .ppl-fig.tall>div{border-radius:6px;aspect-ratio:3/4}
  .ppl-who img{height:96px}
  .ppl-hint{font-size:13px;margin-top:18px}
  .ppl-h1{font-size:30px;letter-spacing:-1.2px}
  .ppl-ar .ppl-ln{margin-top:22px}
  .ppl-lead{font-size:17px !important;margin-top:24px !important}
  .ppl-ar h3{margin-top:44px;font-size:21px}
  .ppl-ar p{font-size:16px;line-height:1.8}
  .ppl-ft th{width:100px;padding:13px 10px 12px;font-size:13px}
  .ppl-ft td{padding:12px 14px;font-size:15px}
  .ppl-fig{margin:36px -20px 0}
  .ppl-fig>div{border-radius:0;aspect-ratio:4/3}
  .ppl-fig figcaption{padding:0 20px}
  .ppl-figs{margin:32px 0 0}
  .ppl-figs-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
  .ppl-figs-name{margin-top:6px;font-size:12px}
  .ppl-svg>div{aspect-ratio:auto}
  .ppl-map a{border-radius:0}
  .ppl-mo{display:inline}
  .ppl-tiles{grid-template-columns:1fr 1fr}
  .ppl-tiles.four{grid-template-columns:1fr 1fr}
  .ppl-tiles li{padding:16px 14px}
  .ppl-tiles b{font-size:16px}
  .ppl-bus li{gap:14px}
  .ppl-bus b{width:62px;height:36px;font-size:16px}
  .ppl-bus strong{font-size:16px}
  .ppl-line{flex-direction:column;align-items:flex-start;padding:22px 20px}
  .ppl-line i{min-width:0;padding:10px 0 10px 18px;text-align:left}
  .ppl-line i:after{left:6px;right:auto;top:0;bottom:0;border-bottom:0;border-left:2px dashed #A1A1AA}
  .ppl-next{margin-top:64px !important}
}
@media (prefers-reduced-motion:reduce){.ppl-next>span,.ppl-cards button{transition:none}.ppl-cards button:hover{transform:none}}

/* 한 화면 꽉 채우기: 섹션 높이를 화면 높이(헤더 제외)에 맞추고 내용은 세로 가운데 → 푸터는 항상 화면 아래 */
.ppl:has(.ppl-idx){min-height:calc(100svh - 72px);display:flex;align-items:center}
.ppl-idx{width:100%}
/* 큰 화면(1600px 이상): 히어로와 같은 비율로 키움 */
@media (min-width:1600px){.ppl-idx{zoom:1.12}}
@media (min-width:1920px){.ppl-idx{zoom:1.3}}
@media (min-width:2300px){.ppl-idx{zoom:1.45}}
`;
