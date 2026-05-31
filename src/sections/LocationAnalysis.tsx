import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Phone, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { analysisData } from '../constants';

const DEFAULT_CARDNEWS_DATA = [
  {
    id: 'medical',
    title: '의료',
    subTitle: 'MEDICAL PREMIUM',
    mainTitle: '수원덕산병원 프리미엄',
    headline: '706병상 수원 최대 핵심 메디컬 타워 바로 앞 초밀착 입지',
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    slides: [
      {
        title: '수원 TOP 3 메머드급 규모 및 원스톱 진료 체계',
        desc: '1차 457병상, 최종 706병상 규모로 30여 개의 다양한 진료과를 운영합니다. 필수 진료과가 한곳에 집결되어 완벽한 원스톱 진료가 가능합니다.',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: '존스홉킨스·빅5 출신 등 최상위 의료진 포진',
        desc: '해외 유수 의료기관 및 국내 빅5 출신 전문의가 상주합니다. 대형 수술 및 각 진료 분과 전문의들이 대거 상주하여 최고 의료 서비스를 제공합니다.',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: '경기 남부 중증 질환 치료의 거점 상가',
        desc: '심뇌혈관, 중증외상 등 특화 센터를 통해 경기 남부권 의료 중심지로 활약하며 메디컬 연계 상가의 풍부한 배후수요와 연중 안정적 유입을 견인합니다.',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'traffic',
    title: '교통',
    subTitle: 'TRAFFIC INFRASTRUCTURE',
    mainTitle: '고색역 초역세권 입지',
    headline: '수인분당선 직통 주파 및 광역 신설 교통망의 초강력 집결형 노선',
    coverImage: 'https://i.ibb.co/S4VygwN5/400-250.jpg',
    slides: [
      {
        title: '수인분당선 고색역 직접 도보 역세권',
        desc: '강남, 분당, 인천을 관통하는 수인분당선 고색역이 고작 도보 200m에 인접해 있어, 수도권 전역에서 역세권 중심지로의 유입이 탁월합니다.',
        image: 'https://i.ibb.co/S4VygwN5/400-250.jpg'
      },
      {
        title: '수원역 1정거장 (GTX-C·KTX 광역교통망)',
        desc: '고색역에서 단 한정거장 위치의 수원역 교통 허브를 통해 KTX와 2028년 개통 예정인 GTX-C 전국 광역교통 수혜를 입체적으로 향유합니다.',
        image: 'https://i.ibb.co/SGYJfXb/2026-05-29-150925.png'
      },
      {
        title: '신분당선 연장선 (구운역 신설 유치 확정)',
        desc: '구운역 신설 확정에 이어 신분당선 연계 호재로 강남권 및 판교 테크노밸리와의 공간적 대칭성이 획기적으로 개선될 전망입니다.',
        image: 'https://i.ibb.co/gFwLkKnv/2026-05-29-152645.png'
      }
    ]
  },
  {
    id: 'admin',
    title: '행정',
    subTitle: 'GOVERNMENT TOWN',
    mainTitle: '권선행정타운 복합상권',
    headline: '구청·보건소·우체국을 밀착하여 품은 평일/주말 365일 배후지',
    coverImage: 'https://images.unsplash.com/photo-1577416414929-7a4c9f17f6b4?auto=format&fit=crop&q=80&w=800',
    slides: [
      {
        title: '행정 벨트와 교통 배후수요의 공조 복합 상권',
        desc: '종합병원 의료 수요에 서수원의 핵심 행정 중추 권선행정타운 공직 상주인구 유입을 합작하여 최고의 안정적인 매출을 지지합니다.',
        image: 'https://images.unsplash.com/photo-1577416414929-7a4c9f17f6b4?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: '관공서 쾌속 중심의 넘쳐나는 비즈니스 독점권',
        desc: '우체국, 구청, 보건소 등 500m 반경 공공 타운 밀도 중심지에 위치해 공무원, 수속 내방 고객 등 365일 안정적인 매출 사이클을 누립니다.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'valley',
    title: '탑동밸리',
    subTitle: 'INNOVATION VALLEY',
    mainTitle: '첨단 산업 혁신 주거 지구',
    headline: '고부가 지식 인조이 인력과 직접 소통하며 수혜를 거머쥐는 중심',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    slides: [
      {
        title: '1만 8천 평 첨단업무블록과 맞닿은 최일선 배후',
        desc: '탑동 이노베이션밸리 전체 8만 평 중 핵심인 업무용지 A2·A3 블록과 경계를 맞대 수만 명의 첨단산업 인력을 직접적인 독점 배후로 흡수합니다.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: '내부 상가 공급 비율 법적 억제에 따른 높은 희소성',
        desc: '밸리 지구 내 지원시설 법정 용량 30% 한계 및 지상 1,2층만 제한된 상가 구성으로 인해, 가용 F&B 매장 면적과 희소가치가 급히 집중됩니다.',
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800'
      }
    ]
  }
];

export default function LocationAnalysis() {
  const [cardNewsData] = useState(() => {
    const saved = localStorage.getItem('site_custom_cardnews_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse site_custom_cardnews_data:", e);
      }
    }
    return DEFAULT_CARDNEWS_DATA;
  });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Swipe detection parameters
  const touchStartXRef = React.useRef(0);
  const touchEndXRef = React.useRef(0);

  const selectedCategory = cardNewsData.find((c: any) => c.id === activeCategory);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!selectedCategory) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 50) {
      // Swipe left -> Next slide
      handleNext();
    } else if (diff < -50) {
      // Swipe right -> Prev slide
      handlePrev();
    }
  };

  const handleNext = () => {
    if (!selectedCategory) return;
    setActiveSlideIndex((prev) => (prev + 1) % selectedCategory.slides.length);
  };

  const handlePrev = () => {
    if (!selectedCategory) return;
    setActiveSlideIndex((prev) => (prev - 1 + selectedCategory.slides.length) % selectedCategory.slides.length);
  };

  // Stagger configurations for Wallet spread intro
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 85,
        damping: 15
      }
    }
  };

  return (
    <section 
      id="location" 
      className="w-full h-screen h-[100dvh] min-h-[100dvh] flex flex-col relative overflow-hidden bg-white select-none"
      style={{ scrollSnapAlign: 'start' }}
    >
      <style>{`
        #location {
          scroll-snap-align: start;
          scroll-margin-top: 0px;
        }
        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
        .animate-pulse-slow {
          animation: pulseOpacity 3.2s ease-in-out infinite;
        }
      `}</style>

      {/* 2. Upper 60% Area: Deep Navy Background, Edge-to-Edge Full Bleed */}
      <div className={cn(
        "w-full bg-[#030F26] flex flex-col py-4 select-none relative shadow-[inset_0_-30px_60px_rgba(0,0,0,0.25)] border-b border-stone-850 overflow-hidden transition-all duration-300",
        activeCategory ? "h-[75%] sm:h-[75dvh] justify-center items-center" : "h-[60%] sm:h-[60dvh] justify-between"
      )}>
        
        {/* Section Heading over dark background */}
        {!activeCategory && (
          <div className="text-center mb-2 px-4 shrink-0 mt-1 animate-fadeIn">
            <span className="text-accent font-black tracking-[0.25em] text-[10px] sm:text-xs uppercase block mb-1 text-[#f43f5e]">
              LOCATION & PREMIUM
            </span>
            <span className="sr-only">입지분석 및 프리미엄</span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              입지분석 및 프리미엄
            </h2>
            <div className="w-12 h-0.5 bg-[#f43f5e] mx-auto mt-2 rounded-full" />
          </div>
        )}

        {/* Content Box (Centered inside, Full-Bleed Background) */}
        <div className={cn(
          "w-full max-w-[100%] mx-auto px-1 sm:px-2 relative flex flex-col justify-center overflow-hidden transition-all duration-300",
          activeCategory ? "h-full w-full flex-1" : "w-[94%] sm:w-[95%] lg:w-[96%] flex-1"
        )}>
          
          <AnimatePresence mode="wait">
            {!activeCategory ? (
              <motion.div
                key="covers"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="w-full h-full flex flex-col justify-center overflow-hidden"
              >
                
                {/* flex-wrap for mobile (2 columns) and flex-nowrap with flex-1 for PC (4 columns inline) */}
                <div className="flex flex-wrap lg:flex-nowrap gap-3 sm:gap-6 w-full py-2 max-h-[95%] overflow-y-auto justify-center items-stretch shrink-0">
                  {cardNewsData.map((category: any, idx: number) => (
                    <motion.div
                      key={category.id}
                      variants={cardVariants}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setActiveSlideIndex(0);
                      }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer group relative rounded-xl overflow-hidden bg-[#020914] border border-white/10 shadow-[0_12px_24px_rgba(0,0,0,0.45)] aspect-square flex items-center justify-center flex-[1_1_calc(50%-6px)] lg:flex-1 h-full min-w-0"
                    >
                      <img 
                        src={category.coverImage} 
                        alt={`${category.title} : ${category.mainTitle} - ${category.headline} (${category.subTitle})`}
                        className="w-full h-full object-cover aspect-square pointer-events-none transition-transform duration-500 group-hover:scale-103"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* SEO Screen-reader Only Data Blocks for crawler preservation */}
                      <div className="sr-only">
                        <span>{category.title}</span>
                        <span>{category.subTitle}</span>
                        <h3>{category.mainTitle}</h3>
                        <p>{category.headline}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Elegant Museum-style Caption Guidance with Breath Pulse Animation */}
                <div className="text-center mt-3 sm:mt-4 md:mt-5 shrink-0 select-none animate-pulse-slow font-sans text-xs sm:text-[13px] md:text-sm text-white/60 tracking-wider flex items-center justify-center gap-1.5 font-medium">
                  <span>✨</span>
                  <span>자세히 보려면 카드를 클릭해 주세요</span>
                  <span>✨</span>
                </div>

              </motion.div>
            ) : (
              /* [DETAILED INSTA-STYLE SLIDER VIEW] - Simplified Full-Bleed 1:1 Slide aspect ratio containing image with Contain strategy */
              <motion.div
                key="detail"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full relative flex items-center justify-center select-none overflow-hidden"
              >
                
                {/* 1. UI 요소의 절대 위치 지정 (position: absolute;) 또는 상단 여백 확보 */}
                {/* [◁ 뒤로 가기] 버튼 */}
                <button
                  id="detail-back-button"
                  onClick={() => {
                    setActiveCategory(null);
                    setActiveSlideIndex(0);
                  }}
                  className="absolute top-[76px] left-[20px] sm:top-[90px] sm:left-[40px] z-50 bg-[#f43f5e]/20 hover:bg-[#f43f5e]/30 text-[#f43f5e] hover:scale-[1.02] border border-[#f43f5e]/30 px-4 py-2 rounded-full text-xs font-black tracking-tight flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer shadow-lg animate-fadeIn"
                >
                  <ChevronLeft className="w-4 h-4" />
                  ◁ 뒤로 가기
                </button>
                
                {/* 우측 페이지네이션 텍스트 */}
                <span 
                  id="detail-pagination"
                  className="absolute top-[80px] right-[20px] sm:top-[94px] sm:right-[40px] z-50 text-stone-200 font-extrabold text-xs sm:text-sm select-none tracking-wide animate-fadeIn"
                >
                  {selectedCategory.title} ({activeSlideIndex + 1} / {selectedCategory.slides.length})
                </span>

                {/* 2. 1:1 상세 이미지 크기 극대화 (화면 꽉 채우기) - 버튼들과 겹치지 않게 여백 추가 */}
                <div 
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="h-[50vh] sm:h-[56vh] aspect-square max-w-[92vw] max-h-[92vw] sm:max-w-none sm:max-h-none relative overflow-hidden bg-[#020914] rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.65)] border border-white/10 flex items-center justify-center mx-auto mt-20 sm:mt-28"
                >
                  <motion.img 
                    key={activeSlideIndex}
                    src={selectedCategory.slides[activeSlideIndex].image}
                    alt={`${selectedCategory.slides[activeSlideIndex].title} - ${selectedCategory.slides[activeSlideIndex].desc}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-contain aspect-square block select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Left/Right overlay controls (Persistent & Classic) */}
                  <button 
                    onClick={handlePrev}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-black/80 transition-all border border-white/10 shadow-lg cursor-pointer hover:scale-105"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-black/80 transition-all border border-white/10 shadow-lg cursor-pointer hover:scale-105"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Dot indicator Overlay */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-20 flex gap-1 animate-fadeIn">
                    {selectedCategory.slides.map((_: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActiveSlideIndex(i)}
                        className={cn(
                          "h-1 rounded-full transition-all duration-300 focus:outline-none",
                          i === activeSlideIndex ? "bg-[#f43f5e] w-4" : "bg-white/30 w-1 hover:bg-white/50"
                        )}
                      />
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* 2. Bottom 40% Area: Premium Minimalist Light Gray Base - Styled exactly like the left side of the reference image, lifted upward */}
      <div className={cn(
        "w-full bg-white border-t border-stone-150 flex flex-col justify-center items-center relative z-10 overflow-hidden px-6 pb-12 sm:pb-16 md:pb-20 transition-all duration-300",
        activeCategory ? "h-[25%] sm:h-[25dvh]" : "h-[40%] sm:h-[40dvh]"
      )}>
        <div className="w-full max-w-md md:max-w-lg text-left space-y-1.5 sm:space-y-2 md:space-y-2.5 font-sans select-text">
          {/* Label Title */}
          <h4 className="text-[#030F26] font-extrabold text-[#111] text-base sm:text-lg tracking-tight select-none">
            상담전화
          </h4>
          
          {/* Giant Number (Deep elegant hospital blue/indigo matching photo design) */}
          <a 
            href="tel:010-3370-8602"
            className="text-[#113A8C] hover:text-[#f43f5e] font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl tracking-tighter leading-none block transition-colors cursor-pointer"
          >
            010-3370-8602
          </a>
          
          {/* Sub information stack below big number matching referenced weights and sizing */}
          <div className="pt-2 text-stone-500 text-xs sm:text-[13px] md:text-sm font-semibold leading-relaxed space-y-1">
            <div className="flex items-center">
              <span className="text-stone-400 select-none w-20 sm:w-24 shrink-0">대표번호 :</span>
              <a href="tel:031-293-1073" className="hover:text-[#f43f5e] text-stone-700 transition-colors font-bold">
                031-293-1073
              </a>
            </div>
            <div className="flex items-center">
              <span className="text-stone-400 select-none w-20 sm:w-24 shrink-0">운영시간 :</span>
              <span className="text-stone-600">10:00 ~ 17:30 (점심시간 12:00 ~ 13:00)</span>
            </div>
            <div className="flex items-center">
              <span className="text-stone-400 select-none w-20 sm:w-24 shrink-0">내방안내 :</span>
              <span className="text-stone-600 font-bold">주말 · 공휴일 정상 운영</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚨 [SEO 텍스트 보존 및 은닉] Mandatory compliance block for crawler parsing */}
      <div className="sr-only" aria-hidden="true">
        <h2>e편한세상시티 고색 입지분석 및 프리미엄 상권 상세안내</h2>
        {analysisData && analysisData.map((item, index) => (
          <article key={index}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            {item.images && item.images.map((img, imgIdx) => (
              <img key={imgIdx} src={img} alt={`${item.title} - ${item.desc.substring(0, 150)}...`} />
            ))}
          </article>
        ))}
      </div>

    </section>
  );
}
