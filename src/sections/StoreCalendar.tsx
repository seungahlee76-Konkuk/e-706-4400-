/* ───────── 입점 캘린더 (/store #calendar) ─────────
   내용을 바꿀 때는 아래 MONTH, NEWS, OPEN 데이터만 고치면 됩니다. */

const MONTH = { year: 2026, month: 11 };

type TagKey = 'open' | 'nego' | 'done' | 'work' | 'soon' | 'income' | 'reserved' | 'saleonly' | 'rentonly';

// 상태 태그: 문구와 색 (확정 팔레트)
const TAG: Record<TagKey, { text: string; className: string }> = {
  open:     { text: '모집 중',     className: 'bg-[#FFF1E8] text-[#9A3412]' },
  nego:     { text: '협의 중',     className: 'bg-white text-[#3F3F46] border border-dashed border-[#71717A] !py-[3px] !px-[9px]' },
  done:     { text: '입점 확정',   className: 'bg-[#DDE1EC] text-[#0F1C3A]' },
  work:     { text: '인테리어 시작', className: 'bg-[#D9F3EF] text-[#0F6F68]' },
  soon:     { text: '오픈 예정',   className: 'bg-[#7FD3CB] text-[#0B3B37]' },
  income:   { text: '수익형',      className: 'bg-[#0F1C3A] text-white' },
  reserved: { text: '분양 협의 중', className: 'bg-[#E4E4E7] text-[#3F3F46]' },
  saleonly: { text: '분양 전용',   className: 'bg-[#E4E4E7] text-[#3F3F46]' },
  rentonly: { text: '임대 전용',   className: 'bg-[#E4E4E7] text-[#3F3F46]' },
};

type Row = { unit: string; tag: TagKey; title: string; sub: string };

// 왼쪽 카드: 입점 소식
const NEWS: Row[] = [
  { unit: '129호', tag: 'work', title: '닭한상 (삼계탕·닭볶음탕·닭개장)', sub: '인테리어 중' },
  { unit: '129호', tag: 'soon', title: '닭한상 오픈', sub: '12월 말 예정' },
  { unit: '127호', tag: 'nego', title: '베이커리 프랜차이즈', sub: '매장을 운영하실 가맹 임차인 모집 중' },
];

// 오른쪽 카드: 모집 중인 자리
const OPEN: Row[] = [
  { unit: '118호', tag: 'open',   title: '갈비탕·냉면 · 브런치', sub: '30평대 · 병원 통행로 인접' },
  { unit: '126호', tag: 'open',   title: '음식점 · 사무실',              sub: '20평대 · 주차장 인접' },
  { unit: '127호', tag: 'open',   title: '베이커리 가맹 운영 임차인 모집', sub: '25평 · 본사 입점 협의 중인 자리' },
  { unit: '129호', tag: 'income', title: '분양 모집 중 · 임차인 확정 호실', sub: '10평대 · 닭한상 입점 (보증금 5,000 / 월 300만)' },
  { unit: '137호', tag: 'open',   title: '호프집 · 애견미용',             sub: '10평대 · CU 옆' },
  { unit: '139호', tag: 'open',   title: '호프 · 이자카야',               sub: '10평대 · 103동 코너 저녁 상권' },
];

function CalCard({ title, titleColor, topColor, rows }: { title: string; titleColor: string; topColor: string; rows: Row[] }) {
  return (
    <article
      className="flex w-full max-w-[560px] flex-[1_1_440px] flex-col gap-[18px] rounded-[6px] border border-[#ECEBE8] bg-white px-5 pt-7 pb-5 text-[#1C1C1E] sm:px-8 sm:pt-8 sm:pb-6"
      style={{ borderTop: `4px solid ${topColor}` }}
    >
      <div className="flex flex-col items-center gap-[2px] border-b border-[#E4E4E7] pb-4">
        <p className="m-0 text-[20px] font-bold sm:text-[22px]" style={{ color: titleColor }}>{title}</p>
        <p className="mt-[6px] mb-0 text-[40px] font-extrabold leading-none">{MONTH.month}</p>
        <p className="m-0 text-[13px] text-[#71717A]">{MONTH.year}</p>
      </div>
      <ul className="m-0 flex list-none flex-col p-0">
        {rows.map((r, i) => {
          const t = TAG[r.tag];
          return (
            <li
              key={r.unit + r.tag + i}
              className="grid grid-cols-[52px_92px_minmax(0,1fr)] items-start gap-[10px] border-b border-[#F4F4F5] py-4 last:border-b-0 sm:grid-cols-[74px_100px_minmax(0,1fr)] sm:gap-3"
            >
              <span className="text-[14px] font-extrabold sm:text-[15px]">{r.unit}</span>
              <span className={`inline-block rounded-[4px] px-[10px] py-1 text-center text-[12px] font-bold whitespace-nowrap ${t.className}`}>{t.text}</span>
              <span className="flex flex-col gap-[2px]">
                <span className="text-[14px] font-bold sm:text-[15px]">{r.title}</span>
                <span className="text-[13px] text-[#52525B]">{r.sub}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default function StoreCalendar() {
  return (
    <section id="calendar" className="scroll-mt-[72px] bg-[#F7F6F4] text-[#1C1C1E]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-11 px-5 pt-16 pb-20 sm:px-10 sm:pt-[88px] sm:pb-24">
        <div className="flex flex-col gap-[14px]">
          <p className="m-0 text-[13px] font-extrabold tracking-[2px] text-[#D24A0E]">STORE CALENDAR</p>
          <h2 className="m-0 text-[30px] font-extrabold tracking-[-1px] sm:text-[36px]">입점 캘린더</h2>
          <span aria-hidden="true" className="h-1 w-16 bg-[#FF6F00]" />
        </div>
        <div className="flex w-full flex-wrap justify-center gap-6">
          <CalCard title="입점 소식" titleColor="#1F4E3D" topColor="#1F4E3D" rows={NEWS} />
          <CalCard title="모집 중인 자리" titleColor="#D24A0E" topColor="#FF6F00" rows={OPEN} />
        </div>
      </div>
    </section>
  );
}
