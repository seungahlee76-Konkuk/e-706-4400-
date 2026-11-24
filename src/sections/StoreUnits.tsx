import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

/* ───────── 입점추천 (#units) + 호실 상세 (#detail) ─────────
   호실 정보를 바꿀 때는 아래 ROOMS 데이터만 고치면 됩니다. */

type Mode = 'rent' | 'sale';
type TagKey = 'open' | 'saleopen' | 'consult' | 'nego' | 'done' | 'work' | 'soon' | 'income' | 'reserved' | 'saleonly' | 'rentonly';
type Room = {
  id: string;
  name?: string;            // 표시 이름 (없으면 '118호')
  mapName?: string;         // 배치도에 보일 이름 (약국 호실은 '약국')
  size: '10' | '20' | '30'; // 평수 구간
  uses: string[];           // 업종 필터 키
  rentOK?: boolean;         // false면 임대 불가
  saleOK?: boolean;         // false면 분양 불가
  rentTag?: TagKey;         // 임대 탭에서 보일 태그 (기본 open)
  saleTag?: TagKey;         // 분양 탭에서 보일 태그 (기본 open)
  useTitle: string; useText: string; area: string; rent: string; sale: string; tenant: string; point: string;
  why: string[];
};

const ROOMS: Room[] = [
  { id: '118', size: '30', uses: ['food'], useTitle: '갈비탕·냉면 · 브런치', useText: '갈비탕·냉면, 브런치 레스토랑', area: '전용 36.35평 · 계약 75.14평', rent: '보증금 5,000만 · 월 350만 (부가세 별도) · 조정 협의 가능', sale: '분양가 9억 4,430만 원', tenant: '임차인 모집 중', point: '병원 통행로 인접 · 36평 큰 면적',
    why: ['병원통행로 정면이라 외래 환자·보호자·직원이 매일 지나가는 첫 자리예요.', '약국 호실과 붙어 있어, 병원 정문에서 약국으로 이어지는 동선 위에 있어요.', '전용 36평으로 홀 좌석을 넉넉히 둘 수 있어요.'] },
  { id: '119', mapName: '약국', name: '119호', size: '30', uses: ['pharmacy'], rentOK: false, rentTag: 'saleonly', useTitle: '약국 (분양 전용)', useText: '약국', area: '전용 58.81평 · 계약 121.87평', rent: '임대 불가 · 분양만 가능', sale: '분양가 122억 2,000만 원', tenant: '공실 · 분양으로만 진행', point: '병원 통행로 바로 앞 · 118호 옆',
    why: ['병원 통행로에 바로 붙어 있어, 정문에서 나온 처방전 동선 위에 있어요.', '118호와 함께 병원 쪽 첫 줄을 이루는 자리예요.'] },
  { id: '120', mapName: '약국', name: '120호', size: '30', uses: ['pharmacy'], rentOK: false, rentTag: 'saleonly', useTitle: '약국 (분양 전용)', useText: '약국', area: '전용 56.73평 · 계약 117.26평', rent: '임대 불가 · 분양만 가능', sale: '분양가 87억 8,000만 원', tenant: '공실 · 분양으로만 진행', point: '병원 통행로 바로 앞',
    why: ['병원 통행로를 따라 이어지는 약국 자리예요.', '119호와 나란히 있어 병원 쪽 동선을 함께 받아요.'] },
  { id: '122', mapName: '약국', name: '122호', size: '30', uses: ['pharmacy'], rentTag: 'consult', useTitle: '약국 (임대·분양 모두 가능)', useText: '약국', area: '전용 44.25평 · 계약 91.47평', rent: '보증금·월세 협의 · 전화 주시면 바로 알려 드려요', sale: '분양가 69억 원', tenant: '현재 분양홍보관으로 사용 중 · 약국 임차인 모집', point: '정문 바로 앞 · 홍보관 자리',
    why: ['병원 정문에서 가장 가까운 호실 가운데 하나예요.', '약국 중 유일하게 임차로 들어올 수 있는 자리예요.', '지금은 분양홍보관으로 쓰고 있어, 입점 시기는 협의로 정해요.'] },
  { id: '126', size: '20', uses: ['food', 'office'], useTitle: '음식점 · 사무실', useText: '음식점, 사무실', area: '전용 23.44평 · 계약 48.45평', rent: '보증금 5,000만 · 월 320만 (부가세 별도) · 조정 협의 가능', sale: '분양가 8억 3,780만 원', tenant: '임차인 모집 중', point: '외부 노출 · 주차장 인접 · 후면 확장형',
    why: ['밖에서 바로 보이고 주차장 입구와 가까워 차로 오는 손님도 들르기 쉬워요.', '뒤쪽으로 공간이 넓어지는 구조라 주방이나 창고, 상담실을 두기 좋아요.', '옆 127호에 베이커리 입점을 협의 중이라 오가는 손님이 함께 늘어날 자리예요.'] },
  { id: '127', size: '20', uses: ['food'], saleOK: false, saleTag: 'reserved', useTitle: '베이커리 (가맹 운영 임차인 모집)', useText: '베이커리 프랜차이즈 · 매장을 운영하실 가맹 임차인 모집', area: '전용 25.47평 · 계약 52.65평 · 전면 7m', rent: '보증금 5,000만 · 월 350만 (부가세 별도) · 조정 협의 가능', sale: '분양 협의 고객 있음', tenant: '베이커리 가맹 운영 임차인 모집 중 (프랜차이즈 본사와 입점 협의 중)', point: '외부 노출 · 주차장 인접 · 전면 7m',
    why: ['전면 7m로 간판과 진열이 넓게 보여 베이커리에 유리해요.', '102동 상가 줄 가운데라 양옆 매장 손님이 함께 지나가요.', '대형 베이커리 프랜차이즈 본사와 입점을 협의하고 있어, 매장을 운영하실 분만 찾으면 돼요.'] },
  { id: '128', size: '10', uses: ['food'], useTitle: '쌀국수', useText: '쌀국수 등 한 그릇 식사', area: '전용 16.50평 · 계약 34.10평', rent: '보증금 5,000만 · 월 270만 (부가세 별도) · 조정 협의 가능', sale: '분양가 7억 290만 원', tenant: '임차인 모집 중', point: '외부 노출 · 주차장 인접 · 전면 6m',
    why: ['밖에서 바로 보이고 주차장 입구와 가까워 차로 오는 손님도 들르기 쉬워요.', '베이커리 자리와 닭한상 사이라 두 매장 손님이 앞을 지나가요.', '16평대 실속형이라 회전이 빠른 한 그릇 메뉴에 맞아요.'] },
  { id: '129', size: '10', uses: ['food'], rentOK: false, rentTag: 'done', saleTag: 'income', useTitle: '닭한상 (임차 완료)', useText: '닭한상 · 삼계탕·닭볶음탕·닭개장', area: '전용 18.47평 · 계약 38.18평', rent: '임차 완료 (닭한상)', sale: '분양가 7억 8,810만 원 · 현재 임대 보증금 5,000만 / 월 300만 (부가세 별도)', tenant: '닭한상 임차 확정 · 인테리어 시작', point: '외부 노출 · 주차장 인접 · 전면 5.9m',
    why: ['닭한상이 잔금을 마치고 인테리어를 시작했어요.', '분양받으면 첫날부터 임대료가 나오는 수익형 호실이에요.'] },
  { id: '117', size: '10', uses: ['edu', 'service', 'office'], useTitle: '1:1 필라테스', useText: '1:1 필라테스 등 예약제 소형 업종', area: '전용 15.99평 · 계약 33.05평', rent: '보증금 3,000만 · 월 170만 (부가세 별도) · 조정 협의 가능', sale: '분양가 4억 5,440만 원', tenant: '임차인 모집 중', point: '병원 통행로 변 · 101동 첫 호실',
    why: ['병원 통행로에서 단지로 들어서는 첫 호실이라 병원 직원과 외래 손님이 오가요.', '15평대 소형이라 1:1 필라테스처럼 예약제로 운영하는 업종의 고정비 부담이 작아요.'] },
  { id: '132', size: '10', uses: ['service', 'edu', 'office'], useTitle: '1인 미용실 · 미술 교습소', useText: '1인 미용실, 미술·공방 교습소 등 예약제 소형 업종', area: '전용 13.34평 · 계약 27.57평', rent: '보증금 3,000만 · 월 140만 (부가세 별도) · 조정 협의 가능', sale: '분양가 3억 8,340만 원', tenant: '임차인 모집 중', point: '중앙 광장 인접 · 소형 호실',
    why: ['단지 중앙 광장에 붙어 있어 입주민이 오가는 길목이에요.', '13평 소형이라 1인 미용실이나 미술 교습소처럼 예약제로 운영하는 업종에 맞아요.'] },
  { id: '136', size: '10', uses: ['bar'], saleOK: false, saleTag: 'rentonly', useTitle: '호프집', useText: '호프집 (137호와 합쳐 넓게 운영 가능)', area: '전용 17.79평 · 계약 38.96평', rent: '보증금 5,000만 · 월 240만 (부가세 별도)', sale: '분양 완료 · 임대만 가능', tenant: '임차인 모집 중', point: '외부 노출 · 장호덕 손만두 옆 · 137호와 합쳐 운영 가능',
    why: ['바로 옆 137호와 합치면 전용 36.64평으로 넓게 쓸 수 있어요.', '밖에서 잘 보이고 CU와 가까워 저녁에도 사람이 오가요.', '장호덕 손만두 옆이라 식사 손님이 오가는 줄에 있어요.'] },
  { id: '137', size: '10', uses: ['bar', 'pet', 'service'], useTitle: '호프집 · 애견미용', useText: '호프집 (136호와 합쳐 넓게 운영 가능), 애견미용', area: '전용 18.85평 · 계약 38.96평', rent: '보증금 5,000만 · 월 250만 (부가세 별도) · 조정 협의 가능', sale: '분양가 6억 8,870만 원', tenant: '임차인 모집 중', point: '외부 노출 · CU 옆 · 전면 6m',
    why: ['바로 옆 136호와 합치면 전용 36.64평으로 넓게 쓸 수 있어요.', '밖에서 잘 보이고 CU 옆이라 저녁에도 사람이 오가요.', '103동 주거 동선 쪽이라 애견미용처럼 주민이 단골이 되는 업종에도 맞아요.'] },
  { id: '139', size: '10', uses: ['bar', 'food'], useTitle: '호프 · 이자카야 (단독)', useText: '호프·이자카야 등 저녁 상권 업종', area: '전용 15.91평 · 계약 32.89평', rent: '보증금 5,000만 · 월 250만 (부가세 별도) · 조정 협의 가능', sale: '분양가 6억 8,160만 원', tenant: '임차인 모집 중', point: '103동 코너 · 편의점 옆',
    why: ['103동 코너라 두 방향에서 보이고, 옆 편의점 덕분에 저녁에도 사람이 오가요.'] },
];

// 카드 목록 페이지 (한 페이지 6개)
const PAGES: string[][] = [['117', '118', '126', '127', '128', '129'], ['132', '136', '137', '139'], ['119', '120', '122']];

// 카드 사진 (실사진이 생기면 경로만 바꾸면 됩니다)
const CARD_IMG: Record<string, [string, string]> = {
  '117': ['/photos/rooms/117-1.jpg', '55% 60%'], '118': ['/photos/rooms/118-1-1.jpg', '50% 60%'],
  '119': ['/photos/rooms/119-1.jpg', '50% 60%'], '120': ['/photos/rooms/120-1.jpg', '50% 60%'], '122': ['/photos/rooms/122-ext1.jpg', '50% 55%'],
  '126': ['/photos/rooms/126-1.jpg', '50% 60%'], '127': ['/photos/rooms/127-1.jpg', '50% 60%'], '128': ['/photos/rooms/128-1.jpg', '50% 60%'],
  '129': ['/photos/street-08.jpg', '45% 50%'], '132': ['/photos/rooms/132-1.jpg', '35% 60%'],
  '136': ['/photos/rooms/136-1.jpg', '50% 60%'], '137': ['/photos/rooms/137-1.jpg', '45% 60%'], '139': ['/photos/rooms/139-2-1.jpg', '50% 55%'],
};

// 상세 사진 칸 (호실별 실사진이 생기면 ROOM_PHOTOS['118'] = [...] 형태로 추가)
type Slot = { cap: string; src?: string };
const ROOM_PHOTOS: Record<string, Slot[]> = {
  '117': [{ cap: '밖에서 본 전면', src: '/photos/rooms/117-1.jpg' }, { cap: '인테리어 콘셉트 예시 · AI 생성', src: '/photos/rooms/117-concept.jpg' }],
  '118': [{ cap: '밖에서 본 전면', src: '/photos/rooms/118-1-1.jpg' }, { cap: '내부 · 안쪽에서 본 입구', src: '/photos/rooms/118-2-1.jpg' }, { cap: '내부 · 창 쪽', src: '/photos/rooms/118-2-2.jpg' }, { cap: '옆에서 본 전면', src: '/photos/rooms/118-1-2.jpg' }],
  '119': [{ cap: '밖에서 본 전면', src: '/photos/rooms/119-1.jpg' }],
  '120': [{ cap: '밖에서 본 전면', src: '/photos/rooms/120-1.jpg' }],
  '122': [{ cap: '외부 · 정문 앞 코너', src: '/photos/rooms/122-ext1.jpg' }, { cap: '외부 · 거리 쪽', src: '/photos/rooms/122-ext2.jpg' }, { cap: '내부 · 홍보관', src: '/photos/rooms/122-in1.jpg' }, { cap: '내부 · 창 쪽', src: '/photos/rooms/122-in2.jpg' }],
  '126': [{ cap: '밖에서 본 전면', src: '/photos/rooms/126-1.jpg' }, { cap: '내부', src: '/photos/rooms/126-2.jpg' }],
  '127': [{ cap: '밖에서 본 전면', src: '/photos/rooms/127-1.jpg' }, { cap: '내부 · 안쪽에서 본 입구', src: '/photos/rooms/127-2-2.jpg' }, { cap: '내부 · 안쪽 벽', src: '/photos/rooms/127-2-1.jpg' }, { cap: '내부 · 천장 설비', src: '/photos/rooms/127-2-3.jpg' }],
  '128': [{ cap: '밖에서 본 전면', src: '/photos/rooms/128-1.jpg' }, { cap: '내부', src: '/photos/rooms/128-2.jpg' }],
  '129': [{ cap: '밖에서 본 전면', src: '/photos/rooms/129-1-2.jpg' }, { cap: '내부', src: '/photos/rooms/129-2-1.jpg' }, { cap: '내부 · 창 쪽', src: '/photos/rooms/129-2-2.jpg' }, { cap: '102동 코너 전경', src: '/photos/rooms/129-1-1.jpg' }],
  '132': [{ cap: '밖에서 본 전면', src: '/photos/rooms/132-1.jpg' }],
  '136': [{ cap: '밖에서 본 전면', src: '/photos/rooms/136-1.jpg' }],
  '137': [{ cap: '밖에서 본 전면', src: '/photos/rooms/137-1.jpg' }, { cap: '내부', src: '/photos/rooms/137-2-1.jpg' }, { cap: '입구에서 본 내부', src: '/photos/rooms/137-2-2.jpg' }, { cap: '내부 · 창 쪽 기둥', src: '/photos/rooms/137-2-3.jpg' }],
  '139': [{ cap: '내부 · 코너 양면 유리', src: '/photos/rooms/139-2-1.jpg' }, { cap: '내부 · 출입문 쪽', src: '/photos/rooms/139-2-2.jpg' }, { cap: '내부 · 안쪽', src: '/photos/rooms/139-2-3.jpg' }, { cap: '가게 앞 보행로', src: '/photos/rooms/139-1.jpg' }],
};
const DEFAULT_SLOTS: Slot[] = [
  { cap: '빈 호실 내부' },
  { cap: '밖에서 본 전면' },
  { cap: '가게 앞 동선 (임시 투시도)', src: '/photos/hero-1.jpg' },
  { cap: '주변 · 단지 전경 (임시 투시도)', src: '/photos/hero-4.jpg' },
];

const TAG: Record<TagKey, { text: string; cls: string }> = {
  open:     { text: '입점 가능',   cls: 'bg-[#FFF1E8] text-[#9A3412]' },
  saleopen: { text: '분양 가능',   cls: 'bg-[#FFF1E8] text-[#9A3412]' },
  consult:  { text: '입점 협의',   cls: 'bg-[#FFF1E8] text-[#9A3412]' },
  nego:     { text: '협의 중',     cls: 'bg-white text-[#3F3F46] border border-dashed border-[#71717A]' },
  done:     { text: '입점 확정',   cls: 'bg-[#DDE1EC] text-[#0F1C3A]' },
  work:     { text: '인테리어 시작', cls: 'bg-[#D9F3EF] text-[#0F6F68]' },
  soon:     { text: '오픈 예정',   cls: 'bg-[#7FD3CB] text-[#0B3B37]' },
  income:   { text: '수익형',      cls: 'bg-[#0F1C3A] text-white' },
  reserved: { text: '분양 협의 중', cls: 'bg-[#E4E4E7] text-[#3F3F46]' },
  saleonly: { text: '분양 전용',   cls: 'bg-[#E4E4E7] text-[#3F3F46]' },
  rentonly: { text: '임대 전용',   cls: 'bg-[#E4E4E7] text-[#3F3F46]' },
};

const SIZES: [string, string][] = [['all', '전체'], ['10', '10평대'], ['20', '20평대'], ['30', '30평 이상']];
const USES: [string, string][] = [['all', '전체'], ['pharmacy', '약국'], ['food', '음식점·카페'], ['bar', '주점'], ['office', '사무실'], ['edu', '교육·운동'], ['service', '미용·서비스'], ['pet', '반려동물']];

// 배치도 좌표 (1100 × 520 기준) [x, y, 너비, 높이]
// 칸 크기는 분양 테이블의 전용면적(㎡)에 비례합니다 (같은 줄은 같은 깊이, 면적 1㎡ = 약 51.5칸²).
const POS: Record<string, [number, number, number, number]> = {
  '118': [132, 20, 104, 59.5], '119': [132, 81.5, 104, 96.3], '120': [132, 179.8, 104, 92.9], '122': [132, 402.2, 104, 72.4],
  '132': [244, 118, 46, 49.4], '117': [300, 20, 43.9, 62],
  '126': [441.8, 402, 66.5, 60], '127': [510.3, 402, 72.3, 60], '128': [584.6, 402, 46.8, 60], '129': [633.4, 402, 52.4, 60],
  '136': [944, 402, 50.5, 60], '137': [996.5, 402, 53.5, 60], '139': [1052, 341.1, 46, 58.9],
};
const TENANTS: [string, string, number, number, number, number][] = [
  ['약국', '121호 · 영업 중', 132, 274.6, 104, 125.6],
  ['메가커피', '123호', 300, 402, 37.1, 60], ['우지커피', '124호', 339.1, 402, 39.9, 60], ['본죽', '125호', 380.9, 402, 58.9, 60],
  ['', '133호', 847.5, 402, 31.5, 60], ['장호덕 손만두', '134·135호', 881, 402, 61.1, 60], ['CU', '138호', 1052, 402, 46, 60],
];
// "어떤 자리를 찾으세요?" 고르기 목록 (임대 탭)
// - title: 버튼에 보이는 말 / info·note: 펼쳤을 때 요약 / why: 이유 두 줄
// - crop: 작은 확대 지도에 보여 줄 범위 [x, y, 너비, 높이] (배치도 1100 × 520 기준)
// 호실이 계약되면 이 목록에서도 빼 주세요. 금액·면적은 위 ROOMS 와 같게 맞춰 주세요.
type Spot = { ids: string[]; title: string; info: string; note: string; why: string[]; crop: [number, number, number, number] };
const SPOTS: Spot[] = [
  { ids: ['126', '127', '128'], title: '메인 먹거리 라인', info: '126·127·128호 · 전용 16~25평 · 월 270~350만', note: '보증금 5,000만 · 부가세 별도',
    why: ['메가커피·본죽·닭한상 손님이 함께 지나가는 상가 줄이에요', '밖에서 바로 보이고 주차장 입구와 가까워요'], crop: [372, 330, 330, 180] },
  { ids: ['118'], title: '약국 라인 옆 음식점 자리', info: '118호 · 전용 36평 · 월 350만', note: '보증금 5,000만 · 부가세 별도 · 가장 큰 자리',
    why: ['병원 정문에서 약국으로 이어지는 길 위에 있어요', '홀 좌석을 넉넉히 둘 수 있는 큰 면적이에요'], crop: [0, -40, 380, 320] },
  { ids: ['122'], title: '정문 앞 코너 약국', info: '122호 · 전용 44평 · 약국 자리', note: '현재 분양홍보관 자리 · 입점 시기 협의',
    why: ['병원 정문에서 가장 가까운 호실 가운데 하나예요', '약국 중 유일하게 임차로 들어올 수 있는 자리예요'], crop: [0, 270, 430, 250] },
  { ids: ['117'], title: '병원 길 앞 1:1 레슨 자리', info: '117호 · 전용 16평 · 월 170만', note: '보증금 3,000만 · 부가세 별도 · 1:1 필라테스 등 예약제 업종 추천',
    why: ['손님이 일부러 찾아오는 예약제 업종에 맞는 자리예요', '외래 하루 800명이 지나는 병원 앞 길에서 간판이 바로 보여요'], crop: [0, -40, 400, 320] },
  { ids: ['132'], title: '중앙 정원 앞 소형칸', info: '132호 · 전용 13평 · 월 140만', note: '보증금 3,000만 · 부가세 별도',
    why: ['단지 중앙 정원에 붙어 있어 입주민이 오가는 길목이에요', '1인 미용실·교습소처럼 예약제로 운영하는 업종에 맞아요'], crop: [170, 70, 360, 240] },
  { ids: ['136', '137', '139'], title: 'CU 옆자리', info: '136·137·139호 · 전용 16~19평 · 월 240~250만', note: '보증금 5,000만 · 부가세 별도 · 136·137호는 합쳐서도 가능',
    why: ['CU 옆이라 저녁에도 사람이 오가요', '호프·이자카야 같은 저녁 업종에 맞아요'], crop: [800, 300, 300, 190] },
];

const pct = (x: number, y: number, w: number, h: number): CSSProperties => ({
  left: `${(x / 11).toFixed(2)}%`, top: `${(y / 5.2).toFixed(2)}%`, width: `${(w / 11).toFixed(2)}%`, height: `${(h / 5.2).toFixed(2)}%`,
});

const MODE_COLOR = {
  rent: { bg: '#1F4E3D', fg: '#FFFFFF', line: '#1F4E3D', glow: 'rgba(31,78,61,0.45)' },
  sale: { bg: '#7FD3CB', fg: '#0B3B37', line: '#2FA69A', glow: 'rgba(47,166,154,0.45)' },
};

const okIn = (r: Room, mode: Mode) => (mode === 'sale' ? r.saleOK !== false : r.rentOK !== false);
const pageOf = (id: string) => Math.max(0, PAGES.findIndex((p) => p.includes(id)));
const findRoom = (id: string) => ROOMS.find((r) => r.id === id)!;
const roomName = (r: Room) => r.name || `${r.id}호`;

function scrollToId(id: string) {
  window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
}

export default function StoreUnits() {
  const [mode, setMode] = useState<Mode>('rent');
  const [size, setSize] = useState('all');
  const [use, setUse] = useState('all');
  const [sel, setSel] = useState('118');
  const [spot, setSpot] = useState(0);          // PC: 위에서 고른 자리
  const [openSpot, setOpenSpot] = useState(-1); // 휴대폰: 펼친 자리 (-1 = 모두 접힘)
  const [showAll, setShowAll] = useState(false); // 휴대폰: 전체 배치도 펼치기
  const [page, setPage] = useState(0);
  const [ph, setPh] = useState(0);
  const [tick, setTick] = useState(0);   // 필터가 바뀔 때마다 강조 애니메이션 다시 재생
  const [flash, setFlash] = useState(0); // 상세 패널 반짝임
  const detailRef = useRef<HTMLElement>(null);

  const sale = mode === 'sale';
  const MC = MODE_COLOR[mode];
  const filtering = size !== 'all' || use !== 'all';
  const avail = (r: Room) => okIn(r, mode);
  const hit = (r: Room) => filtering && avail(r) && (size === 'all' || r.size === size) && (use === 'all' || r.uses.includes(use));
  const hits = ROOMS.filter(hit).length;
  const tagOf = (r: Room) => TAG[sale ? (r.saleTag || 'saleopen') : (r.rentTag || 'open')];
  const cur = findRoom(sel) || ROOMS[0];
  const ct = tagOf(cur);

  // 필터 변경: 조건에 맞는 첫 호실을 자동 선택하고 그 페이지로 이동
  const applyFilter = (next: { mode?: Mode; size?: string; use?: string }) => {
    const m = next.mode ?? mode, s = next.size ?? size, u = next.use ?? use;
    if (next.mode) setMode(next.mode);
    if (next.size) setSize(next.size);
    if (next.use) setUse(next.use);
    const f = s !== 'all' || u !== 'all';
    const first = f ? ROOMS.find((r) => okIn(r, m) && (s === 'all' || r.size === s) && (u === 'all' || r.uses.includes(u))) : undefined;
    if (first) { setSel(first.id); setPage(pageOf(first.id)); }
    setPh(0);
    setTick((t) => t + 1);
  };

  const openDetail = (id: string) => {
    setSel(id); setPage(pageOf(id)); setPh(0); setFlash((f) => f + 1);
    scrollToId('detail');
  };

  // 입점 캘린더의 "집중 모집" 카드에서 보내는 신호를 받아 해당 호실 상세를 엽니다.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<{ room?: string }>).detail?.room;
      if (id) openDetail(id);
    };
    window.addEventListener('store-open-room', onOpen);
    return () => window.removeEventListener('store-open-room', onOpen);
  }, []);

  const ask = () => {
    // 6단계 상담 폼이 이 이벤트를 받아 관심 호실을 미리 선택합니다.
    window.dispatchEvent(new CustomEvent('store-ask', { detail: { room: cur.id } }));
    try { sessionStorage.setItem('storeAskRoom', cur.id); } catch { /* 무시 */ }
    scrollToId(document.getElementById('consult-form') ? 'consult-form' : 'contact');
  };

  const slots = ROOM_PHOTOS[cur.id] || DEFAULT_SLOTS;
  const pi = Math.min(ph, slots.length - 1);
  const shot = slots[pi];

  const priceShort = (r: Room) => {
    if (sale) {
      const m = /분양가\s*(.+?)\s*원/.exec(r.sale);
      return m ? m[1] : r.saleOK === false ? '분양 협의 중' : '분양가 문의';
    }
    const m = /보증금\s*([\d,]+)만\s*·\s*월\s*([\d,]+만)/.exec(r.rent);
    return m ? `${m[1]} / ${m[2]}` : r.rentOK === false ? (r.rentTag === 'saleonly' ? '분양만 가능' : '임차 완료') : '임대 조건 협의';
  };
  const pointShort = (r: Room) => {
    const ps = r.point.split(' · ');
    return ps[0] === '외부 노출' && ps.length > 1 ? ps[ps.length - 1] : ps[0];
  };

  const hitCls = (on: boolean) => (on ? (tick % 2 ? 'su-hit' : 'su-hit su-hit-b') : '');
  const pagesHit = useMemo(() => PAGES.map((p) => filtering && p.some((id) => hit(findRoom(id)))), [filtering, size, use, mode]); // eslint-disable-line react-hooks/exhaustive-deps


  // 배치도: vertical=true 이면 휴대폰용 세로 배치도 (병원이 위쪽)
  // 색은 두 가지만: 주황 = 입점 가능 / 회색 = 그 밖의 칸. 가게 이름은 위치를 찾는 기준(랜드마크)으로만 보여 줍니다.
  // hl: 고른 자리 호실들(진한 주황) / mini: 작은 확대 지도용 (말풍선 없음)
  const renderPlan = (vertical: boolean, hl?: string[], mini?: boolean) => {
    const W = vertical ? 520 : 1100, H = vertical ? 1100 : 520;
    const T = (x: number, y: number, w: number, h: number): [number, number, number, number] => (vertical ? [520 - y - h, x, h, w] : [x, y, w, h]);
    const at = (x: number, y: number, w: number, h: number): CSSProperties => {
      const [a, b, c, d] = T(x, y, w, h);
      return { left: `${(a / W) * 100}%`, top: `${(b / H) * 100}%`, width: `${(c / W) * 100}%`, height: `${(d / H) * 100}%` };
    };
    const pt = (x: number, y: number): CSSProperties => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

    // 말풍선: 고른 자리가 있으면 "여기예요", 없으면 "지금 보는 자리" (휴대폰·작은 지도는 없음)
    const pin = (() => {
      if (vertical || mini) return null;
      const ids = hl ? (hl.length > 2 ? hl : [hl[0]]) : [sel];
      const ps = ids.map((id) => POS[id]).filter(Boolean);
      if (!ps.length) return null;
      const x0 = Math.min(...ps.map((p) => p[0])), x1 = Math.max(...ps.map((p) => p[0] + p[2]));
      const y0 = Math.min(...ps.map((p) => p[1])), y1 = Math.max(...ps.map((p) => p[1] + p[3]));
      const text = hl ? '여기예요' : '지금 보는 자리';
      return y0 < 40
        ? <span aria-hidden="true" className="su-pin su-pin-b absolute" style={pt((x0 + x1) / 2, y1 + 8)}>▲ {text}</span>
        : <span aria-hidden="true" className="su-pin absolute" style={pt((x0 + x1) / 2, y0 - 8)}>{text} ▼</span>;
    })();

    return (
      <div role="group" aria-label="1층 상가 배치도" className={`su-plan relative w-full overflow-hidden rounded-[6px] border border-[#ECEBE8] ${vertical ? 'su-v aspect-[520/820]' : 'aspect-[1100/520]'}`}>
        {/* 병원 */}
        <div aria-hidden="true" className="su-hosp absolute" style={at(0, 0, 92, 520)}>
          <img src="/photos/stores/hospital-1.jpg" alt="" loading="lazy" />
          <span className="su-hosp-t"><strong>수원덕산병원</strong><span>439병상 종합병원</span></span>
        </div>
        <span aria-hidden="true" className="su-gate absolute"
          style={vertical ? { left: `${(14 / W) * 100}%`, top: `${(26 / H) * 100}%`, width: `${(116 / W) * 100}%`, height: `${(40 / H) * 100}%` } : at(8, 420, 90, 38)}>{vertical ? '병원 정문 ▼' : '병원 정문 ▶'}</span>

        {/* 병원 앞 길 */}
        <span aria-hidden="true" className="su-walk absolute" style={at(102, 16, 22, 488)} />
        <span aria-hidden="true" className="su-walk absolute" style={at(102, 486, 460, 20)} />
        <span aria-hidden="true" className={`su-walklb absolute ${vertical ? '' : '[writing-mode:vertical-rl]'}`} style={vertical ? at(102, 120, 22, 260) : at(102, 170, 22, 200)}>병원 앞 길</span>

        {/* 건물 윤곽 */}
        {([[128, 16, 112, 462], [240, 114, 54, 245], [296, 16, 52, 70], [296, 398, 393, 68], [843, 398, 257, 68], [1048, 337, 52, 63]] as [number, number, number, number][]).map((b, i) => (
          <span key={i} aria-hidden="true" className="su-bldg absolute" style={at(...b)} />
        ))}

        {/* 중앙 정원 · 주차장 입구 */}
        <span aria-hidden="true" className="su-park absolute" style={vertical ? { ...at(450, 180, 130, 130), height: 'auto', aspectRatio: '1 / 1' } : at(440, 170, 150, 150)}>
          <img src="/photos/hero-5.jpg" alt="" loading="lazy" />
          <span>중앙 정원</span>
        </span>
        <span aria-hidden="true" className="su-car absolute" style={at(696, 400, 72, 64)}>주차장<br />입구</span>

        {/* 이름 없이 회색으로만 두는 칸 (130호, 131호, 101동) */}
        {([[244, 169.4, 46, 104.3], [244, 275.6, 46, 77.8], [362, 16, 734, 72]] as [number, number, number, number][]).map((b, i) => (
          <span key={i} aria-hidden="true" className="su-tile su-blank absolute" style={at(...b)} />
        ))}

        {/* 영업 중인 가게 (이름이 빈 칸은 회색만) */}
        {TENANTS.map(([name, sub, x, y, w, h]) => (
          <span key={sub} aria-label={name ? `${sub} ${name}` : sub} className={`su-tile absolute ${name ? 'su-busy' : 'su-blank'} ${!vertical && w < 42 ? 'su-vt' : ''}`} style={at(x, y, w, h)}>
            {name && <span className="su-tn">{name}</span>}
          </span>
        ))}

        {/* 호실 */}
        {ROOMS.map((r) => {
          const isHit = hit(r);
          const ok = avail(r);
          const isSel = r.id === sel;
          const t = tagOf(r);
          const off = !ok && (r.rentTag === 'saleonly' || r.saleTag === 'rentonly' || r.saleTag === 'reserved');
          const busy = !ok && !off;
          const look = busy ? 'su-busy' : off ? 'su-blank' : hl
            ? (hl.includes(r.id) ? 'su-free su-av su-pick' : 'su-free su-av')
            : `su-free su-av${filtering && !isHit ? ' su-dim' : ''}${isHit ? ' su-hl' : ''}`;
          const label = busy ? (r.id === '129' ? '닭한상' : roomName(r)) : off ? (r.mapName || '') : r.id === '122' ? (vertical ? '약국' : '약국 자리') : `${r.id}호`;
          return (
            <button
              key={r.id} type="button" aria-pressed={isSel} aria-label={`${roomName(r)} ${t.text}`}
              onClick={() => {
                if (vertical || mini) { openDetail(r.id); return; }
                setSel(r.id); setPage(pageOf(r.id)); setPh(0);
                const k = SPOTS.findIndex((p) => p.ids.includes(r.id));
                if (k >= 0) setSpot(k);
              }}
              className={`su-tile su-room absolute cursor-pointer border-0 ${look} ${isSel && !hl && !vertical ? 'su-sel' : ''} ${hl ? '' : hitCls(isHit)}`}
              style={at(...POS[r.id])}
            >
              {label && <span className={busy || off ? 'su-tn' : 'su-rn'}>{label}</span>}
            </button>
          );
        })}

        {pin}
      </div>
    );
  };

  // 작은 확대 지도: 고른 자리 주변만 잘라서 보여 줌
  const renderMini = (p: Spot) => {
    const [cx, cy, cw, ch] = p.crop;
    const ps = (p.ids.length > 2 ? p.ids : [p.ids[0]]).map((id) => POS[id]);
    const x0 = Math.min(...ps.map((q) => q[0])), x1 = Math.max(...ps.map((q) => q[0] + q[2])), y0 = Math.min(...ps.map((q) => q[1]));
    return (
      <div className="su-mini relative overflow-hidden rounded-[8px]" style={{ aspectRatio: `${cw} / ${ch}` }}>
        <div className="absolute" style={{ width: `${(1100 / cw) * 100}%`, left: `${(-cx / cw) * 100}%`, top: `${(-cy / ch) * 100}%` }}>
          {renderPlan(false, p.ids, true)}
        </div>
        <span aria-hidden="true" className="su-pin absolute" style={{ left: `${(((x0 + x1) / 2 - cx) / cw) * 100}%`, top: `max(30px, ${((y0 - cy) / ch) * 100 - 2}%)` }}>여기예요</span>
        {cx > 92 && <span aria-hidden="true" className="su-hint absolute">← 병원 쪽</span>}
      </div>
    );
  };

  // 색 안내 (칸 안에는 상태 글씨를 쓰지 않고 색으로만 구분)
  const renderLegend = (picked: boolean) => (
    <div aria-hidden="true" className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#52525B]">
      {picked && <span className="inline-flex items-center gap-[6px]"><span className="su-lg" style={{ background: '#FF671D' }} />고른 자리</span>}
      <span className="inline-flex items-center gap-[6px]"><span className="su-lg" style={{ background: '#FFE9DA', boxShadow: 'inset 0 0 0 1.5px #FF671D' }} />{sale ? '분양 가능' : '입점 가능'}</span>
      <span className="inline-flex items-center gap-[6px]"><span className="su-lg" style={{ background: '#E7E8EC', boxShadow: 'inset 0 0 0 1px #D6D9E0' }} />{sale ? '분양 안 되는 칸' : '임대 안 되는 칸 (영업 중 등)'}</span>
    </div>
  );

  // 고른 자리 요약 + 이유 + 버튼
  const renderSpotInfo = (p: Spot) => (
    <div className="flex flex-col">
      <p className="m-0 mt-3 text-[16px] font-bold text-[#1C1C1E] lg:text-[18px]">{p.info}</p>
      <p className="m-0 mt-[2px] text-[13px] text-[#71717A]">{p.note}</p>
      <ul className="m-0 mt-[10px] flex list-none flex-col gap-1 p-0">
        {p.why.map((w) => <li key={w} className="su-why">{w}</li>)}
      </ul>
      <div className="mt-[14px] grid grid-cols-2 gap-2 lg:max-w-[420px]">
        <button type="button" onClick={() => openDetail(p.ids[0])} className="su-act su-act-1">자세히 보기</button>
        <a href="tel:031-293-1073" className="su-act su-act-2">전화 문의</a>
      </div>
    </div>
  );

  const toggleSpot = (i: number) => {
    const n = openSpot === i ? -1 : i;
    setOpenSpot(n);
    if (n >= 0) window.setTimeout(() => document.getElementById(`spot-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  };
  const pickSpot = (i: number) => {
    setSpot(i);
    const id = SPOTS[i].ids[0];
    setSel(id); setPage(pageOf(id)); setPh(0);
  };
  return (
    <>
      <style>{CSS}</style>
      <section id="units" className="mx-auto flex max-w-[1280px] scroll-mt-[72px] flex-col gap-6 px-5 pt-16 pb-12 sm:px-10 sm:pt-[88px]">
        <div className="flex flex-col gap-[14px]">
          <p className="m-0 text-[13px] font-extrabold tracking-[2px] text-[#D24A0E]">STORE CURATION</p>
          <h2 className="m-0 text-[30px] font-extrabold tracking-[-1px] sm:text-[36px]">입점추천</h2>
          <span aria-hidden="true" className="h-1 w-16 bg-[#FF6F00]" />
          <p className="mt-[6px] mb-0 text-[16px] text-[#3F3F46] sm:text-[17px]">
            <strong className="text-[#1C1C1E]">원하시는 평수와 업종을 선택해 주세요.</strong> 해당하는 호실이 표시되고, 호실을 누르면 상세 조건을 보실 수 있습니다.
          </p>
        </div>

        {/* 임대 / 분양 탭 */}
        <div role="tablist" aria-label="거래 방식" className="grid w-full max-w-[560px] grid-cols-2 self-center border-b border-[#E4E4E7]">
          {([['rent', '임대', '창업하실 분 · 보증금과 월세'], ['sale', '분양', '투자하실 분 · 분양가와 임차 현황']] as [Mode, string, string][]).map(([k, label, hint]) => {
            const on = mode === k;
            return (
              <button
                key={k} type="button" role="tab" aria-selected={on}
                onClick={() => applyFilter({ mode: k })}
                className="su-tab -mb-px flex cursor-pointer flex-col items-center justify-center gap-1 border-0 bg-transparent px-2 pt-[14px] pb-4"
                style={{ borderBottom: `3px solid ${on ? (k === 'sale' ? '#2FA69A' : '#1F4E3D') : 'transparent'}`, color: on ? '#0F1C3A' : '#A1A1AA' }}
              >
                <span className="text-[20px] font-extrabold tracking-[-0.5px]">{label}</span>
                <span className="text-[12px] font-medium whitespace-nowrap text-[#71717A] sm:text-[13px]">{hint.split(' · ')[0]}<span className="hidden sm:inline"> · {hint.split(' · ')[1]}</span></span>
              </button>
            );
          })}
        </div>

        {/* 평수 / 업종 칩 */}
        <div className="flex flex-col gap-[10px] rounded-[6px] bg-[#F7F7F5] py-3 sm:gap-3 sm:px-6 sm:py-5">
          {([['평수', SIZES, size, (v: string) => applyFilter({ size: v })], ['업종', USES, use, (v: string) => applyFilter({ use: v })]] as [string, [string, string][], string, (v: string) => void][]).map(([label, list, val, pick]) => (
            <div key={label} className="flex items-center gap-2 pl-4 sm:pl-0">
              <span className="w-[40px] flex-none text-[13px] font-bold text-[#3F3F46] sm:w-[52px] sm:text-[14px]">{label}</span>
              <div className="relative min-w-0 flex-1">
                <div className="su-chips flex items-center gap-2 overflow-x-auto pr-12 sm:flex-wrap sm:overflow-visible sm:pr-0">
                  {list.map(([k, t]) => {
                    const on = val === k;
                    return (
                      <button
                        key={k} type="button" aria-pressed={on} onClick={(e) => { pick(k); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }}
                        className={`h-9 flex-none cursor-pointer rounded-[4px] border px-3 text-[13px] whitespace-nowrap sm:h-auto sm:min-h-10 sm:px-4 sm:text-[14px] ${on ? 'border-[#1C1C1E] bg-[#1C1C1E] font-bold text-white' : 'border-[#D4D4D8] bg-white text-[#1C1C1E]'}`}
                      >{t}</button>
                    );
                  })}
                </div>
                {/* 휴대폰: 오른쪽 끝 흐림 + 넘기기 버튼 (더 있다는 표시) */}
                <span aria-hidden="true" className="pointer-events-none absolute top-0 right-0 bottom-0 w-14 bg-gradient-to-l from-[#F7F7F5] from-40% to-transparent sm:hidden" />
                <button
                  type="button" aria-label={`${label} 더 보기`}
                  onClick={(e) => { const row = e.currentTarget.parentElement?.querySelector('.su-chips'); if (!row) return; const end = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4; row.scrollTo({ left: end ? 0 : row.scrollLeft + 160, behavior: 'smooth' }); }}
                  className="absolute top-1/2 right-2 inline-flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#D4D4D8] bg-white text-[#3F3F46] shadow-[0_2px_6px_rgba(0,0,0,0.12)] sm:hidden"
                >
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 1층 배치도 */}
        <div className="flex flex-col gap-[14px] rounded-[6px] border border-[#E4E4E7] bg-white px-4 pt-6 pb-5 sm:px-6">
          {!sale ? (
            <>
              {/* 임대: "어떤 자리를 찾으세요?" 고르기 */}
              <div className="flex flex-col gap-1">
                <p className="m-0 text-[21px] font-extrabold tracking-[-0.6px] sm:text-[22px]">어떤 자리를 찾으세요?</p>
                <p className="m-0 text-[15px] text-[#52525B]">누르시면 배치도에서 위치를 보여 드려요</p>
              </div>

              {/* 휴대폰: 누르면 그 자리에서 펼쳐짐 */}
              <div className="flex flex-col gap-[10px] lg:hidden">
                {SPOTS.map((p, i) => {
                  const on = openSpot === i;
                  return (
                    <div key={p.ids[0]} id={`spot-${i}`} className={`su-opt scroll-mt-[84px] ${on ? 'su-on' : ''}`}>
                      <button type="button" aria-expanded={on} onClick={() => toggleSpot(i)} className="su-opt-btn">
                        <span className="su-opt-t">{p.title}</span>
                        <span className="su-opt-n">{p.ids.join('·')}호</span>
                        <span aria-hidden="true" className="su-opt-c">›</span>
                      </button>
                      {on && <div className="px-4 pb-4">{renderMini(p)}{renderSpotInfo(p)}</div>}
                    </div>
                  );
                })}
                <button type="button" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)} className="su-all">
                  {showAll ? '전체 배치도 접기' : '전체 배치도 보기'}
                </button>
                {showAll && <div className="mx-auto flex w-full max-w-[420px] flex-col gap-2">{renderPlan(true)}{renderLegend(false)}</div>}
              </div>

              {/* PC: 위에서 고르고, 아래 배치도에서 위치 확인 */}
              <div className="hidden flex-col gap-4 lg:flex">
                <div className="grid grid-cols-3 gap-[10px]">
                  {SPOTS.map((p, i) => (
                    <button key={p.ids[0]} type="button" aria-pressed={spot === i} onClick={() => pickSpot(i)} className={`su-opt su-opt-pc ${spot === i ? 'su-on' : ''}`}>
                      <span className="su-opt-t">{p.title}</span>
                      <span className="su-opt-n">{p.ids.join('·')}호</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {renderPlan(false, SPOTS[spot].ids)}
                  {renderLegend(true)}
                </div>
                {renderSpotInfo(SPOTS[spot])}
              </div>
            </>
          ) : (
            <>
              {/* 분양: 전체 배치도 */}
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="m-0 text-[17px] font-extrabold">1층 배치도</p>
                <p className="m-0 text-[14px] text-[#3F3F46]"><b className="text-[#D24A0E]">주황색</b> 칸이 지금 분양 가능한 자리예요</p>
              </div>
              <div className="mx-auto w-full max-w-[420px] lg:hidden">{renderPlan(true)}</div>
              <div className="hidden lg:block">{renderPlan(false)}</div>
              {renderLegend(false)}
            </>
          )}
          <p className="m-0 text-[11px] text-[#A1A1AA]">이해를 돕기 위한 간략도이며 실제 비율과 다를 수 있어요</p>
        </div>

        {/* 결과 줄 */}
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#1C1C1E] pb-3">
          <p className="m-0 text-[15px]">
            전체 <strong>{ROOMS.length}개</strong> 호실
            {filtering && <span className="font-bold text-[#9A3412]">{hits ? ` · 조건에 맞는 호실 ${hits}곳` : ' · 선택하신 조건에 맞는 호실이 없습니다 · 전화 주시면 가능한 호실을 찾아 드립니다'}</span>}
          </p>
          <p className="m-0 text-[13px] text-[#71717A]">{sale ? '분양가는 부가세 포함 금액이에요 · 약국 외 호실은 시설비 지원 적용가' : '월세 부가세 별도 · 무권리 신축 · 금액은 업종과 계약 기간에 따라 조정 협의 가능'}</p>
        </div>

        {/* 호실 카드 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {PAGES[page].map((id) => {
            const r = findRoom(id);
            const isHit = hit(r);
            const ok = avail(r);
            const dim = !ok || (filtering && !isHit);
            const isSel = r.id === sel;
            const t = tagOf(r);
            const taken = !ok && !(r.rentTag === 'saleonly' || r.saleTag === 'rentonly' || r.saleTag === 'reserved');
            const [img, pos] = CARD_IMG[r.id] || ['/photos/hero-1.jpg', '50% 50%'];
            return (
              <a
                key={id} href="#detail" aria-current={isSel} aria-label={`${roomName(r)} 자세히 보기`}
                onClick={(e) => { e.preventDefault(); openDetail(r.id); }}
                className={`su-card flex flex-row gap-3 rounded-[6px] bg-white p-[10px] text-inherit no-underline sm:flex-col sm:gap-0 sm:px-3 sm:pt-3 sm:pb-4 ${hitCls(isHit)}`}
                style={{
                  border: isSel ? `2px solid ${MC.line}` : isHit ? '2px solid #FF6F00' : '1px solid #ECEBE8',
                  boxShadow: isSel ? `0 16px 34px -18px ${MC.glow}` : isHit ? '0 10px 26px -18px rgba(255,111,0,0.6)' : '0 6px 20px -16px rgba(15,28,58,0.35)',
                  opacity: dim && !isSel ? 0.5 : 1,
                }}
              >
                <span className="relative block aspect-[4/3] w-[124px] flex-none self-start overflow-hidden rounded-[4px] bg-[#E7E5E4] sm:w-full sm:self-stretch">
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/photos/hero-1.jpg'; }}
                    className="su-cimg absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: pos, filter: taken ? 'grayscale(0.7) brightness(0.92)' : undefined }}
                  />
                  <span className="absolute top-[6px] left-[6px] inline-flex h-[22px] items-center gap-[5px] rounded-[4px] bg-white/95 px-[7px] text-[11px] font-bold text-[#1C1C1E] sm:top-3 sm:left-3 sm:h-[26px] sm:gap-[6px] sm:px-[10px] sm:text-[12px]">
                    <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: taken ? '#0F1C3A' : ok ? '#FF6F00' : '#A1A1AA' }} />{t.text}
                  </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-none sm:gap-[6px] sm:px-1 sm:pt-4">
                  <span className="flex flex-col gap-[2px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-[10px]">
                    <span className="text-[18px] font-extrabold tracking-[-0.5px] text-[#0F1C3A] sm:text-[20px]">{roomName(r).replace(/ \(.*\)/, '')}</span>
                    <span className="text-[15px] font-extrabold whitespace-nowrap text-[#0F1C3A] sm:text-[16px]">{priceShort(r)}</span>
                  </span>
                  <span className="text-[12px] text-[#71717A] sm:text-[13px]">{r.useTitle}</span>
                  <span className="text-[12px] text-[#52525B] sm:hidden">{r.area.split(' · ')[0]} · {pointShort(r)}</span>
                </span>
                <span className="mx-1 mt-[14px] hidden flex-wrap gap-x-4 gap-y-[6px] border-t border-[#ECEBE8] pt-3 text-[12px] text-[#52525B] sm:flex">
                  <span className="inline-flex items-center gap-[5px]"><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 9h16M9 4v16" /></svg>{r.area.split(' · ')[0]}</span>
                  <span className="inline-flex items-center gap-[5px]"><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V8l7-4 7 4v13" /><path d="M10 21v-6h4v6" /></svg>{r.size === '30' ? '30평 이상' : `${r.size}평대`}</span>
                  <span className="inline-flex items-center gap-[5px]"><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>{pointShort(r)}</span>
                </span>
              </a>
            );
          })}
        </div>

        {/* 페이지 */}
        <nav aria-label="호실 목록 페이지" className="flex items-center justify-center gap-[6px] pt-2">
          <button type="button" aria-label="이전 페이지" aria-disabled={page === 0} onClick={() => setPage(Math.max(0, page - 1))} className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-transparent" style={{ color: page === 0 ? '#D4D4D8' : '#3F3F46' }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          {PAGES.map((_, i) => {
            const on = i === page;
            const has = pagesHit[i];
            return (
              <button key={i} type="button" aria-current={on ? 'page' : undefined} aria-label={`${i + 1}페이지${has ? ', 조건에 맞는 호실 있음' : ''}`} onClick={() => setPage(i)}
                className="relative h-10 min-w-10 cursor-pointer rounded-[20px] border-0 text-[16px]"
                style={{ background: on ? '#1C1C1E' : 'transparent', color: on ? '#FFFFFF' : '#52525B', fontWeight: on ? 800 : 500 }}>
                {i + 1}
                {has && !on && <span aria-hidden="true" className="absolute top-[6px] right-[6px] h-[7px] w-[7px] rounded-full bg-[#FF6F00]" />}
              </button>
            );
          })}
          <button type="button" aria-label="다음 페이지" aria-disabled={page === PAGES.length - 1} onClick={() => setPage(Math.min(PAGES.length - 1, page + 1))} className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-transparent" style={{ color: page === PAGES.length - 1 ? '#D4D4D8' : '#3F3F46' }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </nav>
      </section>

      {/* ───────── 호실 상세 ───────── */}
      <section id="detail" ref={detailRef} aria-live="polite" className="mx-auto max-w-[1280px] scroll-mt-[96px] px-5 pt-2 pb-16 sm:px-10">
        <article
          key={flash}
          className={`grid grid-cols-1 gap-x-10 gap-y-7 rounded-[6px] border border-[#E4E4E7] bg-white px-5 py-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)] sm:px-9 sm:py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] ${flash ? 'su-flash' : ''}`}
        >
          {/* 사진 */}
          <div className="flex min-w-0 flex-col gap-[10px]">
            <div role="group" aria-roledescription="사진 슬라이드" aria-label={`${roomName(cur)} 사진`} className="su-ph relative aspect-[16/11] overflow-hidden rounded-[6px]">
              {shot.src ? (
                <img src={shot.src} alt={`${cur.id}호 ${shot.cap}`} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-[#71717A]">
                  <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
                  <span className="text-[16px] font-bold text-[#3F3F46]">{shot.cap}</span><span className="text-[13px]">사진 준비 중</span>
                </span>
              )}
              <span className="absolute bottom-[14px] left-[14px] rounded-[6px] bg-[rgba(28,28,30,0.78)] px-3 py-[6px] text-[13px] font-bold text-white">{shot.cap}</span>
              {slots.length > 1 && <span className="absolute top-[14px] right-[14px] rounded-[6px] bg-white/90 px-[10px] py-1 text-[12px] font-bold text-[#3F3F46]">{pi + 1} / {slots.length}</span>}
              {slots.length > 1 && ([['이전 사진', -1, 'left-3', 'M15 18l-6-6 6-6'], ['다음 사진', 1, 'right-3', 'M9 18l6-6-6-6']] as [string, number, string, string][]).map(([lb, dir, side, d]) => (
                <button key={lb} type="button" aria-label={lb} onClick={() => setPh((pi + dir + slots.length) % slots.length)}
                  className={`absolute top-1/2 ${side} inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-white/90 text-[#1C1C1E] shadow-[0_2px_8px_rgba(0,0,0,0.15)]`}>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
                </button>
              ))}
            </div>
            {slots.length > 1 && <div className={`grid gap-2 ${slots.length <= 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {slots.map((t, k) => (
                <button key={k} type="button" aria-pressed={k === pi} aria-label={t.cap} onClick={() => setPh(k)}
                  className={`relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[6px] p-0 ${t.src ? 'bg-[#D6D3D1]' : 'su-ph'}`}
                  style={{ border: k === pi ? '2px solid #1C1C1E' : '2px solid transparent', opacity: k === pi ? 1 : 0.8 }}>
                  {t.src && <img src={t.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                  <span className="absolute right-0 bottom-0 left-0 overflow-hidden bg-white/90 px-[6px] py-1 text-center text-[11px] font-bold text-ellipsis whitespace-nowrap text-[#3F3F46]">{t.cap}</span>
                </button>
              ))}
            </div>}
            {!ROOM_PHOTOS[cur.id] && <p className="m-0 text-[12px] text-[#A1A1AA]">투시도가 들어간 사진은 임시예요. 실제 호실 사진으로 바꿀 예정이에요.</p>}
          </div>

          {/* 정보 */}
          <div className="flex min-w-0 flex-col gap-[14px]">
            <div className="flex items-center gap-3">
              <h3 className="m-0 text-[26px] font-extrabold tracking-[-0.8px] sm:text-[30px]">{roomName(cur)}</h3>
              <span className={`inline-block rounded-[4px] px-[10px] py-1 text-center text-[12px] font-bold ${ct.cls}`}>{ct.text}</span>
            </div>
            <dl className="m-0 grid grid-cols-[80px_minmax(0,1fr)] gap-x-[14px] gap-y-3 text-[15px] leading-[1.55] sm:grid-cols-[92px_minmax(0,1fr)]">
              <dt className="text-[#71717A]">면적</dt><dd className="m-0 font-bold">{cur.area}</dd>
              <dt className="text-[#71717A]">임대 조건</dt><dd className="m-0">{cur.rent}</dd>
              <dt className="text-[#71717A]">분양 조건</dt><dd className="m-0">{cur.sale}</dd>
              <dt className="text-[#71717A]">임차 현황</dt><dd className="m-0">{cur.tenant}</dd>
              <dt className="text-[#71717A]">추천 업종</dt><dd className="m-0">{cur.useText}</dd>
            </dl>
            <button type="button" onClick={ask} className="su-ask mt-1 inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border-0 text-[16px] font-extrabold text-white">
              {roomName(cur)} 상담 신청하기
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
            <div className="mt-1 flex min-w-0 flex-col gap-[10px] rounded-[6px] bg-[#F7F7F5] px-5 py-5 sm:px-[22px]">
              <p className="m-0 text-[16px] font-extrabold">왜 이 자리에 이 업종인가</p>
              <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
                {cur.why.map((w) => (
                  <li key={w} className="flex gap-[10px] text-[15px] leading-[1.55] text-[#27272A]">
                    <span aria-hidden="true" className="mt-[9px] h-[6px] w-[6px] flex-none rounded-full bg-[#C2410C]" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

const CSS = `
.su-plan{background:#FAF9F6;container-type:inline-size}
.su-hosp{display:flex;align-items:center;justify-content:center;overflow:hidden;background:#E9ECF2}
.su-hosp img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.28}
.su-hosp-t{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;line-height:1.25}
.su-hosp-t strong{font-size:min(16px,1.25cqw);font-weight:800;letter-spacing:-.4px;color:#0F1C3A}
.su-hosp-t span{font-size:min(11.5px,.95cqw);font-weight:600;color:#3F4A63}
.su-gate{z-index:3;display:flex;align-items:center;justify-content:center;border-radius:999px;background:#0F1C3A;color:#fff;font-size:12.5px;font-weight:800;white-space:nowrap;box-shadow:0 4px 10px -4px rgba(15,28,58,.5)}
.su-walk{background:#DCEFEB}
.su-walklb{display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;letter-spacing:1px;color:#0F6F68;white-space:nowrap}
.su-bldg{box-sizing:border-box;background:#F1F2F5;border:1.5px solid #D6D9E0;border-radius:4px}
.su-park{display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:50%}
.su-park img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:46% 65%}
.su-park span{position:relative;border-radius:999px;background:rgba(255,255,255,.88);padding:3px 10px;font-size:12px;font-weight:700;color:#3F6B4A}
.su-car{box-sizing:border-box;display:flex;align-items:center;justify-content:center;text-align:center;line-height:1.3;border:1.5px dashed #B4B8C2;border-radius:4px;color:#71717A;font-size:11px;font-weight:600}
.su-tile{box-sizing:border-box;padding:2px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-align:center;line-height:1.15;white-space:nowrap;border-radius:4px;font-family:inherit;overflow:hidden}
.su-free{background:#FFE9DA;color:#B23C05;box-shadow:inset 0 0 0 2px #FF671D}
.su-free.su-hl{background:#FFD9BF}
.su-free.su-dim{background:#FFFFFF;color:#E2A47C;box-shadow:inset 0 0 0 1px #F5CDB0}
.su-busy{background:#E7E8EC;color:#52525B;box-shadow:inset 0 0 0 1px #D6D9E0}
.su-blank{background:#ECEDF0;color:#52525B;box-shadow:inset 0 0 0 1px #DEE0E6}
.su-sel{z-index:2;box-shadow:0 0 0 3px #FFFFFF,0 0 0 6px #0F1C3A}
.su-free.su-sel{box-shadow:inset 0 0 0 2px #FF671D,0 0 0 3px #FFFFFF,0 0 0 6px #0F1C3A}
.su-rn{font-size:min(16px,1.45cqw);font-weight:800;letter-spacing:-.4px}
.su-tn{font-size:min(12.5px,1.15cqw);font-weight:700;letter-spacing:-.3px;white-space:normal;word-break:keep-all}
.su-vt .su-tn{writing-mode:vertical-rl;letter-spacing:0}
.su-ts{font-size:min(11px,1cqw);font-weight:700;color:#C2410C}
.su-pin{z-index:4;transform:translate(-50%,-100%);border-radius:999px;background:#0F1C3A;color:#fff;padding:4px 9px;font-size:11px;font-weight:800;white-space:nowrap;pointer-events:none}
.su-pin-b{transform:translate(-50%,0)}
.su-v .su-rn{font-size:12px;letter-spacing:-.5px}.su-v .su-tn{font-size:9.5px}.su-v .su-ts{display:none}
.su-v .su-hosp-t strong{font-size:14px}.su-v .su-hosp-t span{font-size:10.5px}.su-v .su-gate{font-size:11px}.su-v .su-walklb{font-size:11px}.su-v .su-car{font-size:10px}.su-v .su-park span{font-size:11px;padding:2px 8px}
.su-lg{display:inline-block;width:14px;height:14px;border-radius:3px}
.su-free.su-pick{z-index:2;background:#FF671D;color:#fff;box-shadow:0 0 0 3px #fff,0 0 0 5px #FF671D}
.su-pick .su-ts{color:#fff}
.su-opt{box-sizing:border-box;border:1.5px solid #E4E4E7;border-radius:10px;background:#fff;overflow:hidden;transition:border-color .15s,box-shadow .15s}
.su-opt.su-on{border-color:#FF671D;box-shadow:0 10px 24px -16px rgba(255,103,29,.7)}
.su-opt-btn,.su-opt-pc{display:flex;align-items:center;gap:12px;width:100%;min-height:62px;padding:12px 16px;background:none;font-family:inherit;text-align:left;cursor:pointer}
.su-opt-btn{border:0}
.su-opt-pc{min-height:58px;background:#fff}
.su-opt-pc:hover{border-color:#FF671D}
.su-opt-t{flex:1;min-width:0;font-size:18px;font-weight:800;letter-spacing:-.5px;color:#1C1C1E;word-break:keep-all}
.su-opt-n{font-size:13px;font-weight:700;color:#A1A1AA;white-space:nowrap}
.su-opt-c{flex:none;display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#F4F4F5;color:#71717A;font-size:14px;transition:transform .2s}
.su-on .su-opt-t{color:#B23C05}.su-on .su-opt-n{color:#C2410C}.su-on .su-opt-c{background:#FF671D;color:#fff;transform:rotate(90deg)}
.su-opt-btn:focus-visible,.su-opt-pc:focus-visible,.su-all:focus-visible,.su-act:focus-visible{outline:2px solid #0F1C3A;outline-offset:2px}
.su-all{align-self:center;margin-top:4px;padding:8px 12px;border:0;background:none;font-family:inherit;font-size:15px;font-weight:700;color:#3F3F46;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.su-mini{border:1px solid #ECEBE8;background:#FAF9F6}
.su-mini .su-plan{border:0;border-radius:0}
.su-hint{left:6px;bottom:6px;z-index:5;border-radius:4px;background:rgba(15,28,58,.78);padding:3px 8px;font-size:11px;font-weight:700;color:#fff}
.su-why{position:relative;padding-left:14px;font-size:15px;line-height:1.5;color:#27272A;word-break:keep-all}
.su-why:before{content:"";position:absolute;left:2px;top:9px;width:6px;height:6px;border-radius:50%;background:#C2410C}
.su-act{box-sizing:border-box;display:flex;align-items:center;justify-content:center;height:52px;border-radius:8px;font-family:inherit;font-size:16px;font-weight:800;text-decoration:none;cursor:pointer}
.su-act-1{border:1.5px solid #0F1C3A;background:#fff;color:#0F1C3A}
.su-act-2{border:0;background:#FF671D;color:#fff}
.su-chips{scrollbar-width:none}.su-chips::-webkit-scrollbar{display:none}
.su-room{transition:background .15s,color .15s}
.su-av:hover{background:#FF671D !important;color:#fff !important}
.su-av:hover .su-ts{color:#fff}
.su-room:focus-visible{outline:2px solid #0F1C3A;outline-offset:2px}
.su-tab{transition:color .2s ease,border-color .2s ease}
.su-tab:hover{color:#0F1C3A !important}
.su-tab:focus-visible{outline:2px solid #0F1C3A;outline-offset:-2px}
.su-card{transition:opacity .2s,box-shadow .25s,border-color .25s,transform .25s}
.su-card:hover{transform:translateY(-3px);box-shadow:0 18px 36px -18px rgba(15,28,58,.4) !important}
.su-cimg{transition:transform .5s ease}
.su-card:hover .su-cimg{transform:scale(1.04)}
.su-ph{background:repeating-linear-gradient(135deg,#EDEDEE 0 12px,#E5E5E7 12px 24px)}
.su-ask{background:#0F1C3A;box-shadow:0 10px 22px -12px rgba(15,28,58,.6);transition:background .15s ease,transform .1s ease}
.su-ask svg{transition:transform .2s ease}
.su-ask:hover{background:#1F4E3D;transform:translateY(-1px)}
.su-ask:hover svg{transform:translateX(4px)}
.su-ask:active{background:#163A2D;transform:scale(.98)}
.su-ask:focus-visible{outline:3px solid #7FD3CB;outline-offset:3px}
@keyframes suRingA{0%{box-shadow:0 0 0 0 rgba(194,65,12,.55)}70%{box-shadow:0 0 0 14px rgba(194,65,12,0)}100%{box-shadow:0 0 0 0 rgba(194,65,12,0)}}
@keyframes suRingB{0%{box-shadow:0 0 0 0 rgba(194,65,12,.55)}70%{box-shadow:0 0 0 14px rgba(194,65,12,0)}100%{box-shadow:0 0 0 0 rgba(194,65,12,0)}}
.su-hit{animation:suRingA 1.1s ease-out 3}
.su-hit-b{animation-name:suRingB}
@keyframes suFlash{0%{box-shadow:0 0 0 0 rgba(31,78,61,.5)}100%{box-shadow:0 0 0 18px rgba(31,78,61,0)}}
.su-flash{animation:suFlash .9s ease-out 2}
@media (prefers-reduced-motion:reduce){.su-hit,.su-flash{animation:none}.su-card,.su-cimg,.su-ask,.su-ask svg{transition:none}.su-card:hover,.su-card:hover .su-cimg{transform:none}}
`;
