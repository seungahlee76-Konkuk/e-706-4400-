import { useState } from 'react';

/* ───────── 오피스텔 세대 안내 (/officetel/units) ─────────
   "아파트예요?"에 대한 답 → 공간 사진 → 타입별 평면도 → 커뮤니티 순서.
   내용을 바꿀 때는 아래 STATS, ROOMS, TYPES, COMMUNITY만 고치면 됩니다.
   이미지 파일은 public/photos/officetel/units/ 에 사용자가 직접 올립니다. */

const U = '/photos/officetel/units/';

// 첫 화면: 한 줄 답 + 숫자 4개
const STATS = [
  { big: '84㎡', label: '아파트 국민평형과 같은 크기', note: '전용 약 25.6평' },
  { big: '3', label: '방' },
  { big: '2', label: '욕실' },
  { big: '거실·주방', label: '아파트와 같은 구성', small: true },
];
const INCLUDED = '시스템에어컨 4대 · 김치냉장고';

// 공간 사진 (84A 견본주택)
const ROOMS = [
  { name: '거실', src: 'mh-living.jpg' },
  { name: '주방', src: 'mh-kitchen.jpg' },
  { name: '식당', src: 'mh-dining.jpg' },
  { name: '안방', src: 'mh-bed1.jpg' },
  { name: '침실', src: 'mh-bed2.jpg' },
  { name: '자녀방', src: 'mh-bed3.jpg' },
  { name: '욕실 1', src: 'mh-bath1.jpg' },
  { name: '욕실 2', src: 'mh-bath2.jpg' },
];
const ROOM_NOTE = `84A 견본주택 촬영 · 기본 제공은 ${INCLUDED}이며, 그 밖의 가구·가전은 연출입니다.`;

// 타입별 평면도 (배치도와 같은 색)
const TYPES = [
  { t: '84A', color: '#E09346', n: 302, area: '84.63', shape: '맞통풍 3BAY 판상형', mh: true,
    points: ['현관 1면 신발장', 'ㄱ자형 주방', '세탁기·건조기 나란히 놓는 구조', '침실2 붙박이장'] },
  { t: '84B', color: '#00B4BC', n: 89, area: '84.51', shape: '개방감 좋은 4BAY 판상형',
    points: ['현관 신발장 + 현관 팬트리', 'ㅡ자형 주방', '분리형 세탁실', '안방 화장대 + 드레스룸', '침실3 붙박이장'] },
  { t: '84C', color: '#8676B0', n: 26, area: '84.16', shape: '코너 탑상형',
    points: ['현관 1면 신발장', 'ㄱ자형 주방', '분리형 세탁실', '안방 화장대 + 드레스룸', '침실3 붙박이장'] },
  { t: '84D', color: '#EF5DA2', n: 13, area: '84.52', shape: '4BAY 판상형 · 주거약자형 세대',
    points: ['현관 1면 신발장', 'ㅡ자형 주방', '분리형 세탁실', '침실3 붙박이장'] },
];
const COMMON = '주방 상판·벽 엔지니어드 스톤 · 빌트인 김치냉장고 · 시스템에어컨';

// 커뮤니티 (지하 1층) — x, y 는 그림 위 번호 위치(%)
const COMMUNITY = [
  { name: '피트니스', x: 18.6, y: 31.8 },
  { name: '스크린골프룸', x: 37.3, y: 20.6 },
  { name: '라운지 카페', x: 28.3, y: 58.8 },
  { name: '실내놀이터', x: 67.3, y: 49.9 },
  { name: '개인용 오피스', x: 78.6, y: 58.1 },
  { name: '개인오피스 라운지', x: 73.2, y: 65.7 },
  { name: '멀티룸 · 주민회의실', x: 79.2, y: 74.2 },
  { name: '창고', x: 88.2, y: 65.7 },
];

// 커뮤니티 CG 이미지 (n = 위 번호와 같음)
const COMM_PICS = [
  { n: 1, name: '피트니스', src: 'comm-fitness.jpg' },
  { n: 2, name: '스크린골프룸', src: 'comm-golf.jpg' },
  { n: 3, name: '라운지 카페', src: 'comm-lounge.jpg' },
  { n: 4, name: '실내놀이터', src: 'comm-kids.jpg' },
  { n: 6, name: '개인오피스 라운지', src: 'comm-office.jpg' },
];

export default function OfficetelUnits() {
  const [room, setRoom] = useState(1);
  const [type, setType] = useState(0);
  const T = TYPES[type];

  return (
    <section id="units" className="unt scroll-mt-[72px]">
      <style>{CSS}</style>
      <div className="unt-in">
        {/* ── 1. 답부터 ── */}
        <p className="unt-eb">UNIT GUIDE</p>
        <h2 className="unt-tt">세대 안내</h2>
        <span className="unt-ln" aria-hidden="true" />

        <div className="unt-top">
          <figure className="unt-ph">
            <div><img src={U + ROOMS[0].src} alt="84A 견본주택 거실" /></div>
            <figcaption>84A 견본주택 거실 · 가구와 소품은 연출</figcaption>
          </figure>
          <div className="unt-ans">
            <p className="unt-q">아파트예요?</p>
            <h3 className="unt-a"><b>아파트처럼</b> 사는<br />오피스텔</h3>
            <ul className="unt-stats">
              {STATS.map((s) => (
                <li key={s.label}>
                  <b className={s.small ? 'sm' : ''}>{s.big}</b>
                  <span>{s.label}</span>
                  {s.note && <small>{s.note}</small>}
                </li>
              ))}
            </ul>
            <p className="unt-inc"><em>기본 제공</em>{INCLUDED}</p>
          </div>
        </div>

        {/* ── 2. 공간 둘러보기 ── */}
        <div className="unt-hd">
          <p className="unt-eb">ROOMS</p>
          <h3 className="unt-st">공간 둘러보기</h3>
        </div>
        <div className="unt-gal">
          <figure className="unt-big">
            <img key={room} src={U + ROOMS[room].src} alt={`84A 견본주택 ${ROOMS[room].name}`} loading="lazy" />
            <span className="unt-tag">{ROOMS[room].name}</span>
          </figure>
          <ul className="unt-thumbs" role="tablist" aria-label="공간 선택">
            {ROOMS.map((r, i) => (
              <li key={r.name}>
                <button type="button" role="tab" aria-selected={i === room} className={i === room ? 'on' : ''} onClick={() => setRoom(i)}>
                  <img src={U + r.src} alt="" loading="lazy" />
                  <span>{r.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="unt-note">{ROOM_NOTE}</p>

        {/* ── 3. 타입별 평면도 ── */}
        <div className="unt-hd">
          <p className="unt-eb">FLOOR PLAN</p>
          <h3 className="unt-st">타입별 평면도</h3>
        </div>
        <div className="unt-tabs" role="tablist" aria-label="타입 선택">
          {TYPES.map((x, i) => (
            <button key={x.t} type="button" role="tab" aria-selected={i === type} className={i === type ? 'on' : ''} onClick={() => setType(i)}>
              <i style={{ background: x.color }} aria-hidden="true" />{x.t}<small>{x.n}세대</small>
            </button>
          ))}
        </div>
        <div className="unt-plan">
          <figure>
            <a href={`${U}plan-${T.t}.jpg`} target="_blank" rel="noopener noreferrer" aria-label={`${T.t} 평면도 크게 보기`}>
              <img key={T.t} src={`${U}plan-${T.t}.jpg`} alt={`${T.t} 평면도`} loading="lazy" />
            </a>
          </figure>
          <div className="unt-info">
            <p className="unt-tn"><i style={{ background: T.color }} aria-hidden="true" />{T.t}{T.mh && <em>견본주택 타입</em>}</p>
            <p className="unt-shape">{T.shape}</p>
            <table>
              <tbody>
                <tr><th scope="row">전용면적</th><td>{T.area}㎡</td></tr>
                <tr><th scope="row">세대수</th><td>430세대 중 <b>{T.n}</b>세대</td></tr>
                <tr><th scope="row">구조</th><td>방 3 · 욕실 2 · 거실 · 주방/식당</td></tr>
              </tbody>
            </table>
            <ul className="unt-pts">{T.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <p className="unt-common"><em>모든 타입</em>{COMMON}</p>
          </div>
        </div>
        <p className="unt-note">평면도는 이해를 돕기 위한 그림으로 실제와 다를 수 있습니다. "붙박이장 별매"는 선택 품목입니다.<span className="unt-mo"> 평면도를 누르면 크게 볼 수 있어요.</span></p>

        {/* ── 4. 커뮤니티 ── */}
        <div className="unt-hd">
          <p className="unt-eb">COMMUNITY</p>
          <h3 className="unt-st">지하 1층 커뮤니티</h3>
        </div>
        <div className="unt-com">
          <figure>
            <img src={U + 'community.jpg'} alt="지하 1층 커뮤니티 시설 배치" loading="lazy" />
            {COMMUNITY.map((c, i) => (
              <span key={c.name} className="unt-pin" style={{ left: `${c.x}%`, top: `${c.y}%` }} aria-hidden="true">{i + 1}</span>
            ))}
          </figure>
          <ol>
            {COMMUNITY.map((c, i) => (<li key={c.name}><em>{i + 1}</em>{c.name}</li>))}
          </ol>
        </div>
        <ul className="unt-cpics">
          {COMM_PICS.map((c) => (
            <li key={c.n}>
              <img src={U + c.src} alt={`${c.name} 이미지`} loading="lazy" />
              <span><em>{c.n}</em>{c.name}</span>
            </li>
          ))}
        </ul>
        <p className="unt-note">커뮤니티 그림과 이미지는 이해를 돕기 위해 제작된 것으로 실제와 다소 차이가 있을 수 있으며, 관계 기관 및 법규 변동 등에 따라 달라질 수 있습니다.</p>
      </div>
    </section>
  );
}

const CSS = `
.unt{background:#fff;color:#1C1C1E}
.unt button{font:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;color:inherit;text-align:left}
.unt-in{max-width:1280px;margin:0 auto;padding:96px 40px 120px}
.unt-eb{margin:0;font-size:12px;font-weight:700;letter-spacing:3px;color:#71717A}
.unt-tt{margin:12px 0 0;font-size:36px;font-weight:800;letter-spacing:-1.2px;line-height:1.2;color:#0F1C3A}
.unt-ln{display:block;width:56px;height:3px;background:#FF671D;margin-top:20px}
.unt-hd{margin-top:104px}
.unt-st{margin:10px 0 0;font-size:26px;font-weight:800;letter-spacing:-1px;color:#0F1C3A}
.unt-note{margin:14px 0 0;font-size:12px;line-height:1.6;color:#A1A1AA;word-break:keep-all}
.unt-mo{display:none}
.unt-cpics{list-style:none;margin:20px 0 0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.unt-cpics li{margin:0}
.unt-cpics img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:6px;border:1px solid #E7E5E4}
.unt-cpics span{display:flex;align-items:center;gap:7px;margin-top:8px;font-size:13px;font-weight:700;color:#0F1C3A;letter-spacing:-.3px}
.unt-cpics em{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#0F1C3A;color:#fff;font-style:normal;font-size:11px}
@media (max-width:767px){.unt-cpics{grid-template-columns:repeat(2,1fr);gap:10px}.unt-cpics li:last-child{grid-column:1/-1}.unt-cpics li:last-child img{aspect-ratio:16/8}}
.unt img{filter:saturate(.95) contrast(1.02)}

/* 1. 답 */
.unt-top{margin-top:48px;display:grid;grid-template-columns:7fr 5fr;gap:56px;align-items:center}
.unt-ph{margin:0}
.unt-ph>div{border-radius:6px;overflow:hidden;aspect-ratio:4/3;background:#E7E5E4}
.unt-ph img{display:block;width:100%;height:100%;object-fit:cover}
.unt-ph figcaption{margin-top:10px;font-size:12px;color:#A1A1AA}
.unt-q{margin:0;font-size:16px;font-weight:700;color:#71717A}
.unt-a{margin:10px 0 0;font-size:44px;font-weight:800;line-height:1.2;letter-spacing:-1.8px;color:#0F1C3A}
.unt-a b{color:#D24A0E}
.unt-stats{list-style:none;margin:36px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;border-top:2px solid #0F1C3A}
.unt-stats li{padding:22px 4px 20px;border-bottom:1px solid #E7E5E4;display:flex;flex-direction:column}
.unt-stats li:nth-child(odd){padding-right:16px;border-right:1px solid #E7E5E4}
.unt-stats li:nth-child(even){padding-left:20px}
.unt-stats b{font-size:40px;font-weight:800;letter-spacing:-1.5px;line-height:1.05;color:#0F1C3A}
.unt-stats b.sm{font-size:26px;line-height:1.5;letter-spacing:-1px}
.unt-stats span{margin-top:8px;font-size:15px;font-weight:600;color:#3F3F46}
.unt-stats small{margin-top:2px;font-size:13px;color:#71717A}
.unt-inc{margin:20px 0 0;font-size:15px;color:#3F3F46}
.unt-inc em{font-style:normal;font-size:12px;font-weight:700;color:#D24A0E;border:1px solid #FF671D;border-radius:999px;padding:3px 9px;margin-right:10px}

/* 2. 공간 사진 */
.unt-gal{margin-top:32px;display:grid;grid-template-columns:1fr 280px;gap:16px}
.unt-big{position:relative;margin:0;border-radius:6px;overflow:hidden;aspect-ratio:4/3;background:#E7E5E4}
.unt-big img{display:block;width:100%;height:100%;object-fit:cover;animation:untFade .45s ease}
.unt-tag{position:absolute;left:16px;top:16px;padding:6px 12px;border-radius:6px;background:rgba(15,28,58,.82);color:#fff;font-size:14px;font-weight:700}
.unt-thumbs{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px;align-content:start}
.unt-thumbs button{display:block;width:100%;border-radius:6px;overflow:hidden;position:relative;outline-offset:2px}
.unt-thumbs img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;opacity:.75;transition:opacity .2s}
.unt-thumbs span{display:block;padding:6px 2px 0;font-size:13px;font-weight:600;color:#71717A}
.unt-thumbs button.on img,.unt-thumbs button:hover img{opacity:1}
.unt-thumbs button.on span{color:#0F1C3A;font-weight:800}
.unt-thumbs button.on:after{content:'';position:absolute;left:0;right:0;top:0;aspect-ratio:4/3;border:2px solid #FF671D;border-radius:6px;pointer-events:none}
@keyframes untFade{from{opacity:.3}to{opacity:1}}

/* 3. 평면도 */
.unt-tabs{margin-top:28px;display:flex;gap:8px;flex-wrap:wrap}
.unt-tabs button{display:flex;align-items:center;gap:8px;padding:12px 18px;border:1px solid #E7E5E4 !important;border-radius:6px;font-size:17px;font-weight:800;color:#71717A}
.unt-tabs button small{font-size:13px;font-weight:500;color:#A1A1AA}
.unt-tabs button i{width:10px;height:10px;border-radius:3px}
.unt-tabs button.on{border-color:#0F1C3A !important;background:#0F1C3A;color:#fff}
.unt-tabs button.on small{color:rgba(255,255,255,.7)}
.unt-plan{margin-top:20px;display:grid;grid-template-columns:7fr 5fr;gap:48px;align-items:start}
.unt-plan figure{margin:0;border:1px solid #E7E5E4;border-radius:6px;padding:20px;background:#fff}
.unt-plan figure a{display:block}
.unt-plan figure img{display:block;width:100%;height:auto;max-height:560px;object-fit:contain;filter:none;animation:untFade .35s ease}
.unt-tn{margin:0;display:flex;align-items:center;gap:10px;font-size:32px;font-weight:800;letter-spacing:-1px;color:#0F1C3A}
.unt-tn i{width:14px;height:14px;border-radius:4px}
.unt-tn em{font-style:normal;font-size:12px;font-weight:700;color:#D24A0E;border:1px solid #FF671D;border-radius:999px;padding:3px 9px;letter-spacing:0}
.unt-shape{margin:8px 0 0;font-size:17px;font-weight:600;color:#3F3F46}
.unt-info table{width:100%;margin-top:22px;border-collapse:collapse;border-top:2px solid #0F1C3A}
.unt-info th,.unt-info td{text-align:left;border-bottom:1px solid #E7E5E4;padding:14px 16px;font-size:15px;line-height:1.5}
.unt-info th{width:96px;background:#F6F4EF;font-size:13px;font-weight:700;color:#0F1C3A}
.unt-info td b{font-size:18px;color:#0F1C3A}
.unt-pts{list-style:none;margin:20px 0 0;padding:0}
.unt-pts li{position:relative;padding:6px 0 6px 18px;font-size:15px;color:#3F3F46}
.unt-pts li:before{content:'';position:absolute;left:2px;top:15px;width:6px;height:6px;border-radius:50%;background:#FF671D}
.unt-common{margin:18px 0 0;padding:14px 16px;background:#F6F4EF;border-radius:6px;font-size:13px;line-height:1.6;color:#52525B;word-break:keep-all}
.unt-common em{display:block;font-style:normal;font-size:12px;font-weight:700;color:#0F1C3A;margin-bottom:2px}

/* 4. 커뮤니티 */
.unt-com{margin-top:32px;display:grid;grid-template-columns:8fr 3fr;gap:40px;align-items:center}
.unt-com figure{position:relative;margin:0}
.unt-com figure img{display:block;width:100%;height:auto;filter:none}
.unt-pin{position:absolute;transform:translate(-50%,-50%);width:26px;height:26px;border-radius:50%;background:#FF671D;color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px #fff}
.unt-com ol{list-style:none;margin:0;padding:0;border-top:2px solid #0F1C3A}
.unt-com li{display:flex;align-items:center;gap:12px;padding:13px 2px;border-bottom:1px solid #E7E5E4;font-size:16px;font-weight:600;color:#0F1C3A}
.unt-com li em{font-style:normal;flex:none;width:22px;height:22px;border-radius:50%;background:#FF671D;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center}

.unt button:focus-visible,.unt a:focus-visible{outline:3px solid #FF671D;outline-offset:3px}

@media (max-width:1023px){
  .unt-top,.unt-plan{grid-template-columns:1fr;gap:32px}
  .unt-gal{grid-template-columns:1fr}
  .unt-thumbs{grid-template-columns:repeat(4,1fr)}
  .unt-com{grid-template-columns:1fr;gap:24px}
  .unt-com ol{display:grid;grid-template-columns:1fr 1fr;column-gap:20px}
}
@media (max-width:767px){
  .unt-in{padding:56px 20px 80px}
  .unt-tt{font-size:28px}
  .unt-top{margin-top:32px;gap:28px}
  .unt-ph{margin:0 -20px}
  .unt-ph>div{border-radius:0}
  .unt-ph figcaption{padding:0 20px}
  .unt-a{font-size:32px;letter-spacing:-1.2px}
  .unt-stats b{font-size:32px}
  .unt-stats b.sm{font-size:21px}
  .unt-stats span{font-size:14px}
  .unt-hd{margin-top:72px}
  .unt-st{font-size:22px}
  .unt-gal{margin:24px -20px 0}
  .unt-big{border-radius:0}
  .unt-thumbs{display:flex;gap:8px;overflow-x:auto;padding:0 20px;scrollbar-width:none}
  .unt-thumbs::-webkit-scrollbar{display:none}
  .unt-thumbs li{flex:none;width:96px}
  .unt-tabs{gap:6px}
  .unt-tabs button{padding:10px 12px;font-size:15px;flex:1;justify-content:center}
  .unt-tabs button small{display:none}
  .unt-plan figure{padding:10px}
  .unt-tn{font-size:26px}
  .unt-mo{display:inline}
  .unt-com ol{grid-template-columns:1fr}
  .unt-pin{width:20px;height:20px;font-size:11px}
}
@media (prefers-reduced-motion:reduce){.unt-big img,.unt-plan figure img{animation:none}}
@media (min-width:1600px){.unt-in{zoom:1.12}}
@media (min-width:1920px){.unt-in{zoom:1.3}}
@media (min-width:2300px){.unt-in{zoom:1.45}}
`;
