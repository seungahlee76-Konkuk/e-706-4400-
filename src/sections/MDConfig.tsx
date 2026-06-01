import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MapPin, Sparkles, Building, ArrowRight, Settings, Upload } from 'lucide-react';
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
// Dynamically map from our single source of truth in state/constants (mdData)
const STORE_UNITS: StoreUnit[] = (mdData || DEFAULT_MD_DATA).map((custom: any) => {
  let mergedImages = custom.images || [custom.image];
  if (custom.image && (!mergedImages || mergedImages.length === 0 || mergedImages[0] !== custom.image)) {
    // If the primary image was customized, let's keep it as the first item of the carousel
    mergedImages = [custom.image, ...(custom.images?.slice(1) || [])];
  }

  // 예전의 길고 투박한 기호/문장이 담긴 로컬 스토리지를 자동으로 치환하여 정보 위계를 한눈에 정리합니다.
  let cleanType = custom.type || '';
  if (cleanType.includes('[대형 휴식 공간]')) {
    cleanType = '대형 휴식 공간(브런치 / 베이커리 카페)';
  } else if (cleanType.includes('[빠른 회전율]')) {
    cleanType = '빠른 회전율(국밥 / 설렁탕 전문점)';
  } else if (cleanType.includes('[가족 맞춤 식당]')) {
    cleanType = '가족 맞춤 식당(중소형 샤브샤브 / 찜닭)';
  } else if (cleanType.includes('[포장·배달 특화]')) {
    cleanType = '포장·배달 특화(피자 / 에그 샌드위치)';
  } else if (cleanType.includes('[시선 집중 코너]')) {
    cleanType = '시선 집중 코너(생활맥주 / 프랜차이즈 맥주)';
  }

  return {
    id: custom.id,
    area: custom.area,
    type: cleanType,
    desc: custom.desc,
    recommendation: custom.recommendation || custom.type,
    images: mergedImages,
    coords: custom.coords || { x: 0, y: 0 },
    category: custom.category || '공통',
    categoryStyle: custom.categoryStyle || 'bg-gray-50 text-gray-700 border border-gray-100/60'
  };
});

// SVG 앵커 포인트 정의 (보행 동선 역추적 시작점)
const TRAFFIC_ANCHORS = [
  { id: 'gate2', label: '후문 동선 (후문 약국행)', x: 22, y: 35, color: '#0D9488' },
  { id: 'gate1', label: '정문 동선', x: 6, y: 85, color: '#F43F5E' }
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
        label: '후문 동선 (후문 약국행)',
        color: '#0D9488',
        points: [{ x: 22, y: 35 }, { x: 37, y: 42 }, { x: 37, y: 38 }]
      }];
    case '118호':
      return [{
        startId: 'gate2',
        label: '후문 동선 (후문 약국행)',
        color: '#0D9488',
        points: [{ x: 22, y: 35 }, { x: 28, y: 33 }]
      }];
    case '119호':
      return [
        {
          startId: 'gate2',
          label: '후문 동선 (후문 약국행)',
          color: '#0D9488',
          points: [{ x: 22, y: 35 }, { x: 22, y: 45 }, { x: 28, y: 45 }]
        }
      ];
    case '126호':
      return [
        {
          startId: 'gate1',
          label: '정문 동선',
          color: '#F43F5E',
          points: [{ x: 6, y: 85 }, { x: 6, y: 95 }, { x: 44, y: 95 }, { x: 44, y: 84.5 }]
        },
        {
          startId: 'gate2',
          label: '후문 동선',
          color: '#0D9488',
          points: [{ x: 22, y: 35 }, { x: 22, y: 95 }, { x: 44, y: 95} ,  { x: 44, y: 84.5 }]
        }
      ];
    case '127호':
      return [
        {
          startId: 'gate1',
          label: '정문 동선',
          color: '#F43F5E',
          points: [{ x: 6, y: 85 }, { x: 6, y: 95 }, { x: 48, y: 95 }, { x: 48, y: 84.5 }]
        },
        {
          startId: 'gate2',
          label: '후문 동선',
          color: '#0D9488',
          points: [{ x: 22, y: 35 }, { x: 22, y: 95 }, { x: 48, y: 95}, { x: 48, y: 84.5 }]
        }
      ];
    case '128호':
      return [
        {
          startId: 'gate1',
          label: '정문 동선',
          color: '#F43F5E',
          points: [{ x: 6, y: 85 }, { x: 6, y: 95 }, { x: 51, y: 95 }, { x: 51, y: 84.5 }]
        },
        {
          startId: 'gate2',
          label: '후문 동선',
          color: '#0D9488',
          points: [{ x: 22, y: 35 }, { x: 22, y: 95 }, { x: 51, y: 95}, { x: 51, y: 84.5 }]
        }
      ];
    case '129호':
      return [
        {
          startId: 'gate1',
          label: '정문 동선',
          color: '#F43F5E',
          points: [{ x: 6, y: 85 }, { x: 6, y: 95 }, { x: 54, y: 95 }, { x: 54, y: 84.5 }]
        },
        {
          startId: 'gate2',
          label: '후문 동선',
          color: '#0D9488',
          points: [{ x: 22, y: 35 }, { x: 22, y: 95 }, { x: 54, y: 95}, { x: 54, y: 84.5 }]
        }
      ];
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

function MDImageSlider({ images: rawImages, title, badgeText, isMobile = false }: MDImageSliderProps) {
  const images = (rawImages || []).filter((img: string) => img && img.trim() !== '');
  const finalImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800'];
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeIndex = currentIndex >= finalImages.length ? 0 : currentIndex;

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + finalImages.length) % finalImages.length);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % finalImages.length);
  };

  return (
    <div className="w-full h-full relative group/slider overflow-hidden bg-stone-100">
      <img
        src={finalImages[safeIndex]}
        alt={`${title} view ${safeIndex + 1}`}
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
          <span className="text-xs font-black tracking-widest uppercase">Concept Image ({safeIndex + 1}/{finalImages.length})</span>
        </div>
      )}

      {/* Chevron down with 90/-90 degree rotation for sliders */}
      {finalImages.length > 1 && (
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
      {finalImages.length > 1 && (
        <div className={`absolute bottom-3 flex gap-1.5 z-20 ${isMobile ? 'left-1/2 -translate-x-1/2' : 'right-4'}`}>
          {finalImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                safeIndex === idx ? 'bg-accent w-5' : 'bg-white/50 w-1.5'
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
  // 기본적으로 118호를 활성화
  const [activeUnit, setActiveUnit] = useState<string>('118호');
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [sectionTitle, setSectionTitle] = useState<string>(() => {
    const raw = localStorage.getItem('site_custom_md_section_title');
    if (raw === '수원덕산병원 상가 입점 가이드' || !raw) {
      return 'e편한세상시티 고색 상가 입점 가이드';
    }
    return raw;
  });
  const [blueprintImg, setBlueprintImg] = useState<string>(() => {
    return localStorage.getItem('site_custom_md_blueprint_img') || 'https://i.ibb.co/pjDBc2bh/image.png';
  });

  const [units, setUnits] = useState<StoreUnit[]>(STORE_UNITS);

  const selectedUnit = units.find(u => u.id === activeUnit) || units[0];

  const updateUnitValue = (id: string, field: keyof StoreUnit, value: any) => {
    const updated = units.map(u => {
      if (u.id === id) {
        return { ...u, [field]: value };
      }
      return u;
    });
    setUnits(updated);

    // Sync to sitewise mdData for Admin panel compatibility
    const adminFormat = updated.map(u => ({
      id: u.id,
      type: u.type,
      area: u.area,
      desc: u.desc,
      image: u.images[0] || '',
      coords: u.coords,
      images: u.images,
      category: u.category,
      categoryStyle: u.categoryStyle,
      recommendation: u.recommendation
    }));
    localStorage.setItem('site_custom_md_data', JSON.stringify(adminFormat));
  };

  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          callback(compressed);
        } else {
          callback(e.target?.result as string);
        }
      };
      img.onerror = () => {
        callback(reader.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <section 
      id="md" 
      className="bg-white relative w-full"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* 선 애니메이션용 CSS 인젝션 */}
      <style>{`
        @media (min-width: 768px) {
          .split-bg-container {
            background: linear-gradient(to right, #F4F5F7 55%, #FFFFFF 55%) !important;
          }
        }
        @keyframes dash-flow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -120;
          }
        }
        .animate-dash-flow {
          animation: dash-flow 4.2s linear infinite;
        }
        @keyframes path-draw {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-path-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: path-draw 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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

      {/* 1. 독립된 상단 타이틀 영역 (배경: 순백색 #FFFFFF) */}
      <div className="pt-12 md:pt-28 pb-2 md:pb-16 px-6 bg-[#FFFFFF]">
        <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <span className="text-accent font-bold tracking-[0.2em] text-[11px] uppercase block">Premium MD Curation</span>
            {isEditMode ? (
              <div className="max-w-2xl mx-auto mb-4 px-6">
                <label className="block text-[10px] font-bold text-accent mb-1 uppercase tracking-wider">대시보드 메인 타이틀 편집</label>
                <input 
                  type="text" 
                  className="w-full text-center text-xl sm:text-2xl md:text-3xl font-bold border border-accent/40 bg-white px-4 py-2 text-stone-900 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  value={sectionTitle} 
                  onChange={(e) => {
                    setSectionTitle(e.target.value);
                    localStorage.setItem('site_custom_md_section_title', e.target.value);
                  }} 
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 mt-4 tracking-tight leading-tight break-keep">
                  {sectionTitle}
                </h2>
              </div>
            )}
            <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* 2. 하단 독립된 스플릿 영역 (반반 배경 적용) */}
      <div className="split-bg-container pt-3 pb-10 md:py-20 px-6 relative">
        <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12">

          {/* 모바일 (md 미만) 전용 고급스러운 프롭테크 대시보드 리스트 뷰 */}
          <div className="block md:hidden mb-8 -mx-6 w-[calc(100%+3rem)]">
          <div className="bg-transparent">
            <div className="flex flex-col">
              <AnimatePresence initial={false}>
                {(isMobileExpanded ? units : units.slice(0, 3)).map((unit, index) => (
                  <motion.div 
                    key={unit.id}
                    initial={index >= 3 ? { opacity: 0, height: 0 } : false}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="bg-transparent py-5 border-b border-stone-200/60 last:border-b-0 flex flex-col overflow-hidden"
                  >
                    
                    {/* 1. 카탈로그 메타데이터 상단 배치 */}
                    <div className="flex items-center justify-between mb-3 py-3 px-5 bg-[#F5F3ED] border-y border-stone-200/40">
                      <span className="text-[15px] font-bold text-stone-950 tracking-tight font-sans">
                        {unit.id} <span className="mx-2 text-stone-300 font-normal">|</span> 전용 {unit.area}
                      </span>
                      <span className={`px-2.5 py-1 text-[11px] font-bold tracking-tight rounded ${unit.categoryStyle} font-sans`}>
                        {unit.category}
                      </span>
                    </div>

                    {/* 2. 에셋 타이틀 */}
                    <h4 className="text-[17px] sm:text-[19px] font-bold text-stone-950 leading-snug mb-3 tracking-tight break-keep px-5">
                      {unit.desc}
                    </h4>

                    {/* 3. 이미지 */}
                    <div className="w-full aspect-[16/9] bg-stone-100 overflow-hidden relative mb-4">
                      <MDImageSlider 
                        images={unit.images} 
                        title={unit.type} 
                        badgeText="MD REAL-VIEW" 
                        isMobile={true} 
                      />
                    </div>

                    {/* 4. 입지 공학적 데이터 분석 정보 */}
                    {/* 권장 MD 디스플레이 */}
                    <div className="w-full bg-accent/5 border-y border-accent/15 py-4 px-5 mb-4 space-y-3">
                      <span className="text-[14px] sm:text-[15px] font-black text-accent block font-sans tracking-wide">▷ 권장 테넌트:</span>
                      <div className="pt-2 border-t border-accent/10">
                        <p className="text-[14px] sm:text-[15px] font-extrabold text-stone-950 leading-relaxed font-sans antialiased select-none">
                          {unit.recommendation}
                        </p>
                      </div>
                    </div>

                    {/* 모바일 실시간 편집 폼 */}
                    {isEditMode && (
                      <div className="mx-5 p-4 bg-white border border-accent/20 rounded-xl space-y-4 shadow-sm mb-4">
                        <h5 className="text-xs font-semibold text-accent flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> {unit.id} 정보 및 미디어 실시간 수정
                        </h5>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">전용면적</label>
                            <input 
                              type="text" 
                              value={unit.area} 
                              onChange={(e) => updateUnitValue(unit.id, 'area', e.target.value)}
                              className="w-full text-xs font-semibold bg-white border border-stone-300 rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">대표 샵 업종</label>
                            <input 
                              type="text" 
                              value={unit.type} 
                              onChange={(e) => updateUnitValue(unit.id, 'type', e.target.value)}
                              className="w-full text-xs font-semibold bg-white border border-stone-300 rounded px-2 py-1"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">상가 비주얼 카피라이팅</label>
                          <input 
                            type="text" 
                            value={unit.desc} 
                            onChange={(e) => updateUnitValue(unit.id, 'desc', e.target.value)}
                            className="w-full text-xs font-semibold bg-white border border-stone-300 rounded px-2 py-1"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">권장 테넌트(MD) 리스트</label>
                          <textarea 
                            rows={2}
                            value={unit.recommendation} 
                            onChange={(e) => updateUnitValue(unit.id, 'recommendation', e.target.value)}
                            className="w-full text-xs font-semibold bg-white border border-stone-300 rounded px-2 py-1"
                          />
                        </div>

                        {/* 이미지 관리 */}
                        <div className="space-y-1.5 border-t border-stone-100 pt-3">
                          <span className="block text-[10px] font-semibold text-stone-500">📸 실사 분위기 슬라이더 업로드 (최대 4장)</span>
                          {[0, 1, 2, 3].map((imgIdx) => {
                            const imgUrl = unit.images && unit.images[imgIdx] ? unit.images[imgIdx] : '';
                            return (
                              <div key={imgIdx} className="flex gap-2 items-center">
                                <span className="text-[10px] font-semibold text-stone-400 w-3">#{imgIdx + 1}</span>
                                <input 
                                  type="text" 
                                  value={imgUrl} 
                                  placeholder="이미지 URL 주소 또는 우측 파일 업로드"
                                  onChange={(e) => {
                                    const newImages = [...(unit.images || [])];
                                    newImages[imgIdx] = e.target.value;
                                    updateUnitValue(unit.id, 'images', newImages);
                                  }}
                                  className="flex-1 text-[10px] font-mono border border-stone-300 rounded px-2 py-1 bg-white"
                                />
                                <label className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[10px] font-bold cursor-pointer whitespace-nowrap">
                                  <Upload className="w-3 h-3 text-stone-600" />
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleImageUpload(file, (base64) => {
                                          const newImages = [...(unit.images || [])];
                                          newImages[imgIdx] = base64;
                                          updateUnitValue(unit.id, 'images', newImages);
                                        });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 전체 추천 호실 더보기 (세련된 고스트 버튼) */}
            {!isMobileExpanded && units.length > 3 && (
              <div className="px-5 pt-8 pb-4 flex justify-center text-center">
                <button
                  type="button"
                  onClick={() => setIsMobileExpanded(true)}
                  className="w-full max-w-[320px] py-4 px-6 text-[13px] font-extrabold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] tracking-tight group"
                >
                  <span> 전체 추천 호실 더보기</span>
                  <ChevronDown className="w-4 h-4 text-slate-700 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
          </div>

        {/* 1. 최상위 부모 컨테이너 (★ items-start가 핵심입니다) */}
        <div className="hidden md:flex flex-col md:flex-row items-start gap-0 w-full relative mb-14">
          
          {/* 2. 왼쪽 도면 영역 (★ sticky와 top-24를 줍니다) */}
          <div className="w-full md:w-[55%] sticky top-24 z-10 transition-all duration-300 md:pr-8 lg:pr-12 xl:pr-16">
            
            {/* 고급스러운 카드 UI 적용 (p-0 w-full overflow-hidden) */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-0 w-full overflow-hidden flex flex-col">
              <div className="flex justify-between items-start p-5 pb-4">
                <div>
                  <span className="text-accent font-semibold text-[10px] tracking-widest uppercase block mb-1">COMMERCIAL FLOW</span>
                  <h2 className="text-xl font-bold text-slate-800 leading-none">
                    실시간 보행자 유입 동선 맵
                  </h2>
                </div>

                {/* 도면 도색 관리 퀵 컨트롤 */}
                {isEditMode && (
                  <div className="bg-amber-50/50 border border-accent/20 p-2.5 rounded-lg flex items-center gap-2 max-w-xs shrink-0 z-20">
                    <div className="text-[10px] text-stone-700 leading-none">
                      <span className="font-bold text-accent block mb-1">🗺️ 1층 도면 평면도 교체</span>
                      <label className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-stone-50 border border-stone-300 rounded text-[9px] font-bold cursor-pointer transition-colors">
                        <Upload className="w-2.5 h-2.5 text-stone-600" />
                        파일 선택
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (base64) => {
                                setBlueprintImg(base64);
                                localStorage.setItem('site_custom_md_blueprint_img', base64);
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* 이미지와 SVG 애니메이션 코드가 들어가는 영역 (액자 외부 여백 추가) */}
              <div className="relative w-full h-auto p-5 md:p-6">
                <style>{`
                  .white-premium-frame {
                    background: #FFFFFF !important;
                    background-color: #FFFFFF !important;
                    border: 1px solid rgba(0, 0, 0, 0.04) !important;
                    border-radius: 24px !important;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08) !important;
                    padding: 32px !important;
                  }
                  @media (max-width: 640px) {
                    .white-premium-frame {
                      padding: 24px !important;
                    }
                  }
                  .blueprint-matching-img {
                    border-radius: 8px !important;
                  }
                `}</style>
                {/* 1. 지도를 담는 하이엔드 액자 (Wrapper) - 화이트 카드 프레임 강제 지정 */}
                <div 
                  className="white-premium-frame relative w-full h-auto md:h-max"
                >
                  {/* 도면 캔버스 내부 컨테이너 - 이미지 크기에 정확히 동기화되어 SVG 오버레이 자리를 보존 */}
                  <div className="relative w-full h-auto">
                    {/* 이미지의 원본 비율과 100% 투명도 수치를 복원하고 기본 여백이 없도록 block 적용, 겉 액자에 대응하는 모서리 라운딩 적용 */}
                    <img 
                      src={blueprintImg || "https://i.ibb.co/pjDBc2bh/image.png"} 
                      alt="1F Blueprint Map Layout" 
                      className="blueprint-matching-img w-full h-auto pointer-events-none select-none opacity-100 block object-cover"
                    />

                  {/* SVG 오버레이 애니메이션 레이어 (viewBox 0 0 100 100 백분율 상대좌표 동기화 및 찌그러짐 방지 잠금) */}
                  <svg 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full z-10 select-none pointer-events-auto"
                  >
                    {/* 1. 보행 유도 앵커 포인트 그리기 */}
                    {TRAFFIC_ANCHORS.map((anchor) => {
                      return (
                        <g key={anchor.id} className="cursor-help">
                          <circle cx={anchor.x} cy={anchor.y} r="2.5" fill={anchor.color} opacity="0.15" />
                          <circle cx={anchor.x} cy={anchor.y} r="0.8" fill={anchor.color} />
                          <circle cx={anchor.x} cy={anchor.y} r="0.1" fill="#fff" />
                        </g>
                      );
                    })}

                     {/* 2. 보행 동선 그리기 (고정밀 단일 레이어 직교 직선 & 출발지->목적지 실선 드로잉 흐름 모션 연동) */}
                    {getFlowPaths(selectedUnit.id).map((flow) => {
                      const pathD = buildPathData(flow.points);
                      return (
                        <g key={`flow-grp-${flow.startId}-${selectedUnit.id}`}>
                          <style>{`
                            @keyframes flowMovement {
                              to {
                                stroke-dashoffset: -20;
                              }
                            }
                            .flow-active-dash {
                              stroke-dasharray: 6 4;
                              animation: flowMovement 1s linear infinite;
                            }
                          `}</style>
                          {/* Quiet base trail */}
                          <path 
                            key={`flow-path-base-${flow.startId}-${selectedUnit.id}`}
                            d={pathD} 
                            fill="none" 
                            stroke={flow.color} 
                            strokeWidth="1.0" 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.15" 
                          />
                          {/* Active traveling flow segment */}
                          <path 
                            key={`flow-path-${flow.startId}-${selectedUnit.id}`}
                            d={pathD} 
                            fill="none" 
                            stroke={flow.color} 
                            strokeWidth="1.0" 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.85" 
                            className="flow-active-dash"
                          />
                        </g>
                      );
                    })}

                    {/* [★ 동선 직접 추가 및 개별 수정용 코드 블록]
                        지도 위에 선을 직접 그리거나 보조 유도선을 상시 띄우고 싶을 때, 아래 <path> 요소를 자유롭게 복제/수정해 사용하실 수 있습니다.
                        - M {startX} {startY} : 선이 시작되는 좌표 (예: 후문 22 35)
                        - L {endX} {endY} : 선이 꺾이거나 도달하는 좌표 (예: 복도 중심 22 84.5)
                        - stroke : 선의 색 코드
                        - strokeWidth : 선 두께
                    */}
                    <path
                      id="manual-sub-flow-connector"
                      d="M 22 35 L 22 84.5"
                      fill="none"
                      stroke="#0D9488"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.35}
                      strokeDasharray="2 3"
                    />

                    {/* 3. 모든 호실의 원형 핀 노드 표기 (정밀 백분율 좌표 연동) */}
                    {units.map((unit) => {
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

                      const rectWidth = isActive ? 6.2 : 5.0;
                      const rectHeight = isActive ? 2.3 : 1.8;
                      const rectX = unit.coords.x - rectWidth / 2;
                      const rectY = unit.coords.y - labelYOffset;
                      const textY = rectY + (isActive ? 1.65 : 1.35);
                      
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
                              stroke={isActive ? "#e66400" : "#002C5F"} 
                              strokeWidth="0.12" 
                              strokeDasharray="0.3 0.3"
                              opacity="0.8"
                            />
                          )}

                          {/* 위치 마커 */}
                          <circle 
                            cx={unit.coords.x} 
                            cy={unit.coords.y} 
                            r={isActive ? "1.3" : "0.85"} 
                            fill={isActive ? "#e66400" : "#002C5F"} 
                            stroke="#FFF" 
                            strokeWidth={isActive ? "0.3" : "0.18"}
                            className="transition-all duration-300 group-hover:fill-accent"
                          />
                          
                          {/* 인포 칩 라벨 (최고의 시인성을 위해 테두리 두께 및 글씨 굵기 보강) */}
                          <rect 
                            x={rectX} 
                            y={rectY} 
                            width={rectWidth} 
                            height={rectHeight} 
                            rx="0.4" 
                            fill={isActive ? "#002C5F" : "#FFFFFF"} 
                            stroke={isActive ? "#e66400" : "#1e293b"} 
                            strokeWidth={isActive ? "0.35" : "0.22"} 
                            opacity="1.0"
                            className="transition-all duration-300 shadow-md"
                          />
                          <text 
                            x={unit.coords.x} 
                            y={textY} 
                            fill={isActive ? "#FFFFFF" : "#0f172a"} 
                            fontSize={isActive ? "1.5" : "1.25"} 
                            fontWeight="900" 
                            textAnchor="middle"
                            className="select-none font-sans font-black"
                          >
                            {unit.id.replace('호', '')}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

              {/* 하단 범례 */}
              <div className="p-5 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-4 flex-wrap">
                  {TRAFFIC_ANCHORS.map((anchor) => (
                    <div key={anchor.id} className="flex items-center gap-1.5 text-xs font-semibold text-stone-600">
                      <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: anchor.color }} />
                      <span>{anchor.label}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] font-bold text-accent flex items-center gap-1 uppercase select-none">
                  <Sparkles className="w-3.5 h-3.5" /> 
                  호실 마커 클릭시 개별 동선 표시
                </div>
              </div>
            </div>

          </div>

          {/* 3. 오른쪽 리스트 영역 */}
          {/* ★ 좌측 정렬(justify-start)로 원복하여 좁은 공간이나 고해상도 전체화면에서도 왼쪽이 절대 잘리지 않도록 안전을 가합니다 */}
          <div className="w-full md:w-[45%] flex justify-start pb-12 md:pl-10 lg:pl-14 xl:pl-20 md:pr-4 lg:pr-8">
            
            {/* ★ 진짜 콘텐츠가 담기는 이너 박스 (가로 폭을 유연하게 잡고, max-w-xl로 자연물 정돈합니다) */}
            <div className="w-full max-w-xl flex flex-col gap-6 md:bg-white md:border md:border-gray-200 md:rounded-[20px] md:p-8 md:px-6 md:shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              {/* PC/Tablet 전용 안내 멘트: 👉 우측 리스트의 호실을 클릭하면 동선이 표시됩니다 */}
              <div 
                className="hidden md:inline-flex self-start items-center justify-center px-4 py-2 mt-1 rounded-full bg-[#000E26] border border-white/10 shadow-sm"
              >
                <span 
                  className="text-xs font-semibold tracking-tight"
                  style={{ color: '#45ffde' }}
                >
                  👉 우측 리스트의 호실을 클릭하면 동선이 표시됩니다
                </span>
              </div>
              
              <div className="py-2 bg-transparent border-b border-gray-200 pb-3 flex justify-between items-end">
              <div>
                <span className="text-accent font-semibold text-[10px] tracking-widest uppercase block mb-1">TARGET CATEGORY</span>
                <h3 className="text-xl font-bold text-stone-900 tracking-tight">호실별 최적 권장업종</h3>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 select-none pb-0.5">전용면적 기준</span>
            </div>

            {/* 아코디언 컨테이너 (부드러운 열기/닫기 상호배타 구조) */}
            <div className="flex-1 p-4 sm:p-5 lg:p-0 flex flex-col gap-3.5 sm:gap-4 lg:gap-0 bg-slate-50 lg:bg-transparent divide-y divide-stone-200/60 lg:divide-y">
              {units.map((unit) => {
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
                      className={`w-full text-left py-5 sm:py-6.5 lg:py-6 px-4 sm:px-5 lg:px-4 flex items-center justify-between transition-all duration-300 group ${
                        isOpen ? 'bg-amber-50/10 lg:bg-stone-50/80' : 'bg-white lg:bg-transparent hover:bg-slate-50/40 lg:hover:bg-stone-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-4 sm:gap-6 lg:gap-5">
                        {/* 호실 번호 강조 */ }
                        <div className="flex items-center leading-none shrink-0 border-r border-stone-200/60 pr-4">
                          <span className={`text-2xl sm:text-3xl lg:text-[22px] font-semibold tracking-tight transition-colors ${
                            isOpen ? 'text-accent' : 'text-slate-800 lg:text-slate-800 group-hover:text-accent'
                          }`}>
                            {unit.id.replace('호', '')}
                          </span>
                          <span className={`text-base sm:text-lg lg:text-[15px] font-medium ml-0.5 mt-1 transition-colors ${
                            isOpen ? 'text-accent' : 'text-slate-500 group-hover:text-slate-700'
                          }`}>호</span>
                        </div>

                        <div>
                          <div className="flex items-center flex-wrap gap-2 lg:gap-3">
                            <p className={`text-[15px] sm:text-[17px] lg:text-[15px] font-semibold tracking-tight text-wrap break-keep leading-[1.5] transition-colors ${
                              isOpen ? 'text-accent font-bold' : 'text-stone-900 group-hover:text-accent'
                            }`}>
                              {unit.type}
                            </p>
                            <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded select-none transition-all duration-300 ${unit.categoryStyle}`}>
                              {unit.category}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500 font-normal block mt-1.5 leading-[1.5]">
                            실평수: {unit.area}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-auto shrink-0 pl-4">
                        {isOpen && (
                          <span className="text-[9px] bg-accent text-white px-2 py-0.5 font-bold tracking-widest uppercase">
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
                          <div className="flex flex-col p-5 sm:p-6 gap-6">
                            {/* 풀 와이드 시네마틱 이미지 (직사각형 16:9 비율) */}
                            <div className="w-full aspect-video overflow-hidden relative rounded-xl shadow-md bg-stone-100">
                              <MDImageSlider 
                                images={unit.images} 
                                title={unit.type} 
                                badgeText="MD REAL-VIEW" 
                                isMobile={false} 
                              />
                            </div>

                            {/* 상세 카피라이팅 & 추천 텍스트 리스트 */}
                            <div className="w-full mt-4 flex flex-col gap-4">
                              <div>
                                {/* 타이틀을 콤팩트하고 조화로운 굵기로 전개 */}
                                <p className="text-base sm:text-lg lg:text-[15px] font-extrabold text-stone-950 leading-relaxed mb-3 flex gap-1.5 items-start text-wrap break-keep">
                                  <span className="text-accent shrink-0 font-bold">▶</span>
                                  <span>{unit.desc}</span>
                                </p>
                                
                                <div className="pt-3 border-t border-stone-200/60">
                                  <span className="text-xs font-bold tracking-wider uppercase text-stone-500 block mb-1.5 font-sans">권장 테넌트(MD) 리스트</span>
                                  <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg shadow-sm">
                                    {/* 추천 업종 텍스트의 폰트 두께 및 컬러를 desc와 일치하도록 최적화 */}
                                    <p className="text-sm sm:text-[15px] lg:text-[14px] font-extrabold text-stone-950 leading-relaxed text-wrap break-keep font-sans antialiased">
                                      {unit.recommendation}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* PC 실시간 편집 폼 */}
                              {isEditMode && (
                              <div className="p-4 bg-white border border-accent/20 rounded-xl mt-4 space-y-4 shadow-inner">
                                <h5 className="text-xs font-semibold text-accent flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5" /> {unit.id} 정보 및 미디어 실시간 수정
                                </h5>
                                
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-stone-500 mb-1">전용면적</label>
                                    <input 
                                      type="text" 
                                      value={unit.area} 
                                      onChange={(e) => updateUnitValue(unit.id, 'area', e.target.value)}
                                      className="w-full text-xs font-semibold bg-white border border-stone-300 rounded px-2.5 py-1.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-stone-500 mb-1">대표 샵 업종</label>
                                    <input 
                                      type="text" 
                                      value={unit.type} 
                                      onChange={(e) => updateUnitValue(unit.id, 'type', e.target.value)}
                                      className="w-full text-xs font-semibold bg-white border border-stone-300 rounded px-2.5 py-1.5"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold text-stone-500 mb-1">상가 비주얼 카피라이팅</label>
                                  <input 
                                    type="text" 
                                    value={unit.desc} 
                                    onChange={(e) => updateUnitValue(unit.id, 'desc', e.target.value)}
                                    className="w-full text-xs font-semibold bg-white border border-stone-300 rounded px-2.5 py-1.5"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold text-stone-500 mb-1">권장 테넌트(MD) 리스트</label>
                                  <textarea 
                                    rows={2}
                                    value={unit.recommendation} 
                                    onChange={(e) => updateUnitValue(unit.id, 'recommendation', e.target.value)}
                                    className="w-full text-xs font-semibold bg-white border border-stone-300 rounded px-2.5 py-1.5"
                                  />
                                </div>

                                {/* 이미지 업로드 */}
                                <div className="space-y-1.5 border-t border-stone-100 pt-3">
                                  <span className="block text-[10px] font-semibold text-stone-500">📸 실사 분위기 슬라이더 업로드 (최대 4장)</span>
                                  {[0, 1, 2, 3].map((imgIdx) => {
                                    const imgUrl = unit.images && unit.images[imgIdx] ? unit.images[imgIdx] : '';
                                    return (
                                      <div key={imgIdx} className="flex gap-2 items-center">
                                        <span className="text-[10px] font-semibold text-stone-400 w-3">#{imgIdx + 1}</span>
                                        <input 
                                          type="text" 
                                          value={imgUrl} 
                                          placeholder="이미지 URL 주소 또는 우측 파일 업로드"
                                          onChange={(e) => {
                                            const newImages = [...(unit.images || [])];
                                            newImages[imgIdx] = e.target.value;
                                            updateUnitValue(unit.id, 'images', newImages);
                                          }}
                                          className="flex-1 text-[10px] font-mono border border-stone-300 rounded px-2 py-1 bg-white"
                                        />
                                        <label className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[10px] font-bold cursor-pointer whitespace-nowrap">
                                          <Upload className="w-3 h-3 text-stone-600" />
                                          <input 
                                            type="file" 
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                handleImageUpload(file, (base64) => {
                                                  const newImages = [...(unit.images || [])];
                                                  newImages[imgIdx] = base64;
                                                  updateUnitValue(unit.id, 'images', newImages);
                                                });
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
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

        </div>
      </div>
    </div>

      {/* 3. 오피스텔 섹션 유지 (개인/상가 정보가 섞이지 않도록 단일 #F8F9FA 배경을 유지하며 하단 배치) */}
      <div id="officetel" className="py-10 md:py-16 px-6 bg-[#F8F9FA] border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12">
          <div className="pt-8 md:pt-14 border-t border-stone-200/50">
            <div className="text-center mb-8 md:mb-12">
              <span className="text-accent font-black tracking-[0.25em] text-[11px] uppercase block mb-3">PREMIUM RESIDENCE</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-6 break-keep">주거용 오피스텔 상품안내</h2>
              <div className="mt-2.5">
                <span className="text-sm sm:text-base md:text-[17.5px] text-gray-900 font-semibold tracking-[-0.04em] block leading-[1.4]">
                  시행사 <span className="text-[#FF6600] font-bold">특별 보유분</span> 한정
                  <br />
                  프리미엄 리저브 세대
                </span>
              </div>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 md:gap-8 -mx-6 w-[calc(100%+3rem)] md:mx-0 md:w-full">
              {officetelData.map((unit: any, idx: number) => (
                <OfficetelProductCard key={idx} unit={unit} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 전용 [ ∧ 리스트 닫기 ] 플로팅 sticky 버튼 */}
      <AnimatePresence>
        {isMobileExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="md:hidden fixed bottom-7 left-1/2 z-[100]"
          >
            <button
              type="button"
              onClick={() => {
                setIsMobileExpanded(false);
                // 접기 완료 후 원래 상가 리스트 시작 위치로 부드럽게 스크롤
                const el = document.getElementById('md');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[#0A1D37] hover:bg-[#051329] text-white font-extrabold text-[13px] tracking-tight px-6 py-3.5 rounded-[30px] flex items-center justify-center gap-1.5 shadow-[0_12px_36px_rgba(10,29,55,0.3)] border border-white/10 active:scale-95 transition-all w-max leading-none"
            >
              <ChevronDown className="w-4 h-4 rotate-180 text-white" />
              <span>리스트 닫기</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
      <div className="w-full bg-transparent pb-8 border-b border-stone-200/50 last:border-b-0 flex flex-col md:rounded-none md:overflow-hidden md:border md:border-stone-200 md:bg-white md:h-full md:pb-0 md:transition-all md:duration-500 md:hover:border-accent">
        {/* 이미지 영역 슬라이더 */}
        <div className="w-full aspect-[16/10] md:h-64 md:aspect-auto overflow-hidden relative group/slider bg-stone-50">
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
        <div className="pt-5 px-5 md:p-6 md:flex-1 md:flex md:flex-col md:justify-between">
          <div>
            <h4 className="font-black text-[18px] sm:text-[20px] md:text-lg text-gray-900 mb-2.5 group-hover:text-accent transition-colors leading-tight">{unit.title}</h4>
            <p className="text-sm sm:text-[15px] text-[#555555] leading-relaxed font-semibold">{unit.desc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

