import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MapPin, Sparkles, Building, ArrowRight } from 'lucide-react';
import { officetelData, mdData, DEFAULT_MD_DATA } from '../constants';

interface StoreUnit {
  id: string;
  area: string;
  type: string;
  desc: string;
  recommendation: string;
  images: string[];
  coords: { x: number; y: number };
  category: string;
  categoryStyle: string;
}

// 2. 데이터 객체 배열 (전체 호실의 확정된 카피라이팅 배치 - 호실별 3~5개 다각화 이미지 연동)
const STORE_UNITS_BASE: StoreUnit[] = [
  {
    id: '117호',
    area: '15.99평',
    type: '라멘집 / 개인 필라테스',
    desc: '[1인 타겟 컴팩트 상가] 바쁜 일상 속 가볍고 트렌디한 한 끼',
    recommendation: '돈코츠 라멘 전문점, 키토 김밥 델리, 수제 디저트 공방, 1:1 기구 필라테스 클래스',
    images: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { x: 41, y: 36 },
    category: 'F&B/스포츠',
    categoryStyle: 'bg-orange-50 text-orange-600 border border-orange-100/60'
  },
  {
    id: '118호',
    area: '36.35평',
    type: '브런치 / 베이커리 카페',
    desc: '[프리미엄 F&B 공간] 면회객과 대기 손님의 발길이 머무는 필수 방문 코스',
    recommendation: '올데이 브런치 플레이트, 페이스트리 전문 베이커리 카페, 스페셜티 커피 로스터리',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513442542250-854d436a73f2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { x: 26, y: 30 },
    category: 'F&B/디저트',
    categoryStyle: 'bg-amber-50 text-amber-700 border border-amber-100/60'
  },
  {
    id: '119호',
    area: '58.81평',
    type: '의료 문전약국',
    desc: '[상권의 중심] 처방전 동선이 모이는 독점적 입지',
    recommendation: '소아과/내과/정형외과 병동 처방 중심 메디컬 대형 약국, 올리브영 타입 드로그스토어',
    images: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { x: 28, y: 45 },
    category: '독점 메디컬',
    categoryStyle: 'bg-teal-50 text-teal-700 border border-teal-100/60'
  },
  {
    id: '126호',
    area: '23.44평',
    type: '국밥 / 설렁탕 전문점',
    desc: '[빠른 회전율] 주문하면 5분 만에 나오는 든든한 식사',
    recommendation: '전통 명품 곰탕·설렁탕 전문점, 남녀노소 집객력이 높은 든든한 한식 가마솥 국밥',
    images: [
      'https://images.unsplash.com/photo-1547928500-4722231facb3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1616166311666-8805f6e87a28?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1594911773177-3e4b77f10fc1?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { x: 48, y: 88 },
    category: 'F&B/한식',
    categoryStyle: 'bg-red-50 text-red-600 border border-red-100/60'
  },
  {
    id: '127호',
    area: '25.47평',
    type: '1인 샤브샤브 / 찜닭',
    desc: '[트렌디 다이닝] 혼자서도, 여럿이도 부담 없는 든든한 한 끼',
    recommendation: '회전식 1인 팟 샤브샤브 식당, 모던 안동찜닭 패밀리 레스토랑, 정갈한 캐주얼 한식 정찬',
    images: [
      'https://images.unsplash.com/photo-1634047462615-ca805e243956?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { x: 52, y: 88 },
    category: '웰빙 다이닝',
    categoryStyle: 'bg-rose-50 text-rose-600 border border-rose-100/60'
  },
  {
    id: '128호',
    area: '16.5평',
    type: '포장 · 배달 피자 / 에그 샌드위치',
    desc: '[포장·배달 특화] 병원 상권의 필수, 끊기지 않는 테이크아웃',
    recommendation: '수제 화덕 피자 픽업 전문점, 프리미엄 토스트 & 에그 브랜드, 아웃백/가구수제 도시락 전문점',
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { x: 56, y: 88 },
    category: '테이크아웃',
    categoryStyle: 'bg-emerald-50 text-emerald-600 border border-emerald-100/60'
  },
  {
    id: '129호',
    area: '18.47평',
    type: '생활맥주 / 프랜차이즈 맥주',
    desc: '[시선 집중 코너] 낮부터 밤까지 발길을 끄는 간판 자리',
    recommendation: '퇴근길 유도를 위한 수제 맥주 다이닝 펍, 역전할머니맥주식 스몰비어 프랜차이즈',
    images: [
      'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { x: 60, y: 88 },
    category: 'F&B/주류',
    categoryStyle: 'bg-indigo-50 text-indigo-600 border border-indigo-100/60'
  }
];

// Dynamically merge admin dashboard edits while maintaining high-end default descriptions
const STORE_UNITS: StoreUnit[] = STORE_UNITS_BASE.map(base => {
  const custom = mdData?.find((item: any) => item.id === base.id);
  if (custom) {
    const defaultItem = DEFAULT_MD_DATA.find((d: any) => d.id === base.id);
    const isEditedDesc = defaultItem && custom.desc !== defaultItem.desc;
    const isEditedType = defaultItem && custom.type !== defaultItem.type;
    const isEditedArea = defaultItem && custom.area !== defaultItem.area;
    const isEditedImage = defaultItem && custom.image !== defaultItem.image;

    let mergedImages = base.images;
    if (isEditedImage && custom.image) {
      mergedImages = [custom.image, ...base.images.slice(1)];
    }

    return {
      ...base,
      id: custom.id || base.id,
      area: isEditedArea ? custom.area : base.area,
      type: isEditedType ? custom.type : base.type,
      desc: isEditedDesc ? custom.desc : base.desc,
      images: mergedImages,
      recommendation: isEditedType ? custom.type : base.recommendation
    };
  }
  return base;
});

// SVG 앵커 포인트 정의 (보행 동선 역추적 시작점)
const TRAFFIC_ANCHORS = [
  { id: 'gate2', label: '병원 통행로 진입로', x: 20, y: 30, color: '#6B8E23' },
  { id: 'gate1', label: '병원 정문 진입로', x: 20, y: 90, color: '#CE9F6F' }
];

interface FlowPath {
  startId: string;
  points: { x: number; y: number }[];
  color: string;
  label: string;
}

function getFlowPaths(unitId: string): FlowPath[] {
  switch (unitId) {
    case '117호':
      return [{
        startId: 'gate2',
        label: '병원 통행로 진입로',
        color: '#6B8E23',
        points: [{ x: 20, y: 30 }, { x: 26, y: 30 }, { x: 41, y: 36 }]
      }];
    case '118호':
      return [{
        startId: 'gate2',
        label: '병원 통행로 진입로',
        color: '#6B8E23',
        points: [{ x: 20, y: 30 }, { x: 26, y: 30 }]
      }];
    case '119호':
      return [
        {
          startId: 'gate2',
          label: '병원 통행로 진입로',
          color: '#6B8E23',
          points: [{ x: 20, y: 30 }, { x: 28, y: 45 }]
        },
        {
          startId: 'gate1',
          label: '병원 정문 진입로',
          color: '#CE9F6F',
          points: [{ x: 20, y: 90 }, { x: 28, y: 45 }]
        }
      ];
    case '126호':
      return [{
        startId: 'gate1',
        label: '병원 정문 진입로',
        color: '#CE9F6F',
        points: [{ x: 20, y: 90 }, { x: 48, y: 88 }]
      }];
    case '127호':
      return [{
        startId: 'gate1',
        label: '병원 정문 진입로',
        color: '#CE9F6F',
        points: [{ x: 20, y: 90 }, { x: 48, y: 88 }, { x: 52, y: 88 }]
      }];
    case '128호':
      return [{
        startId: 'gate1',
        label: '병원 정문 진입로',
        color: '#CE9F6F',
        points: [{ x: 20, y: 90 }, { x: 48, y: 88 }, { x: 52, y: 88 }, { x: 56, y: 88 }]
      }];
    case '129호':
      return [{
        startId: 'gate1',
        label: '병원 정문 진입로',
        color: '#CE9F6F',
        points: [{ x: 20, y: 90 }, { x: 48, y: 88 }, { x: 52, y: 88 }, { x: 56, y: 88 }, { x: 60, y: 88 }]
      }];
    default:
      return [];
  }
}

function buildPathData(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

interface MDImageSliderProps {
  images: string[];
  title: string;
  badgeText: string;
  isMobile?: boolean;
}

function MDImageSlider({ images, title, badgeText, isMobile = false }: MDImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="w-full h-full relative group/slider overflow-hidden bg-stone-100">
      <img
        src={images[currentIndex]}
        alt={`${title} view ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        referrerPolicy="no-referrer"
      />
      {/* Dark overlay gradient only on PC view */}
      {!isMobile && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />}

      {/* Badge / Indicator overlays */}
      <div className={`absolute top-2.5 bg-accent text-white px-2 py-0.5 text-[9px] font-black tracking-widest uppercase z-10 ${isMobile ? 'left-5' : 'left-4'}`}>
        {badgeText}
      </div>

      {!isMobile && (
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white pointer-events-none z-10">
          <MapPin className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-black tracking-widest uppercase">추천 업종 실사 분위기 ({currentIndex + 1}/{images.length})</span>
        </div>
      )}

      {/* Chevron down with 90/-90 degree rotation for sliders */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-auto z-20"
            aria-label="Previous slide"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-auto z-20"
            aria-label="Next slide"
          >
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </>
      )}

      {/* Slide tiny dot indicators at the bottom */}
      {images.length > 1 && (
        <div className={`absolute bottom-3 flex gap-1.5 z-20 ${isMobile ? 'left-1/2 -translate-x-1/2' : 'right-4'}`}>
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'bg-accent w-5' : 'bg-white/50 w-1.5'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MDConfig() {
  // 기본적으로 119호를 활성화
  const [activeUnit, setActiveUnit] = useState<string>('119호');

  const selectedUnit = STORE_UNITS.find(u => u.id === activeUnit) || STORE_UNITS[0];

  return (
    <section id="md" className="py-14 md:py-28 px-6 border-b border-gray-100 bg-[#FAF8F5]">
      {/* 선 애니메이션용 CSS 인젝션 */}
      <style>{`
        @keyframes reverse-dotted-flow {
          to {
            stroke-dashoffset: -30;
          }
        }
        .animate-reverse-flow {
          stroke-dasharray: 6, 4;
          animation: reverse-dotted-flow 1.2s linear infinite;
        }
        @keyframes locator-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.4;
          }
        }
        .animate-pulse-locator {
          animation: locator-pulse 2s infinite ease-in-out;
        }
      `}</style>

      <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10 md:mb-20"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-4 tracking-tight leading-tight break-keep">
            수원덕산병원 상가 동선 분석 및 MD 연동 대시보드
          </h2>
          <div className="w-20 h-1.5 bg-accent mx-auto mt-4 md:mt-8 rounded-full" />
        </motion.div>

        {/* 모바일 (md 미만) 전용 고급스러운 프롭테크 대시보드 리스트 뷰 */}
        <div className="block md:hidden mb-12 md:mb-20 -mx-6 w-[calc(100%+3rem)]">
          <div className="bg-transparent">
            <div className="flex flex-col">
              {STORE_UNITS.map((unit) => (
                <div key={unit.id} className="bg-transparent py-8 border-b border-stone-200/60 last:border-b-0 flex flex-col">
                  
                  {/* 1. 카탈로그 메타데이터 상단 배치 */}
                  <div className="flex items-center justify-between mb-3 px-5">
                    <span className="text-xs font-bold text-stone-500 tracking-wider uppercase">
                      {unit.id} <span className="mx-1.5 text-stone-300">|</span> 전용 {unit.area}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-semibold tracking-wider rounded ${unit.categoryStyle}`}>
                      {unit.category}
                    </span>
                  </div>

                  {/* 2. 에셋 타이틀 (차분하고 묵직한 프리미엄 진회색) */}
                  <h4 className="text-[17px] font-black text-stone-950 leading-snug mb-3.5 tracking-tight break-keep px-5">
                    {unit.desc}
                  </h4>

                  {/* 3. 이미지 (좌우 여백 없이 화면에 꽉 찬 와이드 레이아웃) */}
                  <div className="w-full aspect-[16/9] bg-stone-100 overflow-hidden relative mb-4">
                    <MDImageSlider 
                      images={unit.images} 
                      title={unit.type} 
                      badgeText="MD REAL-VIEW" 
                      isMobile={true} 
                    />
                  </div>

                  {/* 4. 입지 공학적 데이터 분석 정보 (차분한 아티클 스타일) */}
                  <div className="text-[13.5px] text-stone-600 leading-relaxed break-keep px-5">
                    <p className="mb-4">
                      수원덕산병원 인접 최고 보행 집객구역에 위치한 {unit.id}호는 가시성이 뛰어나며 안정적인 점포 활성화 지표를 보유하고 있습니다. 정밀 동선 및 시뮬레이션에 매칭된 MD 상세 리스트는 아래와 같습니다.
                    </p>
                    
                    {/* 권장 MD 기프트 박스 */}
                    <div className="p-4 bg-stone-50 border border-stone-200/40 flex items-start gap-2">
                      <span className="text-xs font-bold text-accent shrink-0 mt-0.5">▷ 권장:</span>
                      <p className="text-xs font-bold text-stone-800 leading-normal">
                        {unit.recommendation}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1. 레이아웃 분할 Grid (좌측 7칸, 우측 5칸 - PC 대시보드 전용) */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch w-full mb-32">
          
          {/* 좌측 7칸: 도면 이미지 및 SVG 보행 동선 역추적 애니메이션 맵 */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-stone-200/60 p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.015)] relative min-h-[500px]">
            <div className="mb-4">
              <span className="text-accent font-black text-[10px] tracking-widest uppercase block mb-1">INTERACTIVE DIGITAL TWIN</span>
              <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                실시간 보행자 유입 역추적(Reverse-Tracking) 동선 맵
              </h3>
            </div>

            {/* 도면 캔버스 컨테이너 - 가로가 긴 직사각형을 유지하도록 aspect-[4/3] 또는 aspect-[16/10] 적용 */}
            <div 
              className="relative flex-1 bg-[#FBFBFA] border border-stone-200 rounded-md overflow-hidden w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] min-h-[360px] sm:min-h-[420px] md:min-h-[480px] shadow-inner"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(165, 156, 144, 0.08) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(165, 156, 144, 0.08) 1px, transparent 1px),
                  linear-gradient(to right, rgba(165, 156, 144, 0.03) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(165, 156, 144, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px, 40px 40px, 8px 8px, 8px 8px',
                backgroundPosition: 'center center'
              }}
            >
              
              {/* 실제 사용자가 올린 1층 도면 평면도 이미지 경로 적용 */}
              <img 
                src="https://storage.googleapis.com/aistudio-user-uploads-production/5fe17d12-db63-496d-9524-8ba440072715/input_file_0.png" 
                alt="1F Blueprint Map Layout" 
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none filter contrast-[1.05]"
              />

              {/* 실제 레이아웃 도드라지게 실선 구획 가이드라인 도색 */}
              <div className="absolute inset-0 bg-[#EFECE8]/10 pointer-events-none" />

              {/* SVG 오버레이 애니메이션 레이어 (viewBox 0 0 100 100 백분율 상대좌표 동기화) */}
              <svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full z-10 select-none pointer-events-auto"
              >
                {/* 1. 보행 유도 앵커 포인트 그리기 */}
                {TRAFFIC_ANCHORS.map((anchor) => {
                  const activeFlows = getFlowPaths(selectedUnit.id);
                  const isAnchorActive = activeFlows.some(f => f.startId === anchor.id);
                  return (
                    <g key={anchor.id} className="cursor-help">
                      <circle cx={anchor.x} cy={anchor.y} r="2.5" fill={anchor.color} opacity="0.15" />
                      <circle cx={anchor.x} cy={anchor.y} r="0.8" fill={anchor.color} />
                      <circle cx={anchor.x} cy={anchor.y} r="0.1" fill="#fff" />
                      {/* 펄스 웨이브 퍼짐 효과 (현재 선택된 동선에 유입되는 앵커만 활성화) */}
                      {isAnchorActive && (
                        <circle cx={anchor.x} cy={anchor.y} r="2.0" stroke={anchor.color} strokeWidth="0.3" fill="none" opacity="0.6" className="origin-center scale-100 animate-ping" />
                      )}
                    </g>
                  );
                })}

                {/* 2. 보행 동선 역추적 애니메이션 그리기 (프리미엄 동선 광선 이펙트) */}
                {getFlowPaths(selectedUnit.id).map((flow) => {
                  const pathD = buildPathData(flow.points);
                  return (
                    <g key={`flow-${flow.startId}-${selectedUnit.id}`}>
                      {/* 1단계: 선명하고 도톰한 유도 트랙 (가시성 극대화) */}
                      <path 
                        d={pathD} 
                        fill="none" 
                        stroke={flow.color} 
                        strokeWidth="2.2" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.18" 
                      />
                      {/* 2단계: 실루엣 중심 파선 (가이드 형태 파악 최적화) */}
                      <path 
                        d={pathD} 
                        fill="none" 
                        stroke={flow.color} 
                        strokeWidth="0.6" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="1.2 1.5"
                        opacity="0.65" 
                      />
                      {/* 3단계: 흐르는 광선 입자 1 (원류 게이트에서 목적 호실로의 부드러운 유동 전송 효과) */}
                      <g>
                        <circle r="1.3" fill={flow.color} opacity="0.35">
                          <animateMotion dur="3.5s" repeatCount="indefinite" path={pathD} begin="0s" />
                        </circle>
                        <circle r="0.6" fill="#FFFFFF" opacity="0.95">
                          <animateMotion dur="3.5s" repeatCount="indefinite" path={pathD} begin="0s" />
                        </circle>
                      </g>
                      {/* 4단계: 흐르는 광선 입자 2 (지연 분사로 연속적인 흐름감 부여) */}
                      <g>
                        <circle r="1.3" fill={flow.color} opacity="0.35">
                          <animateMotion dur="3.5s" repeatCount="indefinite" path={pathD} begin="1.75s" />
                        </circle>
                        <circle r="0.6" fill="#FFFFFF" opacity="0.95">
                          <animateMotion dur="3.5s" repeatCount="indefinite" path={pathD} begin="1.75s" />
                        </circle>
                      </g>
                    </g>
                  );
                })}

                {/* 3. 모든 호실의 원형 핀 노드 표기 (정밀 백분율 좌표 연동) */}
                {STORE_UNITS.map((unit) => {
                  const isActive = unit.id === activeUnit;
                  const isBottomRow = ['126호', '127호', '128호', '129호'].includes(unit.id);
                  
                  // 스태거(Stagger) 설정을 적용하여 밀집된 126~129호 라벨 겹침 방지
                  let labelYOffset = isActive ? 5.2 : 4.4;
                  if (isBottomRow) {
                    if (unit.id === '126호' || unit.id === '128호') {
                      labelYOffset = isActive ? 7.2 : 6.2; // 126, 128호는 위로 스태거
                    } else {
                      labelYOffset = isActive ? 3.4 : 2.6; // 127, 129호는 아래로 스태거
                    }
                  }

                  const rectWidth = isActive ? 5.8 : 4.6;
                  const rectHeight = isActive ? 2.1 : 1.7;
                  const rectX = unit.coords.x - rectWidth / 2;
                  const rectY = unit.coords.y - labelYOffset;
                  const textY = rectY + (isActive ? 1.55 : 1.25);
                  
                  return (
                    <g 
                      key={`pin-${unit.id}`} 
                      className="cursor-pointer group"
                      onClick={() => setActiveUnit(unit.id)}
                    >
                      {/* 가느다란 스태거 커넥터 선 (밀집 구역 y축 이동 시 연결선 시각화) */}
                      {isBottomRow && (
                        <line 
                          x1={unit.coords.x} 
                          y1={unit.coords.y} 
                          x2={unit.coords.x} 
                          y2={rectY + (labelYOffset > 4 ? rectHeight : 0)} 
                          stroke={isActive ? "#CE9F6F" : "#CEAE8E"} 
                          strokeWidth="0.1" 
                          strokeDasharray="0.3 0.3"
                          opacity="0.65"
                        />
                      )}

                      {/* 위치 마커 */}
                      {isActive && (
                        <circle cx={unit.coords.x} cy={unit.coords.y} r="2.2" fill="#9F2B2B" opacity="0.25" className="animate-pulse-locator" />
                      )}
                      
                      <circle 
                        cx={unit.coords.x} 
                        cy={unit.coords.y} 
                        r={isActive ? "1.2" : "0.8"} 
                        fill={isActive ? "#CE9F6F" : "#7A6F62"} 
                        stroke="#FFF" 
                        strokeWidth={isActive ? "0.3" : "0.15"}
                        className="transition-all duration-300 group-hover:fill-accent"
                      />
                      
                      {/* 인포 칩 라벨 (잘림 방지 및 세련된 패딩 설정) */}
                      <rect 
                        x={rectX} 
                        y={rectY} 
                        width={rectWidth} 
                        height={rectHeight} 
                        rx="0.3" 
                        fill={isActive ? "#272522" : "#FFFFFF"} 
                        stroke={isActive ? "#CE9F6F" : "#D3C2AF"} 
                        strokeWidth="0.15" 
                        opacity="0.98"
                      />
                      <text 
                        x={unit.coords.x} 
                        y={textY} 
                        fill={isActive ? "#CE9F6F" : "#272522"} 
                        fontSize={isActive ? "1.4" : "1.1"} 
                        fontWeight="900" 
                        textAnchor="middle"
                        className="select-none font-sans"
                      >
                        {unit.id.replace('호', '')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 하단 범례 */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap justify-between items-center gap-3">
              <div className="flex gap-4 flex-wrap">
                {TRAFFIC_ANCHORS.map((anchor) => (
                  <div key={anchor.id} className="flex items-center gap-1.5 text-xs font-semibold text-stone-600">
                    <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: anchor.color }} />
                    <span>{anchor.label}</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-black text-accent flex items-center gap-1 uppercase select-none">
                <Sparkles className="w-3.5 h-3.5" /> 
                호실 마커 클릭 시 개별 동선 역추적
              </div>
            </div>
          </div>

          {/* 우측 5칸: 전체 확장형 아코디언 표(Accordion Table) 하나로 단정하게 채움 */}
          <div className="lg:col-span-5 flex flex-col bg-slate-50 md:bg-slate-50 lg:bg-transparent md:border md:border-stone-200/60 lg:border-none md:rounded-3xl lg:rounded-none overflow-hidden md:shadow-[0_4px_30px_rgba(0,0,0,0.015)] lg:shadow-none relative h-full">
            <div className="py-5 px-5 lg:px-1 bg-white lg:bg-transparent border-b border-stone-100 lg:border-stone-900 pb-4 lg:pb-3 flex justify-between items-end">
              <div>
                <span className="text-accent font-black text-[10px] tracking-widest uppercase block mb-1">UNIT EXPANSION DASHBOARD</span>
                <h3 className="text-xl font-bold text-stone-900 tracking-tight">호실별 최적 권장업종 연동 표</h3>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 select-none pb-0.5">전용면적 기준</span>
            </div>

            {/* 아코디언 컨테이너 (부드러운 열기/닫기 상호배타 구조) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-0 flex flex-col gap-3.5 sm:gap-4 lg:gap-0 bg-slate-50 lg:bg-transparent divide-y divide-stone-200/60">
              {STORE_UNITS.map((unit) => {
                const isOpen = unit.id === activeUnit;
                return (
                  <div 
                    key={unit.id} 
                    className={`w-full overflow-hidden transition-all duration-300 ${
                      isOpen 
                        ? 'border-accent shadow-md ring-1 ring-accent/5 rounded-2xl bg-white lg:border-none lg:shadow-none lg:ring-0 lg:rounded-none lg:bg-transparent' 
                        : 'border-slate-100 shadow-sm hover:border-accent/40 hover:shadow-md rounded-2xl bg-white lg:border-none lg:shadow-none lg:rounded-none lg:bg-transparent'
                    }`}
                  >
                    
                    {/* 아코디언 헤더 (클릭 가능한 행) */}
                    <button
                      onClick={() => setActiveUnit(activeUnit === unit.id ? '' : unit.id)}
                      className={`w-full text-left py-4 px-4 sm:px-5 lg:px-2 flex items-center justify-between transition-all duration-300 group ${
                        isOpen ? 'bg-amber-50/10 lg:bg-stone-50/80' : 'bg-white lg:bg-transparent hover:bg-slate-50/40 lg:hover:bg-stone-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-4 sm:gap-6 lg:gap-5">
                        {/* 호실 번호 강조 (더 작고 또렷한 진회색, 완벽한 세로 중앙 정렬) */}
                        <div className="flex items-center leading-none shrink-0 border-r border-stone-200/60 pr-4">
                          <span className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
                            isOpen ? 'text-accent' : 'text-slate-800 lg:text-slate-800 group-hover:text-accent'
                          }`}>
                            {unit.id.replace('호', '')}
                          </span>
                          <span className={`text-xs font-semibold ml-0.5 mt-0.5 transition-colors ${
                            isOpen ? 'text-accent' : 'text-slate-400 group-hover:text-slate-600'
                          }`}>호</span>
                        </div>

                        <div>
                          <div className="flex items-center flex-wrap gap-2 lg:gap-2.5">
                            <p className={`text-base sm:text-lg lg:text-[15px] font-black tracking-tight text-wrap break-keep transition-colors ${
                              isOpen ? 'text-accent' : 'text-slate-900 group-hover:text-accent'
                            }`}>
                              {unit.type}
                            </p>
                            <span className={`px-2.5 py-0.5 text-xs lg:text-[9px] font-medium rounded-full lg:rounded select-none transition-all duration-300 ${unit.categoryStyle}`}>
                              {unit.category}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400 font-bold block mt-1">
                            실평수: {unit.area}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-auto shrink-0 pl-4">
                        {isOpen && (
                          <span className="text-[8px] bg-accent text-white px-1.5 py-0.5 font-bold tracking-widest uppercase">
                            ACTIVE
                          </span>
                        )}
                        <div
                          className={`text-stone-400 transition-transform duration-300 ease-in-out ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </button>

                    {/* 아코디언 확장 영역 (부드러운 Motion 연동) */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          className="overflow-hidden bg-slate-50/50 lg:bg-stone-50/20 border-t border-slate-100 lg:border-stone-100"
                        >
                          {/* 16:9 꽉 차는 추천 이미지 */}
                          <div className="w-full aspect-[16/9] overflow-hidden relative">
                            <MDImageSlider 
                              images={unit.images} 
                              title={unit.type} 
                              badgeText="MD REAL-VIEW" 
                              isMobile={false} 
                            />
                          </div>

                          {/* 상세 카피라이팅 & 추천 텍스트 리스트 */}
                          <div className="py-5 px-4 sm:px-5 lg:px-4">
                            {/* 타이틀을 text-lg 이상 크기로 더욱 진하게 설정 */}
                            <p className="text-base sm:text-lg lg:text-[15px] font-bold text-stone-900 leading-relaxed mb-4 flex gap-1.5 items-start text-wrap break-keep">
                              <span className="text-accent shrink-0 font-extrabold">▶</span>
                              <span>{unit.desc}</span>
                            </p>
                            
                            <div className="pt-4 border-t border-slate-200/60 lg:border-stone-200/40">
                              <span className="text-[11px] font-black tracking-wider uppercase text-stone-900 block mb-2 font-sans">권장 테넌트(MD) 리스트</span>
                              <div className="p-3.5 bg-white lg:bg-stone-50/50 border border-slate-200/60 lg:border-stone-200/40 rounded-lg lg:rounded-none shadow-sm">
                                {/* 추천 업종 텍스트를 크게 키우고 색감 진하게 세팅 */}
                                <p className="text-sm sm:text-base lg:text-[14px] font-black text-stone-950 leading-relaxed text-wrap break-keep font-sans antialiased">
                                  {unit.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 오피스텔 섹션 유지 - Refined to match modern design guides */}
        <div className="pt-12 md:pt-24 border-t border-stone-200/50">
          <div className="text-center mb-10 md:mb-20">
            <span className="text-accent font-black tracking-[0.25em] text-[11px] uppercase block mb-3">PREMIUM RESIDENCE</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6 break-keep">주거용 오피스텔 상품안내</h2>
            <div className="mt-4">
              <span className="text-sm sm:text-base md:text-[17px] text-[#555555] font-semibold uppercase tracking-[0.08em] block leading-relaxed">
                시행사 특별 보유분 한정
                <br />
                프리미엄 리저브 세대
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {officetelData.map((unit: any, idx: number) => (
              <OfficetelProductCard key={idx} unit={unit} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OfficetelProductCard({ unit, idx }: { unit: any; idx: number; key?: any }) {
  const images = unit.images && unit.images.length > 0 
    ? unit.images.filter((img: string) => img && img.trim() !== '') 
    : ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800'];
  
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
      className="group h-full"
    >
      <div className="rounded-none overflow-hidden border border-stone-200 bg-white flex flex-col h-full transition-all duration-500 hover:border-accent">
        {/* 이미지 영역 슬라이더 */}
        <div className="h-64 overflow-hidden relative group/slider bg-stone-50">
          <img 
            src={images[currentImgIndex]} 
            alt={unit.title} 
            className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* 이전/다음 버튼 */}
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-auto z-10"
                aria-label="Previous image"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-auto z-10"
                aria-label="Next image"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </>
          )}

          {/* 슬라이드 대쉬 인디케이터 */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_: any, imgIdx: number) => (
                <button
                  key={imgIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIndex(imgIdx);
                  }}
                  className={`h-[2px] transition-all duration-300 ${
                    currentImgIndex === imgIdx ? 'bg-white w-6' : 'bg-white/40 w-1.5'
                  }`}
                  aria-label={`Go to slide ${imgIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* 텍스트 내용 */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-black text-lg text-gray-900 mb-2.5 group-hover:text-accent transition-colors">{unit.title}</h4>
            <p className="text-sm sm:text-[15px] text-[#555555] leading-relaxed font-semibold">{unit.desc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

