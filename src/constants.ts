export const DEFAULT_PROJECT_INFO = {
  name: 'e편한세상시티 고색',
  brandName: 'e편한세상',
  brandSubName: 'CITY',
  location: '고색',
  businessHours: '연중무휴 10:00 - 18:00',
  representativeNumber: '010.3370.8602',
  overview: [
    { label: '사업명', value: 'e편한세상 시티 고색' },
    { label: '대지위치', value: '경기도 수원시 권선구 고색동 894-125번지 외 6필지' },
    { label: '대지면적', value: '11,195.00㎡ (3,386.49평)' },
    { label: '연면적', value: '85,512.62㎡ (25,867.57평)' },
    { label: '건폐율/용적률', value: '55.02% / 464.19%' },
    { label: '건축규모', value: '지하 4층 ~ 지상 14층, 오피스텔(전용 84㎡) 및 근린생활시설' },
    { label: '주차대수', value: '608대 (근린생활시설 포함)' },
  ],
  heroImages: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2200&auto=format&fit=crop',
  ],
  unitTypes: [
    { type: '84A', units: '302', ratio: '70.2%', areaM2: '84.63', areaPy: '25.60', totalAreaM2: '181.08', totalAreaPy: '54.77', efficiency: '46.7%' },
    { type: '84B', units: '89', ratio: '20.7%', areaM2: '84.51', areaPy: '25.56', totalAreaM2: '181.64', totalAreaPy: '54.94', efficiency: '46.5%' },
    { type: '84C', units: '26', ratio: '6.0%', areaM2: '84.16', areaPy: '25.45', totalAreaM2: '181.67', totalAreaPy: '54.95', efficiency: '46.3%' },
    { type: '84D', units: '13', ratio: '3.0%', areaM2: '84.52', areaPy: '25.57', totalAreaM2: '181.66', totalAreaPy: '54.95', efficiency: '46.5%' },
  ]
};

export const DEFAULT_ANALYSIS_DATA = [
  {
    title: '수원덕산병원 프리미엄',
    desc: '약 706병상 규모의 대형 종합병원 바로 앞 입지로 안정적인 의료수요 및 관련 종사자 배후수요를 확보합니다.',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    title: '행정타운 배후수요',
    desc: '권선구청, 우체국, 보건소 등 공공기관이 밀집한 서수원 행정타운의 중심지로 공무원 및 방문객의 유입이 활발합니다.',
    images: [
      'https://images.unsplash.com/photo-1577416414929-7a4c9f17f6b4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    title: '고색역 역세권 입지',
    desc: '수인분당선 고색역 역세권으로 지하철 이용객의 풍부한 유동인구는 물론, 편리한 교통환경을 자랑합니다.',
    images: [
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    title: '탑동 이노베이션 밸리',
    desc: '인근 탑동 일대에 조성되는 첨단 산업 및 연구 단지로 대규모 기업 유입에 따른 고소득 배후수요 증대가 기대됩니다.',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

export const DEFAULT_MD_DATA = [
  { 
    id: '117호', 
    type: '라멘집 / 개인 필라테스', 
    area: '15.99평', 
    desc: '입구 초입 가시성이 우수한 특화 호실',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '118호', 
    type: '브런치 / 베이커리카페', 
    area: '36.35평', 
    desc: '모던한 감성의 세련된 공간 구성 가능',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '119호', 
    type: '문전약국', 
    area: '58.81평', 
    desc: '병원/의원 이용객 동선 확보 최적 입지',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '126호', 
    type: '한식 / 샤브샤브전문점', 
    area: '23.44평', 
    desc: '대로변 노출이 우수하여 집객력이 높은 곳',
    image: 'https://images.unsplash.com/photo-1634047462615-ca805e243956?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '127호', 
    type: '한식 / 샤브샤브전문점', 
    area: '25.47평', 
    desc: '가족 단위 고객 및 단체 방문 최적화',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '128호', 
    type: '국밥집 / 육개장', 
    area: '16.5평', 
    desc: '유동인구가 많은 동선의 생활 밀착형 업종',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '129호', 
    type: '프랜차이즈 맥주전문점', 
    area: '18.47평', 
    desc: '퇴근길이나 여가를 즐기기에 좋은 코너 입지',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800'
  }
];

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading config from localStorage:', e);
      }
    }
  }
  return defaultValue;
};

export const PROJECT_INFO = loadFromLocalStorage('site_custom_project_info', DEFAULT_PROJECT_INFO);
export const analysisData = loadFromLocalStorage('site_custom_analysis_data', DEFAULT_ANALYSIS_DATA);
export const mdData = loadFromLocalStorage('site_custom_md_data', DEFAULT_MD_DATA);
