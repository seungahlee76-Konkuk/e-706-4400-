import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Phone, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { DEFAULT_CARDNEWS_DATA } from '../constants';

export default function LocationAnalysis() {
  const [cardNewsData] = useState(() => {
    // 1. Try to load site_custom_analysis_data edited in the Admin Panel
    const savedAnalysis = localStorage.getItem('site_custom_analysis_data');
    if (savedAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(savedAnalysis);
        if (Array.isArray(parsedAnalysis) && parsedAnalysis.length > 0) {
          // If already in the new format with slides, return directly
          if (parsedAnalysis[0] && Array.isArray(parsedAnalysis[0].slides)) {
            return parsedAnalysis;
          }

          const categoriesInfo = [
            { id: 'medical', title: '의료', subTitle: 'MEDICAL PREMIUM', headline: '706병상 수원 최대 핵심 메디컬 타워 바로 앞 초밀착 입지' },
            { id: 'traffic', title: '교통', subTitle: 'TRAFFIC INFRASTRUCTURE', headline: '수인분당선 직통 주파 및 광역 신설 교통망 of 초강력 집결형 노선' },
            { id: 'admin', title: '행정', subTitle: 'GOVERNMENT TOWN', headline: '구청·보건소·우체국을 밀착하여 품은 평일/주말 365일 배후지' },
            { id: 'valley', title: '탑동밸리', subTitle: 'INNOVATION VALLEY', headline: '고부가 지식 인조이 인력과 직접 소통하며 수혜를 거머쥐는 중심' }
          ];

          return parsedAnalysis.map((item: any, idx: number) => {
            const cat = categoriesInfo[idx] || {
              id: `cat_${idx}`,
              title: item.title || `입지 ${idx + 1}`,
              subTitle: 'PREMIUM',
              headline: item.title || `입지 ${idx + 1}`
            };

            const images = Array.isArray(item.images)
              ? item.images.filter((img: string) => img && img.trim() !== '')
              : [];

            const defaultCat = DEFAULT_CARDNEWS_DATA[idx] || DEFAULT_CARDNEWS_DATA[0];
            const finalImages = images.length > 0 ? images : defaultCat.slides.map((s: any) => s.image);
            const coverImg = images.length > 0 ? images[0] : defaultCat.coverImage;

            return {
              id: cat.id,
              title: cat.title,
              subTitle: cat.subTitle,
              mainTitle: item.title || defaultCat.mainTitle,
              headline: cat.headline,
              coverImage: coverImg,
              slides: finalImages.map((img: string, sIdx: number) => {
                const defaultSlide = (defaultCat.slides && defaultCat.slides[sIdx]) || {
                  title: `${item.title || cat.title} 상세 #${sIdx + 1}`,
                  desc: ''
                };
                return {
                  title: defaultSlide.title,
                  desc: defaultSlide.desc,
                  image: img
                };
               })
             };
           });
         }
       } catch (e) {
         console.error("Failed to parse site_custom_analysis_data in LocationAnalysis:", e);
       }
     }
 
     // 2. Fallback to site_custom_cardnews_data
     const savedCardnews = localStorage.getItem('site_custom_cardnews_data');
     if (savedCardnews) {
       try {
         return JSON.parse(savedCardnews);
       } catch (e) {
         console.error("Failed to parse site_custom_cardnews_data in LocationAnalysis:", e);
       }
     }
     return DEFAULT_CARDNEWS_DATA;
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
      className="w-full h-auto md:h-screen md:h-[100dvh] md:min-h-[100dvh] flex flex-col relative overflow-visible md:overflow-hidden bg-white select-none"
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
        "w-full bg-[#F8F9FA] md:bg-[#030F26] flex flex-col py-3 select-none relative shadow-[inset_0_-30px_60px_rgba(0,0,0,0.01)] md:shadow-[inset_0_-30px_60px_rgba(0,0,0,0.25)] border-b-0 md:border-b md:border-stone-850 overflow-visible md:overflow-hidden transition-all duration-300 shrink-0",
        activeCategory 
          ? "h-auto py-12 md:h-[75dvh] justify-center items-center" 
          : "h-auto pb-6 mb-3 md:mb-0 md:pb-2 md:h-[65dvh] justify-between"
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
                          // On desktop (>=768px), allow full card click to open details
                          if (window.innerWidth >= 768) {
                            setActiveCategory(category.id);
                            setActiveSlideIndex(0);
                          }
                        }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative rounded-xl overflow-hidden bg-white md:bg-[#020914] border border-gray-200/60 md:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:shadow-[0_12px_24px_rgba(0,0,0,0.45)] aspect-square flex items-center justify-center w-full md:cursor-pointer"
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
                  className="absolute top-[16px] left-[20px] sm:top-[90px] sm:left-[40px] z-50 text-[#f43f5e] hover:text-[#f43f5e]/80 text-xs font-bold tracking-tight flex items-center gap-1 transition-all focus:outline-none cursor-pointer animate-fadeIn"
                >
                  <ChevronLeft className="w-4 h-4" />
                  뒤로 가기
                </button>
                
                {/* 우측 페이지네이션 텍스트 */}
                <span 
                  id="detail-pagination"
                  className="absolute top-[20px] right-[20px] sm:top-[94px] sm:right-[40px] z-50 text-black font-bold text-xs select-none tracking-tight animate-fadeIn"
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

      {/* 2. Bottom 40% Area: Premium Minimalist Classic Light Base - Seamlessly integrated with pure white background */}
      <div className={cn(
        "w-full bg-white border-0 flex flex-col justify-start md:justify-center items-center relative z-10 overflow-visible md:overflow-hidden px-6 pt-0 pb-6 md:py-0 transition-all duration-300 shrink-0",
        activeCategory ? "h-auto md:h-[25dvh]" : "h-auto md:h-[35dvh]"
      )}>
        <div className="w-full max-w-md md:max-w-4xl text-left font-sans select-text mt-2 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start md:-translate-y-12">
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
          <article key={index}>
            <h3>{item.title} - {item.mainTitle}</h3>
            <p>{item.headline}</p>
            {item.slides && item.slides.map((slide: any, slideIdx: number) => (
              <div key={slideIdx}>
                <h4>{slide.title}</h4>
                <p>{slide.desc}</p>
                <img src={slide.image} alt={slide.title} />
              </div>
            ))}
          </article>
        ))}
      </div>

    </section>
  );
}
