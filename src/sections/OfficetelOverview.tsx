/* ───────── 오피스텔 사업개요 (상가 사업개요와 같은 틀: 그림 하나 + 표 하나, 아래에 타입별 배치) ─────────
   내용을 바꿀 때는 아래 IMAGE, ROWS, PLAN, TYPES만 고치면 됩니다.
   이미지 파일은 public/photos/officetel/ 에 사용자가 직접 올립니다. */

const IMAGE = { src: '/photos/officetel/aerial.jpg', alt: 'e편한세상 시티 고색 조감도', pos: '50% 50%' };

// [항목, 값, 작은 글씨(선택), 둘째 줄(선택)]
type Row = { label: string; value: string; note?: string; line2?: string };
const ROWS: Row[] = [
  { label: '사업명', value: 'e편한세상 시티 고색' },
  { label: '대지위치', value: '경기도 수원시 권선구 고색동', line2: '894-125번지 외 6필지' },
  { label: '건축규모', value: '지하 4층 ~ 지상 14층', note: '(3개 동)' },
  { label: '공급규모', value: '오피스텔 430세대', note: '(전용 84㎡)', line2: '84A · 84B · 84C · 84D' },
  { label: '커뮤니티', value: '피트니스 · 스크린골프룸', line2: '라운지카페 · 실내놀이터 · 개인오피스' },
  { label: '기본 제공', value: '시스템에어컨 4대 · 김치냉장고' },
  { label: '주차대수', value: '608대', note: '(근린생활시설 포함)' },
  { label: '주변 개발', value: '탑동 이노베이션밸리', note: '(2029년 7월 준공 목표)' },
  { label: '시공', value: 'DL이앤씨' },
];

// 단지 배치도 (타입별 위치)
const PLAN = { src: '/photos/officetel/siteplan.jpg', alt: 'e편한세상 시티 고색 단지 배치도 · 타입별 위치' };

// 타입별 전용면적·세대수 (배치도 색과 같은 색)
const TYPES = [
  { t: '84A', color: '#E09346', area: '84.63', py: '25.60', n: 302 },
  { t: '84B', color: '#00B4BC', area: '84.51', py: '25.56', n: 89 },
  { t: '84C', color: '#8676B0', area: '84.16', py: '25.45', n: 26 },
  { t: '84D', color: '#EF5DA2', area: '84.52', py: '25.57', n: 13 },
];
const TOTAL = TYPES.reduce((s, x) => s + x.n, 0);

export default function OfficetelOverview() {
  return (
    <section id="overview" className="pov scroll-mt-[72px]">
      <style>{CSS}</style>
      <div className="pov-in">
        <div className="pov-hd">
          <p className="pov-eb">PROJECT OVERVIEW</p>
          <h2 className="pov-tt">사업개요</h2>
          <span className="pov-ln" aria-hidden="true" />
        </div>
        <div className="pov-gr">
          <figure className="pov-ph">
            <div><img src={IMAGE.src} alt={IMAGE.alt} loading="lazy" style={{ objectPosition: IMAGE.pos }} /></div>
            <figcaption>조감도(CG)로 실제와 다를 수 있습니다.</figcaption>
          </figure>
          <div className="pov-tb">
            <table>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    <td>
                      {r.value}
                      {r.note && <small> {r.note}</small>}
                      {r.line2 && <><br />{r.line2}</>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 타입별 배치 ── */}
        <div className="pov-hd pov-hd2">
          <p className="pov-eb">UNIT TYPE</p>
          <h3 className="pov-st">타입별 배치</h3>
        </div>
        <div className="pov-gr">
          <figure className="pov-ph pov-plan">
            <a href={PLAN.src} target="_blank" rel="noopener noreferrer" aria-label="배치도 크게 보기">
              <img src={PLAN.src} alt={PLAN.alt} loading="lazy" />
            </a>
            <figcaption className="pov-mo">누르면 크게 보기</figcaption>
          </figure>
          <div className="pov-tb">
            <table className="pov-ty">
              <thead>
                <tr><th scope="col">타입</th><th scope="col">전용면적</th><th scope="col">세대수</th></tr>
              </thead>
              <tbody>
                {TYPES.map((x) => (
                  <tr key={x.t}>
                    <th scope="row"><i style={{ background: x.color }} aria-hidden="true" />{x.t}</th>
                    <td>{x.area}㎡ <small>({x.py}평)</small></td>
                    <td><b>{x.n}</b>세대</td>
                  </tr>
                ))}
                <tr className="sum"><th scope="row">합계</th><td>전 세대 84㎡ · 방 3개</td><td><b>{TOTAL}</b>세대</td></tr>
              </tbody>
            </table>
            <p className="pov-nt">배치도 색이 타입을 뜻합니다. 같은 84㎡라도 타입마다 방향과 구조가 달라요.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.pov{background:#fff;color:#1C1C1E}
.pov-in{max-width:1280px;margin:0 auto;padding:96px 40px 110px}
.pov-eb{margin:0;font-size:12px;font-weight:700;letter-spacing:3px;color:#71717A}
.pov-tt{margin:12px 0 0;font-size:36px;font-weight:800;letter-spacing:-1.2px;line-height:1.2;color:#0F1C3A}
.pov-ln{display:block;width:56px;height:3px;background:#FF671D;margin-top:20px}
.pov-gr{margin-top:48px;display:grid;grid-template-columns:7fr 5fr;gap:48px;align-items:stretch}
.pov-ph{margin:0;display:flex;flex-direction:column}
.pov-ph>div{flex:1;min-height:420px;border-radius:6px;overflow:hidden;background:#E7E5E4}
.pov-ph img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.03) sepia(.07)}
.pov-ph figcaption{margin-top:10px;font-size:12px;color:#A1A1AA}
.pov table{width:100%;border-collapse:collapse;border-top:2px solid #0F1C3A}
.pov th,.pov td{text-align:left;vertical-align:top;border-bottom:1px solid #E7E5E4;line-height:1.5}
.pov th{width:132px;padding:19px 20px 17px;background:#F6F4EF;font-size:14px;font-weight:700;color:#0F1C3A;white-space:nowrap}
.pov td{padding:17px 20px;font-size:16px;font-weight:500;letter-spacing:-.2px;word-break:keep-all}
.pov td small{font-size:14px;font-weight:400;color:#71717A;white-space:nowrap}

/* 타입별 배치 */
.pov-hd2{margin-top:96px}
.pov-st{margin:10px 0 0;font-size:26px;font-weight:800;letter-spacing:-1px;color:#0F1C3A}
.pov-plan a{display:block;border-radius:6px;overflow:hidden;background:#1C1C1E}
.pov-plan img{height:auto;filter:none}
.pov-mo{display:none}
.pov-tb{min-width:0}
.pov-ty thead th{width:auto;padding:14px 16px;font-size:13px;color:#71717A;background:#fff;border-bottom:1px solid #D6D3D1}
.pov-ty tbody th{width:96px;background:#fff;font-size:17px;font-weight:800;display:flex;align-items:center;gap:10px;border-bottom:0}
.pov-ty tbody tr{border-bottom:1px solid #E7E5E4}
.pov-ty tbody td{border-bottom:0}
.pov-ty th i{width:12px;height:12px;border-radius:3px;flex:none}
.pov-ty td b{font-size:20px;font-weight:800;color:#0F1C3A;margin-right:2px}
.pov-ty tr.sum{background:#F6F4EF;border-bottom:2px solid #0F1C3A}
.pov-ty tr.sum th{background:transparent;font-size:15px}
.pov-ty tr.sum td{font-size:14px;color:#52525B}
.pov-ty tr.sum td b{color:#D24A0E}
.pov-nt{margin:16px 0 0;font-size:14px;line-height:1.6;color:#71717A;word-break:keep-all}

@media (max-width:1023px){
  .pov-gr{grid-template-columns:1fr;gap:32px}
  .pov-ph>div{min-height:0;aspect-ratio:16/10}
}
@media (max-width:767px){
  .pov-in{padding:56px 0 72px}
  .pov-hd,.pov-tb,.pov-ph figcaption{padding:0 20px}
  .pov-tt{font-size:28px}
  .pov-gr{margin-top:32px;gap:28px}
  .pov-ph>div{aspect-ratio:4/3;border-radius:0}
  .pov th{width:88px;padding:15px 12px 14px;font-size:13px;white-space:normal}
  .pov td{padding:14px;font-size:15px}
  .pov td small{font-size:13px}
  .pov-hd2{margin-top:64px}
  .pov-st{font-size:22px}
  .pov-plan a{border-radius:0}
  .pov-mo{display:inline}
  .pov-ty thead th{padding:12px 10px}
  .pov-ty tbody th{width:74px;font-size:15px;gap:8px;padding:15px 10px}
  .pov-ty tbody td{padding:14px 10px}
  .pov-ty td b{font-size:17px}
}

.pov{min-height:calc(100svh - 72px);display:flex;align-items:center}
.pov-in{width:100%}
@media (min-width:1600px){.pov-in{zoom:1.12}}
@media (min-width:1920px){.pov-in{zoom:1.3}}
@media (min-width:2300px){.pov-in{zoom:1.45}}
`;
