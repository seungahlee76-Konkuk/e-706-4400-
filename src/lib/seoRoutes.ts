export const SITE_ORIGIN = 'https://elife-gosaek.com';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface RouteSeoMeta {
  path: string;
  title: string;
  description: string;
  canonical: string;
  breadcrumbs: BreadcrumbItem[];
  prerenderHtml: string;
}

const COMMON_HEADER = `
<header class="border-b border-gray-200 bg-white">
  <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
    <a href="/" class="text-lg font-extrabold tracking-tight text-[#0F1C3A]">e편한세상 시티 고색</a>
    <nav aria-label="주요 메뉴" class="flex flex-wrap gap-4 text-sm font-semibold text-gray-700">
      <a href="/store" class="hover:text-[#FF671D]">1층 상가</a>
      <a href="/store/location" class="hover:text-[#FF671D]">입지분석</a>
      <a href="/store/overview" class="hover:text-[#FF671D]">상가 사업개요</a>
      <a href="/officetel" class="hover:text-[#FF671D]">오피스텔</a>
      <a href="/officetel/units" class="hover:text-[#FF671D]">세대 안내</a>
      <a href="/officetel/overview" class="hover:text-[#FF671D]">오피스텔 사업개요</a>
      <a href="/officetel/people" class="hover:text-[#FF671D]">누가 사나요</a>
    </nav>
  </div>
</header>`;

const COMMON_FOOTER = `
<footer class="border-t border-gray-200 bg-[#0F1C3A] text-gray-200">
  <div class="mx-auto max-w-5xl space-y-2 px-6 py-8 text-sm">
    <p class="font-bold text-white">e편한세상 시티 고색 · 분양·임대 공식 안내 (상가고민해결사 · 루에나파트너스)</p>
    <p>현장·홍보관: 경기도 수원시 권선구 고색동 894-125번지 일대 / 서부로 1670번길 11-9 (100% 사전 예약제)</p>
    <p>대표 문의: <a href="tel:031-293-1073" class="font-bold text-[#FF671D] underline">031-293-1073</a> (연중무휴 10:00 ~ 18:00) · <a href="/privacy" class="underline">개인정보처리방침</a></p>
  </div>
</footer>`;

function wrapPage(innerHtml: string): string {
  return `<div class="min-h-screen bg-[#F5F5F0] text-gray-900">${COMMON_HEADER}<main class="mx-auto max-w-5xl space-y-8 px-6 py-12">${innerHtml}</main>${COMMON_FOOTER}</div>`;
}

export const ROUTE_META: Record<string, RouteSeoMeta> = {
  '/': {
    path: '/',
    title: 'e편한세상시티고색 | 덕산병원 앞 1층 상가 분양·임대',
    description:
      '수원덕산병원 정문 바로 앞, e편한세상 시티 고색 1층 상가를 분양·임대합니다. 오피스텔 430세대 단지 1층, 약국·베이커리부터 외식·주점·생활편의 업종까지 입점 호실과 84타입 3룸 오피스텔을 상담해 드립니다.',
    canonical: `${SITE_ORIGIN}/`,
    breadcrumbs: [{ name: '홈', item: `${SITE_ORIGIN}/` }],
    prerenderHtml: wrapPage(`
      <article class="space-y-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#0F1C3A]">e편한세상 시티 고색 · 상가 및 오피스텔 안내</h1>
        <p class="text-base leading-relaxed text-gray-700">
          경기도 수원시 권선구 고색동(수원덕산병원 정문 바로 앞)에 위치한 e편한세상 시티 고색 1층 근린생활시설 상가 분양·임대 및 전용 84㎡ 3룸 주거용 오피스텔 430세대 안내 페이지입니다.
        </p>
        <section class="grid gap-6 md:grid-cols-2">
          <div class="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
            <h2 class="text-xl font-bold text-[#0F1C3A]">1층 근린생활시설 (상가 분양·임대)</h2>
            <p class="text-sm text-gray-700">439병상 수원덕산병원 정문 앞 초밀착 입지, 오피스텔 430세대 고정 배후수요, 신축 무권리 1층 스트리트 상가(117~139호) 분양·임대 안내.</p>
            <p><a href="/store" class="font-bold text-[#FF671D] underline">1층 상가 자세히 보기 →</a></p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
            <h2 class="text-xl font-bold text-[#0F1C3A]">84타입 3룸 오피스텔 (430세대)</h2>
            <p class="text-sm text-gray-700">전 세대 전용 84㎡ 방 3개·욕실 2개 아파트 국민평형 크기. 시스템에어컨 4대·빌트인 김치냉장고 기본 제공, 청약 시 주택 수 미포함.</p>
            <p><a href="/officetel" class="font-bold text-[#FF671D] underline">84타입 오피스텔 자세히 보기 →</a></p>
          </div>
        </section>
      </article>
    `),
  },

  '/store': {
    path: '/store',
    title: 'e편한세상 시티 고색 근린생활시설 | 덕산병원 앞 1층 상가 분양·임대',
    description:
      '수원덕산병원 정문 앞 e편한세상 시티 고색 1층 상가 분양·임대 안내. 약국·메가커피·우지커피·본죽&비빔밥·장호덕 손만두·CU 영업 중, 닭한상 오픈 예정, 호실별 면적과 임대·분양 조건을 확인하세요.',
    canonical: `${SITE_ORIGIN}/store`,
    breadcrumbs: [
      { name: '홈', item: `${SITE_ORIGIN}/` },
      { name: '1층 상가 분양·임대', item: `${SITE_ORIGIN}/store` },
    ],
    prerenderHtml: wrapPage(`
      <article class="space-y-8">
        <header class="space-y-3">
          <h1 class="text-3xl font-extrabold tracking-tight text-[#0F1C3A]">e편한세상 시티 고색 1층 상가 분양·임대</h1>
          <p class="text-base leading-relaxed text-gray-700">
            439병상 수원덕산병원 정문 바로 앞·옆 초밀착 입지와 단지 내 오피스텔 430세대를 품은 1층 스트리트 상가입니다. 신축 무권리 상가로 업종별 맞춤 호실 분양·임대 상담(임대 조건 협의 가능)을 진행합니다.
          </p>
        </header>

        <section class="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
          <h2 class="text-xl font-bold text-[#0F1C3A]">입점 완료 및 오픈 예정 매장</h2>
          <ul class="list-disc space-y-1.5 pl-5 text-sm text-gray-700">
            <li>121호: 약국 (영업 중)</li>
            <li>123호: 메가커피 (카페 · 영업 중)</li>
            <li>124호: 우지커피 (카페 · 영업 중)</li>
            <li>125호: 본죽&amp;비빔밥 (죽·비빔밥 · 영업 중)</li>
            <li>129호: 닭한상 (삼계탕·닭볶음탕·닭개장 · 임차 확정, 인테리어 중 · 12월 말 오픈 예정)</li>
            <li>134·135호: 장호덕 손만두 (손만두·칼국수 · 영업 중)</li>
            <li>138호: CU (편의점 · 영업 중)</li>
          </ul>
        </section>

        <section class="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
          <h2 class="text-xl font-bold text-[#0F1C3A]">분양·임대 모집 호실 (117~139호)</h2>
          <ul class="space-y-2 text-sm text-gray-700">
            <li><strong>117호</strong> (전용 15.99평 / 계약 33.05평): 1:1 필라테스 등 예약제 소형 업종 추천 · 보증금 3,000만 / 월 170만(부가세 별도) · 분양가 4억 5,440만 원</li>
            <li><strong>118호</strong> (전용 36.35평 / 계약 75.14평): 갈비탕·냉면·브런치 추천 · 보증금 5,000만 / 월 350만(부가세 별도) · 분양가 9억 4,430만 원</li>
            <li><strong>119호</strong> (전용 58.81평 / 계약 121.87평): 병원 통행로 바로 앞 약국 지정 호실 (분양 전용) · 분양가 122억 2,000만 원</li>
            <li><strong>120호</strong> (전용 56.73평 / 계약 117.26평): 병원 통행로 바로 앞 약국 지정 호실 (분양 전용) · 분양가 87억 8,000만 원</li>
            <li><strong>122호</strong> (전용 44.25평 / 계약 91.47평): 정문 앞 코너 약국(임대·분양 가능, 현 홍보관 자리) · 임대 조건 협의 · 분양가 69억 원</li>
            <li><strong>126호</strong> (전용 23.44평 / 계약 48.45평): 음식점·사무실 추천 · 보증금 5,000만 / 월 320만(부가세 별도) · 분양가 8억 3,780만 원</li>
            <li><strong>127호</strong> (전용 25.47평 / 계약 52.65평 · 전면 7m): 베이커리 프랜차이즈 가맹 운영 임차인 모집 중 · 보증금 5,000만 / 월 350만(부가세 별도) · 분양 협의 중</li>
            <li><strong>128호</strong> (전용 16.50평 / 계약 34.10평 · 전면 6m): 쌀국수 등 한 그릇 식사 추천 · 보증금 5,000만 / 월 270만(부가세 별도) · 분양가 7억 290만 원</li>
            <li><strong>129호</strong> (전용 18.47평 / 계약 38.18평): 닭한상 임차 완료 수익형 분양 호실 · 보증금 5,000만 / 월 300만(부가세 별도) · 분양가 7억 8,810만 원</li>
            <li><strong>132호</strong> (전용 13.34평 / 계약 27.57평): 1인 미용실·미술 교습소 등 추천 · 보증금 3,000만 / 월 140만(부가세 별도) · 분양가 3억 8,340만 원</li>
            <li><strong>136호</strong> (전용 17.79평 / 계약 38.96평): 호프집 추천(137호와 합쳐 전용 36.64평 운영 가능) · 분양 완료(임대 전용) · 보증금 5,000만 / 월 240만(부가세 별도)</li>
            <li><strong>137호</strong> (전용 18.85평 / 계약 38.96평): 호프집(136호 합면 가능)·애견미용 추천 · 보증금 5,000만 / 월 250만(부가세 별도) · 분양가 6억 8,870만 원</li>
            <li><strong>139호</strong> (전용 15.91평 / 계약 32.89평): 호프·이자카야 추천 (103동 코너 CU 옆) · 보증금 5,000만 / 월 250만(부가세 별도) · 분양가 6억 8,160만 원</li>
          </ul>
        </section>
      </article>
    `),
  },

  '/store/location': {
    path: '/store/location',
    title: '입지분석 | e편한세상 시티 고색 1층 상가',
    description:
      '439병상 수원덕산병원 정문 앞 초밀착 입지, 고색역·수원역(KTX·GTX-C)·서울 직행버스 광역 교통망, 탑동 이노베이션밸리(2029년 목표), 서수원 행정타운과 고색 1·2지구 배후수요를 확인하세요.',
    canonical: `${SITE_ORIGIN}/store/location`,
    breadcrumbs: [
      { name: '홈', item: `${SITE_ORIGIN}/` },
      { name: '1층 상가', item: `${SITE_ORIGIN}/store` },
      { name: '입지분석', item: `${SITE_ORIGIN}/store/location` },
    ],
    prerenderHtml: wrapPage(`
      <article class="space-y-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#0F1C3A]">e편한세상 시티 고색 상가 입지분석</h1>
        <p class="text-base leading-relaxed text-gray-700">
          의료·교통·첨단 R&amp;D·행정·주거 배후가 겹치는 고색동 핵심 상권 입지를 안내합니다.
        </p>
        <section class="grid gap-4 md:grid-cols-2">
          <div class="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
            <h2 class="text-lg font-bold text-[#0F1C3A]">01. 의료 · 수원덕산병원 정문 앞</h2>
            <p class="text-sm text-gray-700">439병상 규모 지역응급의료센터 수원덕산병원 정문 바로 앞 입지로, 의료진·환자·방문객의 동선과 1층 상가가 직결됩니다.</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
            <h2 class="text-lg font-bold text-[#0F1C3A]">02. 교통 · 고색역·수원역·서울 직행버스</h2>
            <p class="text-sm text-gray-700">수인분당선 고색역에서 1정거장 거리에 1호선·KTX·GTX-C(예정)가 지나는 수원역이 있으며, 상가 앞 버스정류장을 통해 서울 직행버스 3개 노선을 이용할 수 있습니다.</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
            <h2 class="text-lg font-bold text-[#0F1C3A]">03. R&amp;D · 탑동 이노베이션밸리</h2>
            <p class="text-sm text-gray-700">첨단업무용지 A2·A3 블록(2029년 7월 준공 목표)과 인접해 있으며, 같은 고색동 내 수원델타플렉스 산업단지의 탄탄한 직장인 수요를 보유하고 있습니다.</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
            <h2 class="text-lg font-bold text-[#0F1C3A]">04. 행정·주거 · 서수원 행정타운</h2>
            <p class="text-sm text-gray-700">권선구청·경찰서·보건소·우체국이 모인 서수원 행정타운 500m 이내, 단지 내 오피스텔 430세대 및 고색 1·2지구 약 4,400여 세대 배후 상권입니다.</p>
          </div>
        </section>
      </article>
    `),
  },

  '/store/overview': {
    path: '/store/overview',
    title: '사업개요 | e편한세상 시티 고색',
    description:
      '경기도 수원시 권선구 고색동 894-125번지 외 6필지, 대지면적 11,195㎡·연면적 85,512.62㎡, 지하 4층~지상 14층, 주거용 오피스텔 430세대 및 1층 근린생활시설, 주차 608대, DL이앤씨 시공 사업개요입니다.',
    canonical: `${SITE_ORIGIN}/store/overview`,
    breadcrumbs: [
      { name: '홈', item: `${SITE_ORIGIN}/` },
      { name: '1층 상가', item: `${SITE_ORIGIN}/store` },
      { name: '사업개요', item: `${SITE_ORIGIN}/store/overview` },
    ],
    prerenderHtml: wrapPage(`
      <article class="space-y-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#0F1C3A]">e편한세상 시티 고색 사업개요</h1>
        <dl class="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white text-sm">
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">사업명</dt><dd class="col-span-2 text-gray-700">e편한세상 시티 고색</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">대지위치</dt><dd class="col-span-2 text-gray-700">경기도 수원시 권선구 고색동 894-125번지 외 6필지</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">시공사</dt><dd class="col-span-2 text-gray-700">DL이앤씨</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">대지면적 / 연면적</dt><dd class="col-span-2 text-gray-700">11,195.00㎡ (3,386.49평) / 85,512.62㎡ (25,867.57평)</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">건폐율 / 용적률</dt><dd class="col-span-2 text-gray-700">55.02% / 464.19%</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">건축규모</dt><dd class="col-span-2 text-gray-700">지하 4층 ~ 지상 14층 (3개 동)</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">공급규모</dt><dd class="col-span-2 text-gray-700">주거용 오피스텔 430세대(전용 84㎡) 및 1층 근린생활시설</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">주차대수</dt><dd class="col-span-2 text-gray-700">총 608대 (근린생활시설 포함)</dd></div>
        </dl>
      </article>
    `),
  },

  '/officetel': {
    path: '/officetel',
    title: '84타입 3룸 오피스텔 | e편한세상 시티 고색',
    description:
      'e편한세상 시티 고색 전용 84㎡ 3룸 오피스텔 430세대 안내. 방 3개·욕실 2개 아파트 국민평형 크기, 시스템에어컨 4대·빌트인 김치냉장고 기본 제공, 수원덕산병원·수원델타플렉스·삼성전자 통근 입지를 만나보세요.',
    canonical: `${SITE_ORIGIN}/officetel`,
    breadcrumbs: [
      { name: '홈', item: `${SITE_ORIGIN}/` },
      { name: '84타입 3룸 오피스텔', item: `${SITE_ORIGIN}/officetel` },
    ],
    prerenderHtml: wrapPage(`
      <article class="space-y-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#0F1C3A]">e편한세상 시티 고색 전용 84㎡ 3룸 오피스텔</h1>
        <p class="text-base leading-relaxed text-gray-700">
          총 430세대 전 세대가 전용 84㎡(약 25.5평, 방 3개·욕실 2개·거실·주방)로 설계된 주거용 오피스텔입니다. 시스템에어컨 4대와 빌트인 김치냉장고가 기본 제공되며, 아파트 청약 시 주택 수에 포함되지 않습니다.
        </p>
        <section class="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
          <h2 class="text-xl font-bold text-[#0F1C3A]">입지 및 주요 거주 수요</h2>
          <ul class="list-disc space-y-1.5 pl-5 text-sm text-gray-700">
            <li>수원델타플렉스 직장인 · 삼성전자(기흥·화성·수원) 통근자</li>
            <li>수원덕산병원 의료진 · 어르신 및 가족 세대 (병원 정문 바로 앞)</li>
            <li>신혼부부 · 아파트 국민평형 크기 3룸 실거주 수요</li>
          </ul>
          <div class="flex flex-wrap gap-4 pt-2 text-sm font-bold text-[#FF671D]">
            <a href="/officetel/units" class="underline">84A·B·C·D 세대 안내 보기 →</a>
            <a href="/officetel/people" class="underline">누가 사나요 보기 →</a>
            <a href="/officetel/overview" class="underline">사업개요 보기 →</a>
          </div>
        </section>
      </article>
    `),
  },

  '/officetel/units': {
    path: '/officetel/units',
    title: '세대 안내 | 84㎡ 3룸 오피스텔 · e편한세상 시티 고색',
    description:
      '84A(302세대)·84B(89세대)·84C(26세대)·84D(13세대) 타입별 평면도와 면적, 방 3개·욕실 2개 실사진, 시스템에어컨 4대·김치냉장고 기본 옵션 및 지하 1층 커뮤니티(피트니스·스크린골프·라운지카페·개인오피스)를 확인하세요.',
    canonical: `${SITE_ORIGIN}/officetel/units`,
    breadcrumbs: [
      { name: '홈', item: `${SITE_ORIGIN}/` },
      { name: '오피스텔', item: `${SITE_ORIGIN}/officetel` },
      { name: '세대 안내', item: `${SITE_ORIGIN}/officetel/units` },
    ],
    prerenderHtml: wrapPage(`
      <article class="space-y-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#0F1C3A]">오피스텔 세대 안내 (전용 84㎡ · 총 430세대)</h1>
        <p class="text-base leading-relaxed text-gray-700">
          전 세대 전용 84㎡ 방 3개·욕실 2개 구조이며 시스템에어컨 4대와 빌트인 김치냉장고가 기본 제공됩니다.
        </p>
        <section class="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
          <h2 class="text-xl font-bold text-[#0F1C3A]">타입별 세대 구성</h2>
          <ul class="list-disc space-y-1.5 pl-5 text-sm text-gray-700">
            <li><strong>84A 타입</strong>: 전용 84.63㎡ (약 25.60평) · 302세대 (맞통풍 3BAY 판상형, 견본주택 타입)</li>
            <li><strong>84B 타입</strong>: 전용 84.51㎡ (약 25.56평) · 89세대 (4BAY 판상형, 현관 팬트리·드레스룸)</li>
            <li><strong>84C 타입</strong>: 전용 84.16㎡ (약 25.45평) · 26세대 (코너 탑상형)</li>
            <li><strong>84D 타입</strong>: 전용 84.52㎡ (약 25.57평) · 13세대 (4BAY 판상형 · 주거약자형)</li>
          </ul>
        </section>
        <section class="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
          <h2 class="text-xl font-bold text-[#0F1C3A]">지하 1층 입주민 커뮤니티 시설</h2>
          <p class="text-sm text-gray-700">
            피트니스, 스크린골프룸, 라운지 카페(무인카페), 실내놀이터, 개인용 오피스·오픈 라이브러리, 멀티룸·주민회의실, 세대 창고를 갖추고 있습니다.
          </p>
        </section>
      </article>
    `),
  },

  '/officetel/overview': {
    path: '/officetel/overview',
    title: '사업개요 | e편한세상 시티 고색 오피스텔',
    description:
      'e편한세상 시티 고색 오피스텔 사업개요. 수원시 권선구 고색동 894-125번지, 지하 4층~지상 14층 3개 동 430세대(84A·84B·84C·84D), 주차 608대, DL이앤씨 시공, 탑동 이노베이션밸리 인접 단지 정보를 확인하세요.',
    canonical: `${SITE_ORIGIN}/officetel/overview`,
    breadcrumbs: [
      { name: '홈', item: `${SITE_ORIGIN}/` },
      { name: '오피스텔', item: `${SITE_ORIGIN}/officetel` },
      { name: '사업개요', item: `${SITE_ORIGIN}/officetel/overview` },
    ],
    prerenderHtml: wrapPage(`
      <article class="space-y-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#0F1C3A]">e편한세상 시티 고색 오피스텔 사업개요</h1>
        <dl class="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white text-sm">
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">단지명</dt><dd class="col-span-2 text-gray-700">e편한세상 시티 고색</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">위치</dt><dd class="col-span-2 text-gray-700">경기도 수원시 권선구 고색동 894-125번지 외 6필지</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">규모</dt><dd class="col-span-2 text-gray-700">지하 4층 ~ 지상 14층 3개 동 · 오피스텔 430세대(84A·84B·84C·84D)</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">주차대수</dt><dd class="col-span-2 text-gray-700">608대 (세대당 넉넉한 자주식 주차 포함)</dd></div>
          <div class="grid grid-cols-3 gap-4 px-6 py-4"><dt class="font-bold text-[#0F1C3A]">시공사</dt><dd class="col-span-2 text-gray-700">DL이앤씨</dd></div>
        </dl>
      </article>
    `),
  },

  '/officetel/people': {
    path: '/officetel/people',
    title: '누가 사나요 | e편한세상 시티 고색 오피스텔',
    description:
      '수원델타플렉스 직장인, 수원덕산병원 의료진, 삼성전자 통근자, 신혼부부, 어르신·가족까지. 각 수요층의 실제 출퇴근·통원·육아·1층 상가 생활 동선으로 본 e편한세상 시티 고색 오피스텔 거주 가이드입니다.',
    canonical: `${SITE_ORIGIN}/officetel/people`,
    breadcrumbs: [
      { name: '홈', item: `${SITE_ORIGIN}/` },
      { name: '오피스텔', item: `${SITE_ORIGIN}/officetel` },
      { name: '누가 사나요', item: `${SITE_ORIGIN}/officetel/people` },
    ],
    prerenderHtml: wrapPage(`
      <article class="space-y-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#0F1C3A]">e편한세상 시티 고색 오피스텔 · 누가 사나요</h1>
        <p class="text-base leading-relaxed text-gray-700">
          실제 거주자의 하루 생활과 통근·생활 동선 기준으로 정리한 다섯 가지 거주 시나리오입니다.
        </p>
        <section class="space-y-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5 space-y-1.5">
            <h2 class="text-lg font-bold text-[#0F1C3A]">01. 수원델타플렉스 직장인</h2>
            <p class="text-sm text-gray-700">고색동 내 직주근접 출퇴근. 엘리베이터로 내려가면 1층에 칼국수·손만두, 죽집, 삼계탕·닭볶음탕·닭개장집, 카페와 CU 편의점이 있어 퇴근 후 생활이 편리합니다.</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 space-y-1.5">
            <h2 class="text-lg font-bold text-[#0F1C3A]">02. 수원덕산병원 의료진</h2>
            <p class="text-sm text-gray-700">439병상 수원덕산병원 정문 바로 앞 입지로 교대 근무·당직 출퇴근 부담이 적으며, 지하 1층 피트니스와 개인 오피스에서 휴식과 자기계발이 가능합니다.</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 space-y-1.5">
            <h2 class="text-lg font-bold text-[#0F1C3A]">03. 삼성전자 반도체·전자 통근자</h2>
            <p class="text-sm text-gray-700">기흥·화성·수원 삼성전자 캠퍼스 셔틀·자가용·수인분당선 접근성이 우수하며, 아파트 청약 시 주택 수 미포함 혜택을 누릴 수 있습니다.</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 space-y-1.5">
            <h2 class="text-lg font-bold text-[#0F1C3A]">04. 신혼부부</h2>
            <p class="text-sm text-gray-700">침실·방2·방3의 전용 84㎡ 3룸 구조에 시스템에어컨 4대와 김치냉장고가 기본 제공되어 초기 입주 부담이 적습니다.</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 space-y-1.5">
            <h2 class="text-lg font-bold text-[#0F1C3A]">05. 어르신·가족</h2>
            <p class="text-sm text-gray-700">수원덕산병원 정문과 1층 약국·편의점·음식점(칼국수·손만두, 죽집, 삼계탕·닭볶음탕·닭개장집, 카페)이 바로 이어져 병원 통원과 일상생활이 안전하고 편리합니다.</p>
          </div>
        </section>
      </article>
    `),
  },

  '/privacy': {
    path: '/privacy',
    title: '개인정보처리방침 | e편한세상 시티 고색',
    description:
      '루에나파트너스(e편한세상 시티 고색 분양·임대 상담 안내) 개인정보처리방침. 상담 신청 시 수집 항목, 이용 목적, 1년 보유 기간, 위탁 안내 및 개인정보 보호책임자 연락처(031-293-1073)를 안내합니다.',
    canonical: `${SITE_ORIGIN}/privacy`,
    breadcrumbs: [
      { name: '홈', item: `${SITE_ORIGIN}/` },
      { name: '개인정보처리방침', item: `${SITE_ORIGIN}/privacy` },
    ],
    prerenderHtml: wrapPage(`
      <article class="space-y-4">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#0F1C3A]">개인정보처리방침</h1>
        <p class="text-sm text-gray-700">루에나파트너스는 「개인정보 보호법」에 따라 상담 신청자의 개인정보를 아래와 같이 처리합니다.</p>
        <ul class="list-disc space-y-1.5 pl-5 text-sm text-gray-700">
          <li><strong>수집 항목</strong>: 이름, 휴대전화 번호, 관심 호실, 상담 희망 시간</li>
          <li><strong>이용 목적 및 보유 기간</strong>: 분양·임대 상담 및 홍보관 방문 예약 연락 / 상담 신청일로부터 1년</li>
          <li><strong>개인정보 보호책임자</strong>: 김지선 (루에나파트너스 대표) · 031-293-1073</li>
        </ul>
      </article>
    `),
  },
};
