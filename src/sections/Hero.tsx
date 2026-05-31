import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { PROJECT_INFO } from '../constants';

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  // Filter out any empty URLs to cleanly support custom images
  const rawImages = PROJECT_INFO.heroImages || [];
  const heroImages = rawImages.filter((img: string) => img && img.trim() !== "");
  
  // Fallback if no images are specified
  const finalHeroImages = heroImages.length > 0 ? heroImages : [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2200&auto=format&fit=crop',
  ];

  const nextSlide = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % finalHeroImages.length);
  }, [finalHeroImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + finalHeroImages.length) % finalHeroImages.length);
  }, [finalHeroImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [nextSlide]);

  return (
    <section 
      className="relative bg-stone-900 min-h-screen md:h-screen flex items-center justify-center overflow-hidden py-20 md:py-0"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Background Slideshow - Pure & Responsive */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center brightness-[0.82] contrast-[1.01]"
            style={{ 
              backgroundImage: `url('${finalHeroImages[currentImage]}')`,
              referrerPolicy: 'no-referrer' as any
            }}
          />
        </AnimatePresence>
        
        {/* Center-focused dark gradient: Bright at top/bottom, highly readable in middle text-zone */}
        <div 
          className="absolute inset-0 z-[2]" 
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 40%, rgba(0, 0, 0, 0.6) 65%, rgba(0, 0, 0, 0.4) 100%)'
          }}
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-[10] w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-12 mt-8 md:mt-0 max-w-4xl w-full"
        >
          {/* Brand Name on Top */}
          <span className="text-accent text-sm sm:text-base md:text-xl font-black tracking-wider uppercase mb-3 block drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {PROJECT_INFO.name} 상업시설 & 오피스텔
          </span>
          {/* Main Headline Below Name */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 leading-snug md:leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            {PROJECT_INFO.heroTitleLine1 || '서수원 행정타운의 중심,'}<br />
            <span className="text-white">{PROJECT_INFO.heroTitleLine2 || '브랜드 프리미엄의 완성'}</span>
          </h1>
          {/* Secondary Slogan Below */}
          <p className="text-xs sm:text-sm md:text-base text-white/95 font-medium tracking-wide max-w-2xl mx-auto mb-6 md:mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {PROJECT_INFO.heroSubtitle || '서수원의 미래 가치를 선점하는 압도적 브랜드 파워'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-xs mx-auto sm:max-w-none">
            <a 
              href="#contact" 
              className="w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-5 bg-accent text-white font-bold rounded shadow-2xl transition-all hover:bg-[#e66400] hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-base text-center"
            >
              상담 신청하기
            </a>
            <a 
              href="#overview" 
              className="w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-5 bg-white/10 backdrop-blur-md text-white font-bold border border-white/20 rounded transition-all hover:bg-white/20 shadow-xl text-xs sm:text-sm md:text-base text-center"
            >
              자세히 보기
            </a>
          </div>
        </motion.div>

        {/* Feature Grid Layer - Bottom of Hero */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full">
          {(PROJECT_INFO.heroFeatures || [
            { id: "01", label: "4,400세대 항아리 상권", desc: "고색 1·2지구 4,400여 세대의 중심 상업시설" },
            { id: "02", label: "706병상 메디컬 수요", desc: "수원덕산병원 바로 앞 메인 스트리트" },
            { id: "03", label: "1군 브랜드 프리미엄", desc: "e편한세상 브랜드 프리미엄의 가치" },
            { id: "04", label: "행정타운 365일 상권", desc: "권선구청 등 공공기관 500m 이내 직장인 수요" },
          ]).map((item: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-white/10 backdrop-blur-sm p-4 md:p-6 border-l border-white/20 text-left"
            >
              <span className="text-accent text-[10px] font-bold block mb-1">{item.id}</span>
              <h3 className="text-white text-xs sm:text-sm md:text-base font-bold leading-tight mb-1">{item.label}</h3>
              <p className="text-white/60 text-[9px] sm:text-[10px] md:text-xs leading-normal">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Layer */}
      <div className="absolute inset-x-0 inset-y-0 z-[5] flex items-center justify-between px-4 md:px-12 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white/50 hover:text-white hover:bg-white/20 transition-all pointer-events-auto shadow-lg"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white/50 hover:text-white hover:bg-white/20 transition-all pointer-events-auto shadow-lg"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Layer */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[10] flex gap-3">
        {finalHeroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={cn(
              "h-1 transition-all duration-300 rounded-full",
              idx === currentImage ? "bg-accent w-12" : "bg-white/30 w-3"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <motion.div 
        animate={{ y: [0, 8, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 z-[10]"
      >
        <ArrowDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}
