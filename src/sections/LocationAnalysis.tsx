import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Phone, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { DEFAULT_CARDNEWS_DATA } from '../constants';

const sortSlides = (categoryId: string, slides: any[]): any[] => {
  if (!Array.isArray(slides)) return [];
  const cloned = [...slides];
  
  if (categoryId === 'medical') {
    cloned.sort((a, b) => {
      const getRank = (item: any) => {
        const title = item.title || '';
        if (title.includes('원스톱') || title.includes('메머드') || title.includes('TOP') || title.includes('규모')) return 1;
        if (title.includes('존스홉킨스') || title.includes('의료진') || title.includes('최상위')) return 2;
        if (title.includes('중증') || title.includes('거점') || title.includes('질환') || title.includes('남부')) return 3;
        return 99;
      };
      return getRank(a) - getRank(b);
    });
  } else if (categoryId === 'traffic' || categoryId === 'traffic-infra') {
    cloned.sort((a, b) => {
      const getRank = (item: any) => {
        const title = item.title || '';
        if (title.includes('도보') || title.includes('역세권') || title.includes('직접')) return 1;
        if (title.includes('수원역') || title.includes('GTX') || title.includes('KTX') || title.includes('1정거장')) return 2;
        if (title.includes('신분당선') || title.includes('구운역')) return 3;
        return 99;
      };
      return getRank(a) - getRank(b);
    });
  } else if (categoryId === 'valley' || categoryId === 'topdong') {
    cloned.sort((a, b) => {
      const getRank = (item: any) => {
        const title = item.title || '';
        if (title.includes('맞닿은') || title.includes('첨단업무') || title.includes('1만') || title.includes('일선')) return 1;
        if (title.includes('비율') || title.includes('억제') || title.includes('희소성') || title.includes('공급')) return 2;
        return 99;
      };
      return getRank(a) - getRank(b);
    });
  }
  return cloned;
};

export default function LocationAnalysis() {
  const [cardNewsData] = useState(() => {
    const defaultIds = ['medical', 'traffic', 'topdong', 'admin'];
    
    const applySort = (data: any[]) => {
      if (!Array.isArray(data)) return data;
      return data.map((item: any, idx: number) => {
        const catId = item.id || defaultIds[idx] || `theme-${idx}`;
        return {
          ...item,
          id: catId,
          slides: sortSlides(catId, item.slides || [])
        };
      });
    };

    // 1. Try to load site_custom_cardnews_data
    const savedCardnews = localStorage.getItem('site_custom_cardnews_data');
    if (savedCardnews) {
      try {
        const parsed = JSON.parse(savedCardnews);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0] && Array.isArray(parsed[0].slides)) {
          return applySort(parsed);
        }
      } catch (e) {
        console.error("Failed to parse site_custom_cardnews_data in LocationAnalysis:", e);
      }
    }

    // 2. Fallback to site_custom_analysis_data only if it contains actual slide structures
    const savedAnalysis = localStorage.getItem('site_custom_analysis_data');
    if (savedAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(savedAnalysis);
        if (Array.isArray(parsedAnalysis) && parsedAnalysis.length > 0 && parsedAnalysis[0] && Array.isArray(parsedAnalysis[0].slides)) {
          return applySort(parsedAnalysis);
        }
      } catch (e) {
        console.error("Failed to parse legacy site_custom_analysis_data in LocationAnalysis:", e);
      }
    }
    return applySort(DEFAULT_CARDNEWS_DATA);
  });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const coverScrollRef = useRef<HTMLDivElement>(null);
  const [activeCoverIndex, setActiveCoverIndex] = useState(0);

  const handleCoverScroll = () => {
    if (coverScrollRef.current) {
      const { scrollLeft, clientWidth } = coverScrollRef.current;
      if (clientWidth > 0) {
        const children = coverScrollRef.current.children;
        let minDiff = Infinity;
        let snapIdx = 0;
        const containerCenter = scrollLeft + clientWidth / 2;
        
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          const childCenter = child.offsetLeft + child.clientWidth / 2;
          const diff = Math.abs(containerCenter - childCenter);
          if (diff < minDiff) {
            minDiff = diff;
            snapIdx = i;
          }
        }
        setActiveCoverIndex(snapIdx);
      }
    }
  };

  // Swipe detection parameters
  const touchStartXRef = React.useRef(0);
  const touchEndXRef = React.useRef(0);

  // Swipe vs Click Guard for main category covers
  const isDraggingCoverRef = React.useRef(false);
  const touchStartCoverPosRef = React.useRef({ x: 0, y: 0 });

  const handleCoverTouchStart = (e: React.TouchEvent) => {
    isDraggingCoverRef.current = false;
    touchStartCoverPosRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleCoverTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - touchStartCoverPosRef.current.x);
    const diffY = Math.abs(currentY - touchStartCoverPosRef.current.y);
    if (diffX > 8 || diffY > 8) {
      isDraggingCoverRef.current = true;
    }
  };

  const handleCoverClick = (categoryId: string) => {
    if (isDraggingCoverRef.current) {
      // Swiping action was active, ignore the click trigger
      isDraggingCoverRef.current = false;
      return;
    }
    setActiveCategory(categoryId);
    setActiveSlideIndex(0);
  };

  const selectedCategory = cardNewsData.find((c: any) => c.id === activeCategory);
  const availableSlides = selectedCategory
    ? (selectedCategory.slides || []).filter((s: any) => s && s.image && s.image.trim() !== '')
    : [];

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
    if (availableSlides.length === 0) return;
    setActiveSlideIndex((prev) => (prev + 1) % availableSlides.length);
  };

  const handlePrev = () => {
    if (availableSlides.length === 0) return;
    setActiveSlideIndex((prev) => (prev - 1 + availableSlides.length) % availableSlides.length);
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
      className={cn(
        "w-full flex flex-col relative select-none bg-white",
        activeCategory 
          ? "h-auto overflow-visible" 
          : "h-auto md:h-screen md:h-[100dvh] md:min-h-[100dvh] overflow-visible md:overflow-hidden"
      )}
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

      {/* 2. Upper 60% Area: Deep Navy Background, Edge-to-Edge Full Bleed */}
      <div className={cn(
        "w-full bg-[#F8F9FA] md:bg-[#030F26] flex flex-col select-none relative shadow-[inset_0_-30px_60px_rgba(0,0,0,0.01)] md:shadow-[inset_0_-30px_60px_rgba(0,0,0,0.25)] border-b-0 md:border-b md:border-stone-850 overflow-visible md:overflow-hidden transition-all duration-300 shrink-0",
        activeCategory 
          ? "h-auto py-6 md:py-10 md:min-h-[62vh] justify-center items-center" 
          : "h-auto pb-6 mb-3 md:mb-0 md:pb-2 md:h-[65dvh] justify-between py-3"
      )}>
        
        {/* Section Heading over dark background */}
        {!activeCategory && (
          <div className="text-center mb-4 md:mb-2 px-4 shrink-0 mt-3 md:mt-2 animate-fadeIn">
            <span className="text-accent font-black tracking-[0.25em] text-[10px] sm:text-xs uppercase block mb-1 text-[#f43f5e]">
              LOCATION & PREMIUM
            </span>
            <span className="sr-only">입지분석 및 프리미엄</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1931] md:text-white tracking-tight leading-tight">
              입지분석 및 프리미엄
            </h2>
            <div className="w-12 h-0.5 bg-[#f43f5e] mx-auto mt-1 rounded-full mb-1" />
          </div>
        )}

        {/* Content Box (Centered inside, Full-Bleed Background) */}
        <div className={cn(
          "w-full max-w-[100%] mx-auto px-1 sm:px-2 relative flex flex-col justify-center overflow-visible md:overflow-hidden transition-all duration-300",
          activeCategory ? "h-auto md:h-full w-full flex-1" : "w-[94%] sm:w-[95%] lg:w-[96%] flex-1"
        )}>
          
          <AnimatePresence mode="wait">
            {!activeCategory ? (
              <motion.div
                key="covers"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="w-full h-auto md:h-full flex flex-col justify-center overflow-visible md:overflow-hidden"
              >
                
                {/* flex-wrap for mobile (2 columns) and flex-nowrap with flex-1 for PC (4 columns inline) */}
                <div 
                  ref={coverScrollRef}
                  onScroll={handleCoverScroll}
                  className="flex overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory lg:snap-none no-scrollbar gap-4 sm:gap-6 w-full py-3 pb-3 md:pb-4 px-[14vw] lg:px-0 justify-start lg:justify-center items-center shrink-0"
                >
                  {cardNewsData.map((category: any, idx: number) => (
                    <div 
                      key={category.id} 
                      className="flex flex-col items-center shrink-0 snap-center min-w-0 w-[72vw] max-w-[290px] sm:w-[45vw] sm:max-w-[320px] lg:w-auto lg:max-w-none lg:flex-1"
                    >
                      <motion.div
                        variants={cardVariants}
                        onTouchStart={handleCoverTouchStart}
                        onTouchMove={handleCoverTouchMove}
                        onClick={() => {
                          handleCoverClick(category.id);
                        }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative rounded-xl overflow-hidden bg-white md:bg-[#020914] border border-gray-200/60 md:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:shadow-[0_12px_24px_rgba(0,0,0,0.45)] aspect-square flex items-center justify-center w-full md:cursor-pointer"
                      >
                        {category.coverImage ? (
                          <img 
                            src={category.coverImage} 
                            alt={`${category.title} : ${category.mainTitle} - ${category.headline} (${category.subTitle})`}
                            className="w-full h-full object-cover aspect-square pointer-events-none transition-transform duration-500 group-hover:scale-103"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs font-semibold">이미지 미지정</div>
                        )}
                        
                        {/* SEO Screen-reader Only Data Blocks for crawler preservation */}
                        <div className="sr-only">
                          <span>{category.title}</span>
                          <span>{category.subTitle}</span>
                          <h3>{category.mainTitle}</h3>
                          <p>{category.headline}</p>
                        </div>
                      </motion.div>

                      {/* 상세보기 button placed cleanly below the aspect-square image on mobile */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setActiveCategory(category.id);
                          setActiveSlideIndex(0);
                        }}
                        onTouchEnd={(e) => {
                          // Prevent scroll interference, open immediately
                          e.stopPropagation();
                          e.preventDefault();
                          setActiveCategory(category.id);
                          setActiveSlideIndex(0);
                        }}
                        className="mt-4 bg-white px-6 py-3 rounded-full border border-[#005B5B] text-[#005B5B] text-xs font-black tracking-wider flex items-center justify-center gap-1 transition-all duration-300 w-full hover:bg-teal-50/50 active:scale-95 cursor-pointer z-35 md:hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                      >
                        <span>상세보기</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#005B5B]" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Instagram-style paging dots (● ○ ○ ○) */}
                <div className="flex md:hidden justify-center gap-2 mt-4 select-none">
                  {cardNewsData.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        activeCoverIndex === i 
                          ? "w-5 bg-[#005B5B] md:bg-[#45ffde]" 
                          : "w-2 bg-gray-300 md:bg-white/20"
                      )}
                    />
                  ))}
                </div>

                {/* Elegant Museum-style Caption Guidance with Breath Pulse Animation */}
                <div className="text-center mt-3 sm:mt-4 md:mt-4 shrink-0 select-none font-sans font-medium tracking-tight flex flex-col items-center justify-center pb-2">
                  <span 
                    className="block md:hidden text-[13px] sm:text-sm font-bold text-slate-500 select-none animate-pulse"
                  >
                    👉 좌우로 넘겨 입지 프리미엄 모아보기
                  </span>
                  <div className="hidden md:flex items-center justify-center select-none text-center">
                    <span className="text-xs sm:text-[13px] md:text-sm text-[#45ffde] tracking-wider font-extrabold animate-pulse">
                      ✨ 자세히 보시려면 카드뉴스를 클릭해주세요 ✨
                    </span>
                  </div>
                </div>

              </motion.div>
            ) : (
              /* [DETAILED INSTA-STYLE SLIDER VIEW] - Perfect alignment with the exact image container width */
              <motion.div
                key="detail"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-auto relative flex flex-col items-center justify-center select-none"
              >
                {/* Unified width wrapper that aligns pagination & slide tightly and close together */}
                <div className="flex flex-col items-center justify-center w-full max-w-[92vw] sm:max-w-[480px] md:max-w-[500px] lg:max-w-[520px] mx-auto space-y-4 z-30 relative py-4 select-none animate-fadeIn">
                  
                  {/* Top Bar directly touching image width bound */}
                  <div className="w-full flex justify-between items-center px-4 py-2 sm:py-1 rounded-xl bg-black/40 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
                    <button
                      id="detail-back-button"
                      onClick={() => {
                        setActiveCategory(null);
                        setActiveSlideIndex(0);
                      }}
                      className="text-[#f43f5e] hover:text-[#f43f5e]/80 text-xs sm:text-sm font-black tracking-tight flex items-center gap-1 transition-all focus:outline-none cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#f43f5e]" />
                      뒤로 가기
                    </button>
                    
                    {/* 우측 페이지네이션 텍스트 - 다 하얀색으로 폰트 바꿔줘 */}
                    <span 
                      id="detail-pagination"
                      className="text-white font-extrabold text-xs sm:text-sm select-none tracking-tight block drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] sm:drop-shadow-none"
                    >
                      {selectedCategory.title} ({availableSlides.length > 0 ? activeSlideIndex + 1 : 0} / {availableSlides.length})
                    </span>
                  </div>

                  {/* 1:1 Image Container with Arrows Absolutely Positioned Outside */}
                  {availableSlides.length > 0 ? (
                    <div 
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className="w-full aspect-square relative overflow-visible bg-[#020914] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 flex items-center justify-center"
                    >
                      <motion.img 
                        key={activeSlideIndex}
                        src={availableSlides[activeSlideIndex].image}
                        alt={`${availableSlides[activeSlideIndex].title || ""} - ${availableSlides[activeSlideIndex].desc || ""}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-contain aspect-square block select-none pointer-events-none rounded-3xl"
                        referrerPolicy="no-referrer"
                      />

                      {/* Left Button - Physically Outside the Image via Absolute Positioning */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        className="absolute -left-4 sm:-left-12 md:-left-14 lg:-left-16 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#020914]/90 hover:bg-black text-white hover:text-[#45ffde] rounded-full transition-all border border-white/10 shadow-lg cursor-pointer hover:scale-105 z-35"
                      >
                        <ChevronLeft className="w-5 h-5 shrink-0" />
                      </button>

                      {/* Right Button - Physically Outside the Image via Absolute Positioning */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="absolute -right-4 sm:-right-12 md:-right-14 lg:-right-16 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#020914]/90 hover:bg-black text-white hover:text-[#45ffde] rounded-full transition-all border border-white/10 shadow-lg cursor-pointer hover:scale-105 z-35"
                      >
                        <ChevronRight className="w-5 h-5 shrink-0" />
                      </button>

                      {/* Navigation Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-20 flex gap-1">
                        {availableSlides.map((_: any, i: number) => (
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
                  ) : (
                    <div className="w-full py-12 flex flex-col items-center justify-center rounded-3xl bg-black/10 border border-white/5 text-slate-400 text-xs font-semibold">
                      등록된 상세 카드뉴스가 없습니다.
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* 2. Bottom 40% Area: Premium Minimalist Classic Light Base - Handled dynamically when open to prevent overlap and push down */}
      <div className={cn(
        "w-full bg-white border-0 flex flex-col justify-start md:justify-center items-center relative z-10 overflow-visible md:overflow-hidden px-6 pt-0 pb-6 md:py-0 transition-all duration-300 shrink-0",
        activeCategory ? "h-auto py-6 md:py-8 md:h-auto" : "h-auto md:h-[35dvh]"
      )}>
        <div className={cn(
          "w-full max-w-md md:max-w-4xl text-left font-sans select-text mt-2 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start",
          activeCategory ? "md:translate-y-0" : "md:-translate-y-12"
        )}>
          {/* Left Side: 상담전화, 번호, 연결안내 */}
          <div className="space-y-1.5 sm:space-y-2 md:space-y-4">
            {/* Label Title */}
            <h4 className="text-[#333333] font-extrabold text-sm sm:text-base tracking-widest uppercase select-none">
              상담전화
            </h4>
            
            {/* Giant Number (Styled with custom Deep Teal #005B5B & thick Extra Bold weight) */}
            <div className="group relative block">
              <a 
                href="tel:010-3370-8602"
                className="font-sans font-black text-4xl sm:text-5xl md:text-5xl lg:text-5xl tracking-tighter leading-none inline-block transition-all duration-200 cursor-pointer text-[#005B5B] hover:text-[#006666] hover:underline hover:scale-[1.01]"
              >
                010-3370-8602
              </a>
              
              {/* [전화 연결 안내 카피 추가] */}
              <a 
                href="tel:010-3370-8602"
                className="mt-3 flex items-center gap-1.5 text-sm sm:text-base font-semibold tracking-tight transition-all duration-200 cursor-pointer hover:underline text-[#64748b]"
              >
                <span className="text-[#005B5B] font-bold mr-0.5">📞</span>
                <span>번호를 터치하시면 홍보관으로 바로 연결됩니다.</span>
              </a>
            </div>
          </div>
          
          {/* Right Side: 대표번호, 운영시간, 내방안내 */}
          <div className="pt-5 md:pt-0 text-[#333333] text-sm sm:text-base md:text-sm font-semibold leading-relaxed space-y-2 md:space-y-3.5 border-t md:border-t-0 border-gray-200/60 mt-5 md:mt-4 self-start md:self-center">
            <div className="flex items-center">
              <span className="text-[#666666] select-none w-24 sm:w-28 shrink-0 font-bold">대표번호 :</span>
              <a href="tel:031-293-1073" className="text-[#333333] hover:text-[#005B5B] hover:underline transition-colors font-bold">
                031-293-1073
              </a>
            </div>
            <div className="flex items-center">
              <span className="text-[#666666] select-none w-24 sm:w-28 shrink-0 font-bold">운영시간 :</span>
              <span className="text-[#333333]">10:00 ~ 17:30 (점심시간 12:00 ~ 13:00)</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#666666] select-none w-24 sm:w-28 shrink-0 font-bold">내방안내 :</span>
              <span className="text-[#333333] font-bold">주말 · 공휴일 정상 운영</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚨 [SEO 텍스트 보존 및 은닉] Mandatory compliance block for crawler parsing */}
      <div className="sr-only" aria-hidden="true">
        <h2>e편한세상시티 고색 입지분석 및 프리미엄 상권 상세안내</h2>
        {cardNewsData && cardNewsData.map((item: any, index: number) => (
          <article key={item.id || `seo-theme-${index}`}>
            <h3>{item.title} - {item.mainTitle}</h3>
            <p>{item.headline}</p>
            {item.slides && item.slides.map((slide: any, slideIdx: number) => (
              <div key={slideIdx}>
                <h4>{slide.title}</h4>
                <p>{slide.desc}</p>
                {slide.image ? <img src={slide.image} alt={slide.title} /> : null}
              </div>
            ))}
          </article>
        ))}
      </div>

    </section>
  );
}
