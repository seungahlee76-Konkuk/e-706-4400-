/* ───────── 개인정보처리방침 (/privacy) ─────────
   내용을 바꿀 때는 아래 INFO 와 SECTIONS 의 문장만 고치면 됩니다. */

const INFO = {
  name: '루에나파트너스',
  ceo: '김지선',
  phone: '031-293-1073',
  effective: '2026년 11월 20일',
};

type Sec = { n: string; t: string; p?: string; rows?: [string, string][]; li?: string[] };

const SECTIONS: Sec[] = [
  {
    n: '01', t: '수집',
    p: '상담 신청을 받을 때 꼭 필요한 정보만 수집합니다.',
    rows: [
      ['상담 신청', '이름, 휴대전화 번호, 관심 호실, 상담 희망 시간'],
      ['자동 수집', '신청 일시, 방문 통계용 쿠키(Google Analytics · 브라우저 설정으로 거부 가능)'],
    ],
  },
  {
    n: '02', t: '이용',
    rows: [
      ['이용 목적', '분양·임대 상담, 홍보관 방문 예약 연락'],
      ['보유 기간', '상담 신청일로부터 1년'],
    ],
  },
  {
    n: '03', t: '위탁 및 제3자 제공',
    p: '개인정보를 제3자에게 제공하지 않습니다. 상담 신청 저장과 알림을 위해 아래 해외 서비스를 이용하며, 원하지 않으시면 전화로 상담을 신청하실 수 있습니다.',
    rows: [
      ['Google Firebase (미국)', '상담 신청 저장'],
      ['Formspree (미국)', '상담 신청 알림 메일'],
    ],
  },
  {
    n: '04', t: '삭제',
    p: '보유 기간이 끝나거나 삭제를 요청하시면 지체 없이 삭제합니다.',
    li: ['전자 파일: 복구할 수 없는 방법으로 삭제', '종이 기록: 분쇄 또는 소각'],
  },
  {
    n: '05', t: '보호',
    p: '개인정보의 열람·정정·삭제·처리 정지는 아래로 요청해 주세요.',
    rows: [
      ['개인정보 보호책임자', `${INFO.ceo} (${INFO.name} 대표)`],
      ['연락처', INFO.phone],
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <section className="pp">
      <style>{CSS}</style>
      <div className="pp-in">
        <p className="pp-eb">PRIVACY POLICY</p>
        <h1 className="pp-tt">개인정보처리방침</h1>
        <span className="pp-ln" aria-hidden="true" />
        <p className="pp-lead">{INFO.name}는 「개인정보 보호법」에 따라 상담 신청자의 개인정보를 아래와 같이 처리합니다.</p>
        {SECTIONS.map((s) => (
          <div key={s.n} className="pp-sec">
            <h2><em>{s.n}</em>{s.t}</h2>
            {s.p && <p>{s.p}</p>}
            {s.rows && (
              <table>
                <tbody>{s.rows.map(([a, b]) => <tr key={a}><th scope="row">{a}</th><td>{b}</td></tr>)}</tbody>
              </table>
            )}
            {s.li && <ul>{s.li.map((x) => <li key={x}>{x}</li>)}</ul>}
          </div>
        ))}
        <p className="pp-foot">시행일: {INFO.effective}</p>
      </div>
    </section>
  );
}

const CSS = `
.pp{background:#fff;color:#1C1C1E}
.pp-in{max-width:820px;margin:0 auto;padding:88px 24px 110px}
.pp-eb{margin:0;font-size:12px;font-weight:700;letter-spacing:3px;color:#71717A}
.pp-tt{margin:12px 0 0;font-size:34px;font-weight:800;letter-spacing:-1.2px;color:#0F1C3A}
.pp-ln{display:block;width:56px;height:3px;background:#FF671D;margin-top:20px}
.pp-lead{margin:28px 0 0;font-size:16px;line-height:1.8;color:#3F3F46;word-break:keep-all}
.pp-sec{margin-top:44px}
.pp-sec h2{margin:0;display:flex;align-items:baseline;gap:12px;font-size:20px;font-weight:800;letter-spacing:-.5px;color:#0F1C3A}
.pp-sec h2 em{font-style:normal;font-size:14px;font-weight:700;color:#D24A0E;letter-spacing:.5px}
.pp-sec p{margin:12px 0 0;font-size:15px;line-height:1.8;color:#3F3F46;word-break:keep-all}
.pp table{width:100%;margin-top:14px;border-collapse:collapse;border-top:2px solid #0F1C3A;font-size:15px}
.pp th,.pp td{text-align:left;vertical-align:top;padding:14px 16px;border-bottom:1px solid #E7E5E4;line-height:1.6;word-break:keep-all}
.pp th{width:200px;background:#F6F4EF;font-weight:700;color:#0F1C3A}
.pp td{color:#3F3F46}
.pp-sec ul{margin:12px 0 0;padding-left:20px}
.pp-sec li{font-size:15px;line-height:1.8;color:#3F3F46}
.pp-foot{margin:48px 0 0;font-size:13px;color:#A1A1AA}
@media (max-width:767px){.pp-in{padding:56px 20px 80px}.pp-tt{font-size:28px}.pp th{width:110px;padding:12px}.pp td{padding:12px}}
`;
