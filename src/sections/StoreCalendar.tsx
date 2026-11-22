import { useState } from 'react';

/* ───────── 입점 캘린더 (/store #calendar) ─────────
   내용을 바꿀 때는 아래 MONTH, NEWS, OPEN 데이터만 고치면 됩니다.
   휴대폰에서는 짧게 보이도록: 집중 모집 카드는 눌러서 펼치고, 입점 소식 / 모집 중인 자리는 탭으로 하나씩 봅니다. */

const MONTH = { year: 2026, month: 11 };

type TagKey = 'focus' | 'open' | 'nego' | 'done' | 'work' | 'soon' | 'income' | 'reserved' | 'saleonly' | 'rentonly';

// 상태 태그: 문구와 색 (확정 팔레트)
const TAG: Record<TagKey, { text: string; className: string }> = {
  focus:    { text: '집중 모집',   className: 'bg-[#FF671D] text-white' },
  open:     { text: '입점 가능',   className: 'bg-[#FFF1E8] text-[#9A3412]' },
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
  { unit: '127호', tag: 'focus',  title: '프랜차이즈 베이커리 임차인 모집', sub: '25평 · 정문 동선 · 주차장 인접' },
  { unit: '117호', tag: 'focus',  title: '1:1 프라이빗 필라테스 임차인 모집', sub: '15평 · 병원 통행로 변' },
  { unit: '129호', tag: 'income', title: '분양 모집 중 · 임차인 확정 호실', sub: '10평대 · 닭한상 입점' },
  { unit: '137호', tag: 'open',   title: '호프집 · 애견미용',             sub: '10평대 · CU 옆' },
  { unit: '139호', tag: 'open',   title: '호프 · 이자카야',               sub: '10평대 · 103동 코너 저녁 상권' },
];

// 맨 위 "집중 모집" 카드 2장
type Focus = { id: string; img: string; pos?: string; title: string; lines: string[]; meta: string };
const FOCUS: Focus[] = [
  {
    id: '127', img: '/photos/rooms/127-1.jpg', pos: '50% 60%',
    title: '정문 동선, 프랜차이즈 베이커리 임차인 모집',
    lines: ['덕산병원 외래 하루 800명과 오피스텔 430세대가 지나는 정문 동선 자리입니다.', '프랜차이즈 베이커리 표준 매장 규모에 맞는 면적입니다.'],
    meta: '전용 25.47평 · 1층 외부 노출 · 주차장 인접',
  },
  {
    id: '117', img: '/photos/rooms/117-1.jpg', pos: '55% 60%',
    title: '덕산병원 바로 옆, 1:1 프라이빗 필라테스 임차인 모집',
    lines: ['병원 통행로 동선 위에 있어, 외래 환자·보호자와 병원 직원이 매일 지나가는 자리입니다.', '1:1·2:1 레슨 위주의 프라이빗 스튜디오로 운영하기 좋은 15평 규모이고, 오피스텔 430세대 입주민이 바로 위에 삽니다.'],
    meta: '전용 15.99평 · 1층 · 병원 통행로 변',
  },
];
const FOCUS_NOTE = '(2026년 11월 기준)';

function openRoom(id: string) {
  // 호실 섹션(StoreUnits)이 이 이벤트를 받아 해당 호실 상세를 엽니다.
  window.dispatchEvent(new CustomEvent('store-open-room', { detail: { room: id } }));
}

function FocusCards() {
  const [open, setOpen] = useState<string | null>(null); // 휴대폰: 펼친 카드
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {FOCUS.map((f) => {
          const on = open === f.id;
          return (
            <article key={f.id} className="overflow-hidden rounded-[12px] border border-[#ECEBE8] bg-white sm:grid sm:grid-cols-[200px_minmax(0,1fr)]" style={{ boxShadow: '0 14px 34px -22px rgba(15,28,58,.35)' }}>
              {/* PC: 큰 사진 */}
              <div className="relative hidden sm:block">
                <img src={f.img} alt={`${f.id}호 외관`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: f.pos, filter: 'saturate(.9) sepia(.07)' }} />
                <span className="absolute top-3 left-3 rounded-[6px] bg-[#FF671D] px-[10px] py-1 text-[12px] font-extrabold text-white">집중 모집 · {f.id}호</span>
              </div>

              {/* 휴대폰: 작은 사진 + 제목 줄 (누르면 펼침) */}
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : f.id)}
                className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent p-3 text-left sm:hidden">
                <span className="relative block h-[84px] w-[84px] flex-none overflow-hidden rounded-[8px]">
                  <img src={f.img} alt={`${f.id}호 외관`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: f.pos, filter: 'saturate(.9) sepia(.07)' }} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-[12px] font-extrabold text-[#D24A0E]">집중 모집 · {f.id}호</span>
                  <span className="text-[16px] leading-[1.35] font-extrabold tracking-[-0.4px] text-[#0F1C3A] [word-break:keep-all]">{f.title}</span>
                </span>
                <span aria-hidden="true" className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-[14px] transition-transform"
                  style={{ background: on ? '#FF671D' : '#F4F4F5', color: on ? '#fff' : '#71717A', transform: on ? 'rotate(90deg)' : 'none' }}>›</span>
              </button>

              {/* 내용: 휴대폰은 펼쳤을 때만, PC는 항상 */}
              <div className={`${on ? 'flex' : 'hidden'} flex-col gap-2 px-4 pb-4 sm:flex sm:px-6 sm:py-5`}>
                <h3 className="m-0 hidden text-[19px] leading-[1.4] font-extrabold tracking-[-0.5px] text-[#0F1C3A] [word-break:keep-all] sm:block">{f.title}</h3>
                {f.lines.map((l) => <p key={l} className="m-0 text-[14px] leading-[1.7] text-[#3F3F46] [word-break:keep-all]">{l}</p>)}
                <p className="m-0 mt-1 text-[13px] font-bold text-[#52525B]">{f.meta}</p>
                <p className="m-0 text-[13px] font-bold text-[#D24A0E]">임대조건 협의 가능</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  <button type="button" onClick={() => openRoom(f.id)} className="cursor-pointer rounded-[8px] border-0 bg-[#0F1C3A] px-4 py-[11px] text-[14px] font-bold text-white">호실 자세히 보기</button>
                  <a href="tel:031-293-1073" className="rounded-[8px] border border-[#D6D3D1] px-4 py-[10px] text-center text-[14px] font-bold text-[#0F1C3A] no-underline">031)293-1073</a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="m-0 text-[12px] text-[#A1A1AA]">{FOCUS_NOTE}</p>
    </div>
  );
}

function CalCard({ title, titleColor, topColor, rows, show }: { title: string; titleColor: string; topColor: string; rows: Row[]; show: boolean }) {
  return (
    <article
      className={`${show ? 'flex' : 'hidden'} w-full max-w-[560px] flex-[1_1_440px] flex-col gap-[10px] rounded-[6px] border border-[#ECEBE8] bg-white px-5 pt-4 pb-3 text-[#1C1C1E] sm:flex sm:gap-[18px] sm:px-8 sm:pt-8 sm:pb-6`}
      style={{ borderTop: `4px solid ${topColor}` }}
    >
      <div className="hidden flex-col items-center gap-[2px] border-b border-[#E4E4E7] pb-4 sm:flex">
        <p className="m-0 text-[22px] font-bold" style={{ color: titleColor }}>{title}</p>
        <p className="mt-[6px] mb-0 text-[40px] font-extrabold leading-none">{MONTH.month}</p>
        <p className="m-0 text-[13px] text-[#71717A]">{MONTH.year}</p>
      </div>
      <p className="m-0 text-[13px] font-bold text-[#71717A] sm:hidden">{MONTH.year}년 {MONTH.month}월 기준</p>
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
  const [tab, setTab] = useState<'news' | 'open'>('news'); // 휴대폰 탭
  return (
    <section id="calendar" className="scroll-mt-[72px] bg-[#F7F6F4] text-[#1C1C1E]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-11 px-5 pt-16 pb-20 sm:px-10 sm:pt-[88px] sm:pb-24">
        <div className="flex flex-col gap-[14px]">
          <p className="m-0 text-[13px] font-extrabold tracking-[2px] text-[#D24A0E]">STORE CALENDAR</p>
          <h2 className="m-0 text-[30px] font-extrabold tracking-[-1px] sm:text-[36px]">입점 캘린더</h2>
          <span aria-hidden="true" className="h-1 w-16 bg-[#FF6F00]" />
        </div>
        <FocusCards />
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
          {/* 휴대폰 탭: 하나씩 보기 */}
          <div role="tablist" aria-label="입점 캘린더 보기" className="grid grid-cols-2 rounded-[10px] bg-[#ECEAE6] p-1 sm:hidden">
            {([['news', '입점 소식', NEWS.length], ['open', '모집 중인 자리', OPEN.length]] as ['news' | 'open', string, number][]).map(([k, label, n]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className="h-12 cursor-pointer rounded-[8px] border-0 text-[16px] font-extrabold tracking-[-0.3px]"
                style={{ background: tab === k ? '#FFFFFF' : 'transparent', color: tab === k ? (k === 'news' ? '#1F4E3D' : '#D24A0E') : '#71717A', boxShadow: tab === k ? '0 2px 8px -4px rgba(15,28,58,.35)' : 'none' }}>
                {label} <span className="text-[13px] font-bold opacity-70">{n}</span>
              </button>
            ))}
          </div>
          <CalCard title="입점 소식" titleColor="#1F4E3D" topColor="#1F4E3D" rows={NEWS} show={tab === 'news'} />
          <CalCard title="모집 중인 자리" titleColor="#D24A0E" topColor="#FF6F00" rows={OPEN} show={tab === 'open'} />
        </div>
      </div>
    </section>
  );
}
