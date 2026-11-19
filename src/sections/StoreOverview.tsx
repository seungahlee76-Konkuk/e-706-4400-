/* ───────── 사업개요 (그림 하나 + 표 하나) ─────────
   내용을 바꿀 때는 아래 IMAGE, ROWS만 고치면 됩니다. */

const IMAGE = { src: '/photos/hero-1.jpg', alt: 'e편한세상 시티 고색 투시도', pos: '40% 55%' };

// [항목, 값, 작은 글씨(선택), 둘째 줄(선택)]
type Row = { label: string; value: string; note?: string; line2?: string; mBreak?: boolean };
const ROWS: Row[] = [
  { label: '사업명', value: 'e편한세상 시티 고색' },
  { label: '대지위치', value: '경기도 수원시 권선구 고색동', line2: '894-125번지 외 6필지' },
  { label: '대지면적', value: '11,195.00㎡', note: '(3,386.49평)' },
  { label: '연면적', value: '85,512.62㎡', note: '(25,867.57평)' },
  { label: '건폐율 / 용적률', value: '55.02% / 464.19%', mBreak: true },
  { label: '건축규모', value: '지하 4층 ~ 지상 14층' },
  { label: '공급규모', value: '오피스텔 430세대', note: '(전용 84㎡)', line2: '1층 근린생활시설' },
  { label: '주차대수', value: '608대', note: '(근린생활시설 포함)' },
  { label: '시공', value: 'DL이앤씨' },
];

export default function StoreOverview() {
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
            <figcaption>투시도(CG)로 실제와 다를 수 있습니다.</figcaption>
          </figure>
          <div className="pov-tb">
            <table>
              <tbody>
                {ROWS.map((r) => {
                  const [a, b] = r.label.split(' / ');
                  return (
                    <tr key={r.label}>
                      <th scope="row">{r.mBreak && b ? <>{a} /<br className="pov-mbr" /> {b}</> : r.label}</th>
                      <td>
                        {r.value}
                        {r.note && <small> {r.note}</small>}
                        {r.line2 && <><br />{r.line2}</>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
.pov-mbr{display:none}
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
  .pov-mbr{display:inline}
}

/* 한 화면 꽉 채우기: 섹션 높이를 화면 높이(헤더 제외)에 맞추고 내용은 세로 가운데 → 푸터는 항상 화면 아래 */
.loc:has(.loc-idx),.pov{min-height:calc(100svh - 72px);display:flex;align-items:center}
.loc-idx,.pov-in{width:100%}
/* 큰 화면(1600px 이상): 히어로와 같은 비율로 키움 */
@media (min-width:1600px){.loc-idx,.pov-in{zoom:1.12}}
@media (min-width:1920px){.loc-idx,.pov-in{zoom:1.3}}
@media (min-width:2300px){.loc-idx,.pov-in{zoom:1.45}}
`;
